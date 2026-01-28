"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Building2 } from "lucide-react";
import Link from "next/link";

interface Partner {
    _id: string;
    name: string;
    logo: string;
    slug?: string;
}

interface PartnersProps {
    limit?: number;
    fullWidth?: boolean;
}

export default function Partners({ limit, fullWidth = false }: PartnersProps) {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const res = await fetch("/api/partners");
                if (res.ok) {
                    const data = await res.json();
                    setPartners(limit ? data.slice(0, limit) : data);
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
        <section id="partners" className="py-24 px-6 lg:py-32 lg:px-16 bg-white text-[#1a202c] overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                {fullWidth ? (
                    // Full Feature Layout (Vertical Stack)
                    <div className="flex flex-col items-center gap-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="text-center max-w-3xl mx-auto mb-20"
                        >
                            <h2 className="text-primary font-bold tracking-wider uppercase text-sm mb-4">Our Universities</h2>
                            <h3 className="text-4xl lg:text-5xl font-black mb-6 text-[#1a202c]">
                                Our University <span className="text-primary">Partners</span>
                            </h3>
                            <p className="text-slate-600 leading-relaxed text-lg">
                                We proudly partner with top universities to provide world-class educational opportunities. Explore our trusted network of academic institutions dedicated to your success.
                            </p>
                        </motion.div>

                        {loading ? (
                            <div className="flex justify-center p-20">
                                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : partners.length === 0 ? (
                            <div className="text-center py-20 px-10 border-2 border-dashed border-slate-100 rounded-[3rem] w-full">
                                <h4 className="text-xl font-bold text-slate-300">University Partners Coming Soon</h4>
                                <p className="text-slate-400 mt-2">Check back soon to see our academic collaborations.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full">
                                {partners.map((partner, index) => (
                                    <PartnerCard key={partner._id} partner={partner} index={index} />
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    // Split Section Layout (Horizontal)
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="lg:w-1/3"
                        >
                            <h2 className="text-primary font-bold tracking-wider uppercase text-sm mb-4">Our Universities</h2>
                            <h3 className="text-3xl lg:text-4xl font-black mb-6 text-[#1a202c]">
                                Our University <span className="text-primary">Partners</span>
                            </h3>
                            <p className="text-slate-600 leading-relaxed">
                                We proudly partner with top universities to provide world-class educational opportunities. Explore our trusted network of academic institutions dedicated to your success.
                            </p>
                        </motion.div>

                        <div className="lg:w-2/3 w-full">
                            {loading ? (
                                <div className="flex justify-center p-20">
                                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : partners.length === 0 ? (
                                <div className="text-center py-16 px-10 border-2 border-dashed border-slate-100 rounded-[3rem] bg-slate-50/50">
                                    <h4 className="text-lg font-bold text-slate-300">Partner List Pending</h4>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 w-full">
                                    {partners.map((partner, index) => (
                                        <PartnerCard key={partner._id} partner={partner} index={index} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

function PartnerCard({ partner, index }: { partner: Partner; index: number }) {
    return (
        <Link href={`/partners/${partner.slug || partner._id}`}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="h-40 rounded-3xl bg-white border border-slate-100 flex items-center justify-center p-8 shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-400 cursor-pointer group overflow-hidden relative"
            >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {partner.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={partner.logo}
                        alt={partner.name}
                        className="max-h-full max-w-full object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 relative z-10"
                    />
                ) : (
                    <div className="flex flex-col items-center gap-2 text-center relative z-10">
                        <Building2 className="text-slate-300 group-hover:text-primary transition-colors duration-300" size={32} />
                        <span className="text-slate-400 group-hover:text-primary font-bold text-sm leading-tight transition-colors duration-300">
                            {partner.name}
                        </span>
                    </div>
                )}
            </motion.div>
        </Link>
    );
}
