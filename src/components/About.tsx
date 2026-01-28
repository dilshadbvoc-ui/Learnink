"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const features = [
    "All-in-one education platform",
    "Linking learning, skills, and careers",
    "Partnered with leading universities",
    "Fast-track degree programs",
    "Online and distance learning options",
    "Dedicated career counseling"
];

import { useState, useEffect } from "react";

export default function About() {
    const [aboutImage, setAboutImage] = useState("");

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await fetch("/api/admin/seo");
                if (res.ok) {
                    const data = await res.json();
                    if (data.images?.aboutImage) setAboutImage(data.images.aboutImage);
                }
            } catch {
                console.error("Failed to load site config");
            }
        };
        fetchConfig();
    }, []);
    return (
        <section id="about" className="py-24 px-6 lg:py-32 lg:px-16 relative overflow-hidden bg-white">
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="aspect-square bg-gradient-to-tr from-[#9FBAD3] to-[#f0f4f8] rounded-[2rem] overflow-hidden rotate-3 shadow-2xl border border-slate-100 relative">
                            {aboutImage ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={aboutImage} alt="About Us" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                            ) : (
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center transition-all duration-700"></div>
                            )}
                        </div>
                        <div className="absolute -bottom-8 -right-8 bg-white p-8 rounded-2xl shadow-xl max-w-xs animate-[slideUp_0.8s_ease-out_forwards] border border-slate-100">
                            <p className="text-primary font-bold text-xl mb-1">10+ Years</p>
                            <p className="text-sm text-slate-500">Experience in educational consulting and excellence.</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-primary font-bold tracking-wider uppercase text-sm mb-4">About Us</h2>
                        <h3 className="text-4xl lg:text-5xl font-black text-[#1a202c] mb-6 leading-tight">
                            Learnink Education <br /> <span className="text-slate-400">Pvt Ltd</span>
                        </h3>
                        <p className="text-lg text-slate-600 mb-8 leading-relaxed font-medium">
                            Learnink Education is a premier all-in-one education platform dedicated to transforming how individuals acquire knowledge and build their careers. Our platform is built on the vision of seamlessly linking academic learning with practical skills and professional growth.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                            {features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 transition-colors group">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0 group-hover:from-primary group-hover:to-primary-dark transition-all duration-300">
                                        <CheckCircle2 className="text-primary group-hover:text-white transition-colors" size={16} />
                                    </div>
                                    <span className="text-slate-700 font-semibold text-sm group-hover:text-primary transition-colors">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <div className="p-6 rounded-2xl border-2 border-slate-100 bg-gradient-to-br from-[#f8fafc] to-white shadow-lg hover:shadow-xl hover:border-primary/20 transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary via-secondary to-tertiary" />
                            <h4 className="font-bold text-[#1a202c] mb-2 group-hover:text-primary transition-colors">Our Vision</h4>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                To be the bridge that links every learner to their dream career by providing accessible, accredited, and industry-relevant educational programs.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
