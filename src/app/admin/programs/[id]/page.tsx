"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, Link as LinkIcon, FileText, Globe } from "lucide-react";
import Link from "next/link";

export default function EditProgram({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("general");
    const [formData, setFormData] = useState({
        title: "",
        category: "Degree Breaking",
        description: "",
        content: "",
        slug: "",
        metaTitle: "",
        metaDescription: "",
        keywords: ""
    });

    useEffect(() => {
        const fetchProgram = async () => {
            try {
                const res = await fetch(`/api/admin/programs/${resolvedParams.id}`);
                if (!res.ok) throw new Error("Failed to fetch program");
                const data = await res.json();
                setFormData({
                    title: data.title || "",
                    category: data.category || "Degree Breaking",
                    description: data.description || "",
                    content: data.content || "",
                    slug: data.slug || "",
                    metaTitle: data.metaTitle || "",
                    metaDescription: data.metaDescription || "",
                    keywords: data.keywords?.join(", ") || ""
                });
            } catch {
                console.error("Error loading program");
                alert("Error loading program");
            } finally {
                setLoading(false);
            }
        };
        fetchProgram();
    }, [resolvedParams.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/programs/${resolvedParams.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    keywords: formData.keywords.split(",").map(k => k.trim()).filter(k => k)
                })
            });
            if (!res.ok) throw new Error("Failed to save");
            alert("Program updated successfully!");
            router.refresh();
        } catch {
            alert("Error saving program");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-primary" /></div>;

    return (
        <div className="max-w-5xl mx-auto animate-[fadeIn_0.5s_ease-out_forwards] pb-20">
            <Link href="/admin/programs" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary mb-6 transition-colors font-medium">
                <ArrowLeft size={18} /> Back to Programs
            </Link>

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">Edit Program</h1>
                    <p className="text-slate-500">Update program details and configuration.</p>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg hover:shadow-slate-900/20 disabled:opacity-50 bg-slate-900 text-white hover:bg-slate-800"
                >
                    {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    Save Changes
                </button>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="flex border-b border-slate-200 bg-slate-50 p-2 gap-2">
                    <button
                        onClick={() => setActiveTab("general")}
                        className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === "general"
                            ? "bg-white text-primary shadow-sm ring-1 ring-slate-200"
                            : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                            }`}
                    >
                        <FileText size={16} />
                        General Info
                    </button>
                    <button
                        onClick={() => setActiveTab("seo")}
                        className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === "seo"
                            ? "bg-white text-primary shadow-sm ring-1 ring-slate-200"
                            : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                            }`}
                    >
                        <Globe size={16} />
                        SEO Settings
                    </button>
                </div>

                <form className="p-8 space-y-6">
                    {activeTab === "general" ? (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Program Title</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full p-4 rounded-xl bg-white border-2 border-slate-200 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 text-slate-900 font-bold transition-all placeholder:text-slate-400"
                                        placeholder="e.g. Master of Business Administration"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Category</label>
                                    <div className="relative">
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full p-4 rounded-xl bg-white border-2 border-slate-200 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 text-slate-900 font-bold transition-all appearance-none"
                                        >
                                            <option value="Degree Breaking">Degree Breaking</option>
                                            <option value="Fast Track">Fast Track</option>
                                            <option value="Online Degree">Online Degree</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1 flex items-center gap-2">
                                    <LinkIcon size={14} /> URL Slug
                                </label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="w-full p-4 rounded-xl bg-white border-2 border-slate-200 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 font-mono text-sm text-slate-700 transition-all"
                                    placeholder="e.g. master-business-administration"
                                />
                                <p className="text-xs text-slate-400 pl-1">The URL-friendly version of the name. Must be unique.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Short Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full p-4 rounded-xl bg-white border-2 border-slate-200 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 min-h-[100px] text-slate-900 font-medium transition-all"
                                    placeholder="Brief summary of the program..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Full Content (HTML)</label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full p-4 rounded-xl bg-white border-2 border-slate-200 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 min-h-[300px] text-slate-900 font-mono text-sm transition-all"
                                    placeholder="<p>Detailed program content goes here...</p>"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 max-w-3xl">
                            <div className="bg-sky-50 border border-sky-100 p-6 rounded-2xl flex items-start gap-4 text-sky-800">
                                <Globe className="shrink-0 mt-1" size={20} />
                                <div>
                                    <h4 className="font-bold mb-1">Search Engine Optimization</h4>
                                    <p className="text-sm opacity-80">These settings control how this program appears in search engine results. If left blank, we&apos;ll automatically generate them from the program title and description.</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Meta Title</label>
                                <input
                                    type="text"
                                    value={formData.metaTitle}
                                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                                    placeholder={formData.title}
                                    className="w-full p-4 rounded-xl bg-white border-2 border-slate-200 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 text-slate-900 font-bold"
                                />
                                <div className="flex justify-between pl-1">
                                    <p className="text-xs text-slate-400">Ideally 50-60 characters.</p>
                                    <p className={`text-xs font-bold ${(formData.metaTitle?.length || 0) > 60 ? 'text-amber-500' : 'text-slate-300'}`}>
                                        {formData.metaTitle?.length || 0} / 60
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Meta Description</label>
                                <textarea
                                    value={formData.metaDescription}
                                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                                    placeholder={formData.description}
                                    className="w-full p-4 rounded-xl bg-white border-2 border-slate-200 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 min-h-[100px] text-slate-900 font-medium"
                                />
                                <div className="flex justify-between pl-1">
                                    <p className="text-xs text-slate-400">Ideally 150-160 characters.</p>
                                    <p className={`text-xs font-bold ${(formData.metaDescription?.length || 0) > 160 ? 'text-amber-500' : 'text-slate-300'}`}>
                                        {formData.metaDescription?.length || 0} / 160
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Keywords</label>
                                <input
                                    type="text"
                                    value={formData.keywords}
                                    onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                                    className="w-full p-4 rounded-xl bg-white border-2 border-slate-200 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 text-slate-900 font-bold"
                                    placeholder="e.g. mbbs, online degree, fast track"
                                />
                                <p className="text-xs text-slate-400 pl-1">Comma separated list of focus keywords.</p>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
