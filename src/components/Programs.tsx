"use client";

import { motion } from "framer-motion";
import { ArrowRight, ScrollText, Rocket, RotateCcw, Laptop2, BookText, Award, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Program {
    _id: string;
    title: string;
    description: string;
    category: string;
    slug: string;
}

const getIcon = (category: string) => {
    switch (category) {
        case 'Degree Breaking': return ScrollText;
        case 'Fast Track': return Rocket;
        case 'Credit Transfer': return RotateCcw;
        case 'Online Degree': return Laptop2;
        case 'Secondary (10th)': return BookText;
        default: return Award;
    }
};

interface ProgramsProps {
    limit?: number;
}

export default function Programs({ limit }: ProgramsProps) {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const res = await fetch("/api/programs");
                if (res.ok) {
                    const data = await res.json();
                    setPrograms(limit ? data.slice(0, limit) : data);
                }
            } catch (error) {
                console.error("Failed to load programs", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPrograms();
    }, [limit]);

    return (
        <section id="programs" className="section-padding relative overflow-hidden bg-slate-50">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center max-w-3xl mx-auto mb-20"
                >
                    <h2 className="text-primary font-bold tracking-wider uppercase text-sm mb-4">Our Programs</h2>
                    <h3 className="text-4xl lg:text-5xl font-black text-[#1a202c] mb-6">
                        Designed for Your <span className="text-primary">Success</span>
                    </h3>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        Choose from our wide range of flexible educational programs tailored to meet your career goals and academic needs.
                    </p>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center p-20">
                        <Loader2 className="animate-spin text-primary w-10 h-10" />
                    </div>
                ) : programs.length === 0 ? (
                    <div className="text-center py-20 px-10 border-2 border-dashed border-slate-200 rounded-[3rem] bg-white/50 backdrop-blur-sm">
                        <h4 className="text-xl font-bold text-slate-300">Course Catalog Pending</h4>
                        <p className="text-slate-400 mt-2">New programs are being finalized. Check back soon!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {programs.map((program, index) => {
                            const Icon = getIcon(program.category);
                            return (
                                <motion.div
                                    key={program._id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                    whileHover={{ y: -10 }}
                                    className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 flex flex-col items-start min-h-[320px] group relative overflow-hidden"
                                >
                                    {/* Decorative gradient accent */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-2xl pointer-events-none group-hover:bg-primary/10 transition-colors" />

                                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-primary shadow-lg shadow-primary/10 bg-white border border-primary/10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:border-primary/20">
                                        <Icon size={30} strokeWidth={1.5} />
                                    </div>
                                    <h4 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-primary transition-colors duration-300 relative z-10">
                                        {program.title}
                                    </h4>
                                    <p className="text-slate-500 font-medium leading-relaxed mb-8 flex-1 line-clamp-3 relative z-10">
                                        {program.description}
                                    </p>
                                    <Link
                                        href={`/programs/${program.slug}`}
                                        className="inline-flex items-center gap-2 text-primary font-bold text-sm bg-primary/5 px-5 py-2.5 rounded-full hover:bg-primary hover:text-white transition-all duration-300 group-hover:pl-6"
                                    >
                                        Learn More <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section >
    );
}
