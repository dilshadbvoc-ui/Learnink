"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import NextImage from "next/image";

interface Photo {
    _id: string;
    imageUrl: string;
    caption?: string;
    order: number;
}

export default function AdminGallery() {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [imageUrl, setImageUrl] = useState("");
    const [caption, setCaption] = useState("");
    const [order, setOrder] = useState("0");

    useEffect(() => {
        fetchPhotos();
    }, []);

    const fetchPhotos = async () => {
        try {
            const res = await fetch("/api/admin/gallery");
            if (res.ok) {
                const data = await res.json();
                setPhotos(data);
            }
        } catch (error) {
            console.error("Failed to fetch gallery", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const res = await fetch("/api/admin/gallery", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ imageUrl, caption, order: parseInt(order) }),
            });

            if (res.ok) {
                setImageUrl("");
                setCaption("");
                setOrder((prev) => (parseInt(prev) + 1).toString());
                fetchPhotos();
            }
        } catch (error) {
            console.error("Failed to add photo", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            const res = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
            if (res.ok) fetchPhotos();
        } catch (error) {
            console.error("Failed to delete photo", error);
        }
    };

    return (
        <div className="animate-[fade-in_0.5s_ease-out_forwards] space-y-8 pb-20">
            <div>
                <h1 className="text-3xl font-black text-slate-800 mb-2">Photo Gallery</h1>
                <p className="text-slate-600 font-medium">Add photos of your campus, events, and milestones.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 sticky top-10">
                        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100 text-slate-800">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary-dark">
                                <Plus size={20} />
                            </div>
                            <h3 className="text-xl font-bold">Add Photo</h3>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Image URL</label>
                                <input
                                    type="url"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    className="w-full px-4 py-3.5 rounded-xl bg-white border-2 border-slate-200 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-slate-900 font-bold"
                                    placeholder="https://..."
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Caption</label>
                                <input
                                    type="text"
                                    value={caption}
                                    onChange={(e) => setCaption(e.target.value)}
                                    className="w-full px-4 py-3.5 rounded-xl bg-white border-2 border-slate-200 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-slate-900 font-bold"
                                    placeholder="Brief description"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Order</label>
                                <input
                                    type="number"
                                    value={order}
                                    onChange={(e) => setOrder(e.target.value)}
                                    className="w-full px-4 py-3.5 rounded-xl bg-white border-2 border-slate-200 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-slate-900 font-bold"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {submitting ? <Loader2 className="animate-spin" /> : "Add to Gallery"}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    {loading ? (
                        <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary" size={40} /></div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {photos.map((photo) => (
                                <div key={photo._id} className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden group shadow-sm hover:shadow-xl transition-all relative">
                                    <div className="relative w-full h-48">
                                        <NextImage
                                            src={photo.imageUrl}
                                            alt={photo.caption || "Gallery Image"}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    </div>
                                    <div className="p-4 flex items-center justify-between">
                                        <p className="font-bold text-slate-800 truncate">{photo.caption || "No Caption"}</p>
                                        <button onClick={() => handleDelete(photo._id)} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
