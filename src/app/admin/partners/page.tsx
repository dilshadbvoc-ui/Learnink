"use client";

import { useState, useEffect } from "react";
import { Plus, Building2, Trash2, Loader2 } from "lucide-react";

interface Partner {
    _id: string;
    name: string;
    slug: string;
    logo: string;
    description: string;
    programs: string[];
    enrollLink?: string;
    order: number;
}

interface Program {
    _id: string;
    title: string;
}

export default function AdminPartners() {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [logo, setLogo] = useState("");
    const [description, setDescription] = useState("");
    const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
    const [enrollLink, setEnrollLink] = useState("");
    const [order, setOrder] = useState("0");
    const [allPrograms, setAllPrograms] = useState<Program[]>([]);

    useEffect(() => {
        fetchPartners();
        fetchPrograms();
    }, []);

    const fetchPrograms = async () => {
        try {
            const res = await fetch("/api/programs");
            if (res.ok) {
                const data = await res.json();
                setAllPrograms(data);
            }
        } catch (error) {
            console.error("Failed to fetch programs", error);
        }
    };

    const fetchPartners = async () => {
        try {
            const res = await fetch("/api/partners");
            if (res.ok) {
                const data = await res.json();
                setPartners(data);
            }
        } catch (error) {
            console.error("Failed to fetch partners", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const res = await fetch("/api/partners", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    slug: slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
                    logo,
                    description,
                    programs: selectedPrograms,
                    enrollLink,
                    order: parseInt(order)
                }),
            });

            if (res.ok) {
                setName("");
                setSlug("");
                setLogo("");
                setDescription("");
                setSelectedPrograms([]);
                setEnrollLink("");
                setOrder((prev) => (parseInt(prev) + 1).toString());
                fetchPartners();
            }
        } catch (error) {
            console.error("Failed to add partner", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this university?")) return;
        try {
            const res = await fetch(`/api/admin/partners/${id}`, { method: "DELETE" });
            if (res.ok) fetchPartners();
        } catch (error) {
            console.error("Failed to delete partner", error);
        }
    };

    return (
        <div className="animate-[fade-in_0.5s_ease-out_forwards] space-y-8 pb-20">
            <div>
                <h1 className="text-3xl font-black text-slate-800 mb-2">Partner Universities</h1>
                <p className="text-slate-600 font-medium">Manage the universities and educational institutions showcased on the home page.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add Partner Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 sticky top-10">
                        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100 text-slate-800">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary-dark">
                                <Plus size={20} />
                            </div>
                            <h3 className="text-xl font-bold">Add New University</h3>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">University Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3.5 rounded-xl bg-white border-2 border-slate-200 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-slate-900 font-bold placeholder:text-slate-400"
                                    placeholder="e.g. Oxford University"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Logo URL</label>
                                <input
                                    type="url"
                                    value={logo}
                                    onChange={(e) => setLogo(e.target.value)}
                                    className="w-full px-4 py-3.5 rounded-xl bg-white border-2 border-slate-200 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-slate-900 font-bold placeholder:text-slate-400"
                                    placeholder="https://..."
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">URL Slug (leave blank to auto-generate)</label>
                                <input
                                    type="text"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    className="w-full px-4 py-3.5 rounded-xl bg-white border-2 border-slate-200 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-slate-900 font-bold placeholder:text-slate-400"
                                    placeholder="oxford-university"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-4 py-3.5 rounded-xl bg-white border-2 border-slate-200 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-slate-900 font-bold placeholder:text-slate-400 min-h-[120px]"
                                    placeholder="Detailed information about the university..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Available Programs</label>
                                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto p-4 border-2 border-slate-200 rounded-xl bg-slate-50">
                                    {allPrograms.map(program => (
                                        <label key={program._id} className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedPrograms.includes(program._id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedPrograms([...selectedPrograms, program._id]);
                                                    } else {
                                                        setSelectedPrograms(selectedPrograms.filter(id => id !== program._id));
                                                    }
                                                }}
                                                className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
                                            />
                                            <span className="text-sm font-bold text-slate-700">{program.title}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Direct Enroll Link (Optional)</label>
                                <input
                                    type="url"
                                    value={enrollLink}
                                    onChange={(e) => setEnrollLink(e.target.value)}
                                    className="w-full px-4 py-3.5 rounded-xl bg-white border-2 border-slate-200 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-slate-900 font-bold placeholder:text-slate-400"
                                    placeholder="https://..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Display Order</label>
                                <input
                                    type="number"
                                    value={order}
                                    onChange={(e) => setOrder(e.target.value)}
                                    className="w-full px-4 py-3.5 rounded-xl bg-white border-2 border-slate-200 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-slate-900 font-bold placeholder:text-slate-400"
                                    placeholder="0"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 mt-4 border border-transparent"
                            >
                                {submitting ? <Loader2 className="animate-spin" /> : <><Plus size={20} /> Add University</>}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Partners List */}
                <div className="lg:col-span-2 space-y-6">
                    {loading ? (
                        <div className="flex justify-center p-20">
                            <Loader2 className="animate-spin text-primary" size={40} />
                        </div>
                    ) : partners.length === 0 ? (
                        <div className="bg-white p-20 rounded-[2rem] border border-slate-200 text-center flex flex-col items-center shadow-sm">
                            <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 text-slate-300">
                                <Building2 size={48} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">No Universities Added</h3>
                            <p className="text-slate-500 font-medium">Add your first university to see them listed here.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {partners.map((partner) => (
                                <div key={partner._id} className="bg-white p-6 rounded-[2rem] border border-slate-200 flex items-center gap-5 group hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all relative overflow-hidden">
                                    <div className="w-24 h-24 rounded-2xl bg-white border border-slate-100 p-4 flex items-center justify-center shadow-inner">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={partner.logo} alt={partner.name} className="w-full h-full object-contain mix-blend-multiply" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-lg font-bold text-slate-800 mb-2 truncate" title={partner.name}>{partner.name}</h4>
                                        <p className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg inline-block border border-slate-200">
                                            Order: {partner.order}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(partner._id)}
                                        className="p-3 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100 absolute top-4 right-4"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
