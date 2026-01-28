"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Program {
    _id: string;
    title: string;
    category: string;
    description: string;
}

export default function AdminPrograms() {
    const router = useRouter();
    const [programs, setPrograms] = useState<Program[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        fetchPrograms();
    }, []);

    const fetchPrograms = async () => {
        try {
            const res = await fetch("/api/admin/programs");
            const data = await res.json();
            setPrograms(data);
        } catch {
            console.error("Failed to fetch programs");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        setCreating(true);
        try {
            const res = await fetch("/api/admin/programs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: "New Program",
                    category: "Degree Breaking",
                    description: "Draft program description",
                    slug: `new-program-${Date.now()}`
                })
            });
            const newProgram = await res.json();
            router.push(`/admin/programs/${newProgram._id}`);
        } catch {
            alert("Failed to create new program");
            setCreating(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this program?")) return;
        try {
            await fetch(`/api/admin/programs/${id}`, { method: "DELETE" });
            fetchPrograms();
        } catch {
            alert("Failed to delete program");
        }
    };

    const filteredPrograms = programs.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-primary" /></div>;

    return (
        <div className="animate-[fadeIn_0.5s_ease-out_forwards] space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 mb-2">Manage Programs</h1>
                    <p className="text-slate-600 font-medium">Add, edit or remove educational offerings.</p>
                </div>
                <button
                    onClick={handleCreate}
                    disabled={creating}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-lg shadow-slate-900/20 self-start md:self-auto disabled:opacity-50 bg-slate-900 text-white hover:bg-slate-800 transition-all"
                >
                    {creating ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                    Add New Program
                </button>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden">
                <div className="relative mb-8">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search programs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 rounded-xl bg-white border-2 border-slate-200 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="pb-4 font-bold text-slate-500 uppercase tracking-widest text-xs px-4">Title</th>
                                <th className="pb-4 font-bold text-slate-500 uppercase tracking-widest text-xs px-4">Category</th>
                                <th className="pb-4 font-bold text-slate-500 uppercase tracking-widest text-xs px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredPrograms.map((program) => (
                                <tr key={program._id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="py-6 px-4">
                                        <p className="font-bold text-slate-800 group-hover:text-primary transition-colors text-lg mb-1">{program.title}</p>
                                        <p className="text-sm text-slate-600 font-medium">{program.description?.substring(0, 50)}...</p>
                                    </td>
                                    <td className="py-6 px-4">
                                        <span className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider border border-slate-200">
                                            {program.category}
                                        </span>
                                    </td>
                                    <td className="py-6 px-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/programs/${program._id}`}
                                                className="p-2.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                                            >
                                                <Pencil size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(program._id)}
                                                className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredPrograms.length === 0 && (
                        <div className="text-center py-20 text-slate-400 font-medium">
                            No programs found matching your search.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
