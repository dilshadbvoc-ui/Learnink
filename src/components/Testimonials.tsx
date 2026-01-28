"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Quote, Star } from "lucide-react";

interface Testimonial {
    _id: string;
    name: string;
    content: string;
    role?: string;
    imageUrl?: string;
    rating: number;
}

export default function Testimonials() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const res = await fetch("/api/testimonials");
                if (res.ok) {
                    const data = await res.json();
                    setTestimonials(data);
                }
            } catch (error) {
                console.error("Failed to load testimonials", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTestimonials();
    }, []);

    if (loading) return null;
    if (testimonials.length === 0) {
        return (
            <section className="section-padding bg-slate-50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 text-center py-20 border-2 border-dashed border-slate-200 rounded-[3rem]">
                    <h2 className="text-secondary font-bold tracking-wider uppercase text-sm mb-4">Success Stories</h2>
                    <h3 className="text-2xl font-black text-slate-300">Testimonials Coming Soon</h3>
                    <p className="text-slate-400 mt-2">Add student reviews from the Admin Dashboard to see them here.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="section-padding bg-slate-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-secondary font-bold tracking-wider uppercase text-sm mb-4">Success Stories</h2>
                    <h3 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6">What Our Students Say</h3>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((item, index) => (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col relative group hover:-translate-y-2 transition-all duration-500"
                        >
                            <div className="absolute top-8 right-8 text-primary/10 group-hover:text-primary/20 transition-colors">
                                <Quote size={60} />
                            </div>

                            <div className="flex gap-1 mb-6">
                                {[...Array(item.rating)].map((_, i) => (
                                    <Star key={i} size={16} className="fill-violet-500 text-violet-500" />
                                ))}
                            </div>

                            <p className="text-lg text-slate-600 font-medium leading-relaxed mb-8 flex-1 italic">
                                &quot;{item.content}&quot;
                            </p>

                            <div className="flex items-center gap-4">
                                {item.imageUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={item.imageUrl} alt={item.name} className="w-14 h-14 rounded-2xl object-cover shadow-md" />
                                ) : (
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-xl uppercase">
                                        {item.name.charAt(0)}
                                    </div>
                                )}
                                <div>
                                    <h4 className="font-black text-slate-900 leading-tight">{item.name}</h4>
                                    {item.role && <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">{item.role}</p>}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
