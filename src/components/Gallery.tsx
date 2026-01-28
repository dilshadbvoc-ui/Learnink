"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface Photo {
    _id: string;
    imageUrl: string;
    caption?: string;
}

export default function Gallery() {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const res = await fetch("/api/gallery");
                if (res.ok) {
                    const data = await res.json();
                    setPhotos(data);
                }
            } catch (error) {
                console.error("Failed to load gallery", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPhotos();
    }, []);

    if (loading) {
        return (
            <section className="section-padding flex justify-center py-20 bg-white">
                <Loader2 className="animate-spin text-primary w-10 h-10" />
            </section>
        );
    }

    if (photos.length === 0) {
        return (
            <section className="section-padding bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 text-center py-20 border-2 border-dashed border-slate-100 rounded-[3rem]">
                    <h2 className="text-primary font-bold tracking-wider uppercase text-sm mb-4">Visual Journey</h2>
                    <h3 className="text-2xl font-black text-slate-300">Gallery Content Coming Soon</h3>
                    <p className="text-slate-400 mt-2">Add photos from the Admin Dashboard to see them here.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="section-padding bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-primary font-bold tracking-wider uppercase text-sm mb-4">Visual Journey</h2>
                    <h3 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6">Our Campus & Events</h3>
                </motion.div>

                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {photos.map((photo, index) => (
                        <motion.div
                            key={photo._id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="relative group rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 bg-slate-100"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={photo.imageUrl}
                                alt={photo.caption || "Gallery Photo"}
                                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            {photo.caption && (
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                                    <p className="text-white font-bold text-lg">{photo.caption}</p>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
