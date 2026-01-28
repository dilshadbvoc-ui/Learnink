"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

// Geometric Cube Component
const Cube = ({ className, size = 60 }: { className?: string; size?: number }) => (
    <motion.div
        className={`absolute rounded-2xl shadow-xl ${className}`}
        style={{ width: size, height: size }}
        initial={{ y: 0, rotate: 0 }}
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
    />
);



export default function Hero() {
    const [heroBg, setHeroBg] = useState("");

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await fetch("/api/admin/seo");
                if (res.ok) {
                    const data = await res.json();
                    if (data.images?.heroBg) setHeroBg(data.images.heroBg);
                }
            } catch {
                console.error("Failed to load site config");
            }
        };
        fetchConfig();
    }, []);
    return (
        <section
            className="relative min-h-screen bg-[#f0f4f8] overflow-hidden flex items-center pt-32 bg-cover bg-center bg-no-repeat"
            style={heroBg ? { backgroundImage: `url(${heroBg})` } : {}}
        >
            {/* Geometric Background Block */}
            <div className="absolute top-0 right-0 w-[55%] h-full bg-[#9FBAD3] skew-x-[-12deg] origin-top translate-x-32 hidden lg:block" />

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full z-10">
                {/* Left Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1 }}
                    className="max-w-xl"
                >
                    <div className="inline-block px-4 py-1.5 rounded-full bg-white/60 border border-white/40 shadow-sm backdrop-blur-sm mb-6 animate-[fadeInUp_0.8s_ease-out_backward]">
                        <p className="font-bold tracking-widest text-xs text-secondary uppercase bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Start your favourite course
                        </p>
                    </div>

                    <h1 className="text-6xl lg:text-8xl font-black leading-[0.9] mb-8 tracking-tight text-slate-900">
                        Rebuild <br />
                        <span className="text-slate-900">Your</span> <br />
                        <span className="bg-gradient-to-r from-[#FF7E5F] via-[#D45087] to-[#4A90E2] bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto]">Career</span>
                    </h1>

                    <p className="text-lg lg:text-xl text-slate-600 font-medium mb-12 leading-relaxed max-w-md">
                        Learn from anywhere and build your <span className="font-bold text-slate-800">brighter career</span>.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <Link
                            href="/programs"
                            className="btn-primary flex items-center gap-3 group"
                        >
                            Explore Programs
                            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                        </Link>

                        <Link
                            href="/about"
                            className="px-8 py-3 rounded-full bg-white text-slate-700 font-bold border border-slate-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
                        >
                            Learn More
                        </Link>
                    </div>
                </motion.div>

                {/* Right Visuals (Floating Cubes Imitation) */}
                <div className="relative h-[600px] hidden lg:block perspective-1000">
                    {/* Orange Box */}
                    <Cube className="bg-[#FF7E5F] top-1/4 right-1/4 z-20" size={120} />

                    {/* Blue Box */}
                    <Cube className="bg-[#4A90E2] top-1/2 right-[10%] z-10" size={80} />

                    {/* White Box */}
                    <Cube className="bg-white top-1/3 right-[40%] z-30" size={100} />

                    {/* Teal Box */}
                    <Cube className="bg-[#50E3C2] bottom-1/4 right-[25%] z-20" size={60} />

                    {/* Falling/Scattered Cubes */}
                    <motion.div
                        className="absolute top-20 right-20 w-16 h-16 bg-white/50 backdrop-blur-md rounded-xl"
                        animate={{ y: [0, 40, 0], rotate: [0, 10, 0] }}
                        transition={{ duration: 8, repeat: Infinity }}
                    />
                    <motion.div
                        className="absolute bottom-40 right-[45%] w-24 h-24 bg-[#FEB692] rounded-xl z-0"
                        animate={{ y: [0, -30, 0], rotate: [0, -5, 0] }}
                        transition={{ duration: 7, delay: 1, repeat: Infinity }}
                    />
                </div>
            </div>

            {/* Mobile simplified visual */}
            <div className="lg:hidden absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        </section>
    );
}


