"use client";

import { motion } from "framer-motion";
import { Users, BookOpen, Globe, Award } from "lucide-react";

const stats = [
    {
        id: 1,
        label: "Active Students",
        value: "10,000+",
        icon: Users,
        desc: "Trust Learnink for their education"
    },
    {
        id: 2,
        label: "Courses Offered",
        value: "500+",
        icon: BookOpen,
        desc: "Across various disciplines"
    },
    {
        id: 3,
        label: "University Partners",
        value: "50+",
        icon: Globe,
        desc: "Global accredited seeds"
    },
    {
        id: 4,
        label: "Years of Excellence",
        value: "12+",
        icon: Award,
        desc: "Shaping careers since 2012"
    },
];

export default function Stats() {
    return (
        <section className="py-20 relative">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="bg-gradient-to-br from-[#1a202c] via-[#2d3748] to-[#1a202c] relative overflow-hidden before:absolute before:-top-1/2 before:-right-1/2 before:w-full before:h-full before:bg-[radial-gradient(circle,#5B4B9E_0%,transparent_70%)] before:opacity-10 hover:before:opacity-20 before:transition-opacity p-8 rounded-3xl border border-white/10 group hover:border-primary/40 transition-all duration-400"
                        >
                            {/* Background icon */}
                            <div className="absolute -top-4 -right-4 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                                <stat.icon size={80} className="text-white" />
                            </div>

                            {/* Glow effect on hover */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative z-10">
                                <h3 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#7B6BB8] mb-2 tracking-tight group-hover:scale-105 transition-transform origin-left duration-300">
                                    {stat.value}
                                </h3>
                                <p className="text-white font-bold text-lg mb-1">{stat.label}</p>
                                <p className="text-sm text-white/50">{stat.desc}</p>
                            </div>

                            {/* Animated bottom bar */}
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-[#7B6BB8] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
