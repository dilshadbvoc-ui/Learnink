"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Loader2, Star } from "lucide-react";

interface Testimonial {
    _id: string;
    name: string;
    content: string;
    role?: string;
    imageUrl?: string;
    rating: number;
    order: number;
}

export default function AdminTestimonials() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [name, setName] = useState("");
    const [content, setContent] = useState("");
    const [role, setRole] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [rating, setRating] = useState(5);
    const [order, setOrder] = useState("0");

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const res = await fetch("/api/admin/testimonials");
            if (res.ok) {
                const data = await res.json();
                setTestimonials(data);
            }
        } catch (error) {
            console.error("Failed to fetch testimonials", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const res = await fetch("/api/admin/testimonials", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, content, role, imageUrl, rating, order: parseInt(order) }),
            });

            if (res.ok) {
                setName("");
                setContent("");
                setRole("");
                setImageUrl("");
                setOrder((prev) => (parseInt(prev) + 1).toString());
                fetchTestimonials();
            }
        } catch (error) {
            console.error("Failed to add testimonial", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
            fetchTestimonials();
        } catch (error) {
            console.error("Failed to delete testimonial", error);
        }
    };

    return (
        <div className="animate-[fade-in_0.5s_ease-out_forwards] space-y-8 pb-20">
            <div>
                <h1 className="text-3xl font-black text-slate-800 mb-2">Testimonials</h1>
                <p className="text-slate-600 font-medium">Manage student reviews and success stories.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 sticky top-10">
                        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100 text-slate-800">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary-dark">
                                <Plus size={20} />
                            </div>
                            <h3 className="text-xl font-bold">Add Testimonial</h3>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Student Name</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3.5 rounded-xl bg-white border-2 border-slate-200 focus:border-primary focus:outline-none transition-all font-bold" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Role/Program</label>
                                <input type="text" value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-4 py-3.5 rounded-xl bg-white border-2 border-slate-200 focus:border-primary focus:outline-none transition-all font-bold" placeholder="e.g. MBA Student" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Rating (1-5)</label>
                                <input type="number" min="1" max="5" value={rating} onChange={(e) => setRating(parseInt(e.target.value))} className="w-full px-4 py-3.5 rounded-xl bg-white border-2 border-slate-200 focus:border-primary focus:outline-none transition-all font-bold" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Content</label>
                                <textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full px-4 py-3.5 rounded-xl bg-white border-2 border-slate-200 focus:border-primary focus:outline-none transition-all font-medium h-32" required />
                            </div>
                            <button type="submit" disabled={submitting} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95 disabled:opacity-50">
                                {submitting ? <Loader2 className="animate-spin" /> : "Publish Testimonial"}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    {loading ? (
                        <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary" size={40} /></div>
                    ) : (
                        <div className="space-y-4">
                            {testimonials.map((item) => (
                                <div key={item._id} className="bg-white p-6 rounded-3xl border border-slate-200 flex items-start gap-6 group hover:border-primary/50 transition-all">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h4 className="font-black text-slate-800">{item.name}</h4>
                                            <div className="flex text-violet-500"><Star size={12} className="fill-current" /></div>
                                        </div>
                                        <p className="text-slate-500 text-sm italic">&quot;{item.content}&quot;</p>
                                    </div>
                                    <button onClick={() => handleDelete(item._id)} className="p-3 text-slate-300 hover:text-rose-500 transition-colors">
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
