"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Loader2, Clock, MessageCircle, Users, BookOpen } from "lucide-react";
import { useState } from "react";

export default function Contact() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        interest: "Select a program",
        message: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch("/api/enquiries", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                alert("Thank you! Your enquiry has been submitted. We will contact you shortly.");
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    interest: "Select a program",
                    message: ""
                });
            } else {
                throw new Error("Failed to submit");
            }
        } catch {
            alert("Something went wrong. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const contactInfo = [
        {
            icon: Phone,
            title: "Call Us",
            subtitle: "Mon-Sat, 9am-6pm",
            value: "+91 98765 43210",
            href: "tel:+919876543210",
            color: "from-primary to-primary-dark"
        },
        {
            icon: Mail,
            title: "Email Us",
            subtitle: "24/7 Support",
            value: "learninkclt@gmail.com",
            href: "mailto:learninkclt@gmail.com",
            color: "from-secondary to-blue-600"
        },
        {
            icon: MapPin,
            title: "Visit Us",
            subtitle: "Head Office",
            value: "Calicut, Kerala",
            href: "#",
            color: "from-tertiary to-teal-600"
        }
    ];

    return (
        <section id="contact" className="py-16 lg:py-24 relative overflow-hidden">
            {/* Background decoration - constrained to section */}
            <div className="absolute inset-0 bg-[url('/background-grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-primary/5 via-secondary/5 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-tertiary/5 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-2xl mx-auto mb-16"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6">
                        <MessageCircle size={16} />
                        Get in Touch
                    </span>
                    <h2 className="text-4xl lg:text-5xl font-black text-[#1a202c] mb-4">
                        Let&apos;s Start Your <span className="bg-gradient-to-br from-primary via-secondary to-tertiary bg-clip-text text-transparent">Journey</span>
                    </h2>
                    <p className="text-slate-600 text-lg">
                        Have questions about our programs? Our expert counselors are here to guide you every step of the way.
                    </p>
                </motion.div>

                {/* Primary Contact Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-12"
                >
                    {contactInfo.map((info, index) => (
                        <a
                            key={index}
                            href={info.href}
                            className="group p-6 lg:p-8 bg-white rounded-[2rem] border border-slate-100 hover:border-transparent hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 relative overflow-hidden flex flex-col items-start text-left h-full"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${info.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                            <div className="relative z-10 w-full flex flex-col h-full">
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${info.color} flex items-center justify-center text-white shadow-lg group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300 mb-5`}>
                                    <info.icon size={26} />
                                </div>
                                <h3 className="text-xl font-bold text-[#1a202c] group-hover:text-white transition-colors mb-1">{info.title}</h3>
                                <p className="text-sm text-slate-400 group-hover:text-white/80 transition-colors mb-4">{info.subtitle}</p>
                                <div className="mt-auto w-full">
                                    <p className="text-base font-bold text-primary group-hover:text-white transition-colors truncate w-full flex items-center justify-between gap-2">
                                        {info.value}
                                        <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-primary group-hover:text-white transition-colors"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 12h14M12 5l7 7-7 7" /></svg>
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </a>
                    ))}
                </motion.div>

                {/* Secondary Info Grid - Horizontal Alignment */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-16"
                >
                    {/* Address Card */}
                    <div className="bg-gradient-to-br from-[#1a202c] to-slate-800 p-6 lg:p-8 rounded-[2rem] text-white relative overflow-hidden group min-h-[260px] flex flex-col justify-between">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-colors" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md">
                                    <MapPin size={20} />
                                </div>
                                <h3 className="text-lg font-bold">Headquarters</h3>
                            </div>
                            <p className="text-white/70 leading-relaxed text-sm">
                                Learnink Education Hub<br />
                                Calicut, Kerala - 673001
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs lg:text-sm text-white/60 pt-6 border-t border-white/10 mt-auto">
                            <Clock size={16} />
                            <span>Mon - Sat: 9am - 6pm</span>
                        </div>
                    </div>

                    {/* Admission Status */}
                    <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 lg:p-8 rounded-[2rem] text-white relative overflow-hidden group min-h-[260px] flex flex-col justify-between">
                        <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full transform group-hover:scale-110 transition-transform duration-500" />
                        <div className="relative z-10">
                            <div className="flex items-start justify-between mb-4">
                                <h3 className="text-lg font-bold">Admissions</h3>
                                <span className="px-2.5 py-1 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">Live</span>
                            </div>
                            <h4 className="text-2xl font-black mb-2">Batch 2026</h4>
                            <p className="text-white/80 text-sm">
                                Applications open for all degree programs.
                            </p>
                        </div>
                        <div className="mt-auto pt-6">
                            <a
                                href="#contact"
                                className="inline-flex items-center gap-2 text-sm font-bold bg-white text-emerald-600 px-4 py-3 rounded-xl shadow-lg hover:scale-105 transition-transform cursor-pointer w-full justify-center"
                            >
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                Apply Now
                            </a>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-rows-2 gap-4 lg:gap-6 min-h-[260px]">
                        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between shadow-sm hover:shadow-lg transition-all group h-full relative overflow-hidden">
                            <div className="relative z-10">
                                <p className="text-3xl font-black text-primary mb-1 group-hover:scale-105 transition-transform origin-left">10K+</p>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Happy Students</p>
                            </div>
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors relative z-10">
                                <Users size={22} />
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between shadow-sm hover:shadow-lg transition-all group h-full relative overflow-hidden">
                            <div className="relative z-10">
                                <p className="text-3xl font-black text-secondary mb-1 group-hover:scale-105 transition-transform origin-left">50+</p>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Universities</p>
                            </div>
                            <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-colors relative z-10">
                                <BookOpen size={22} />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Contact Form - Centered Bottom */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto"
                >
                    <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-2xl relative overflow-hidden">
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-secondary/5 to-transparent rounded-full blur-3xl" />

                        <div className="relative z-10 text-center mb-8">
                            <span className="text-primary font-bold tracking-wider uppercase text-xs mb-2 block">Message Us</span>
                            <h3 className="text-3xl font-black text-[#1a202c] mb-3">Send an Enquiry</h3>
                            <p className="text-slate-500 max-w-md mx-auto text-sm">Fill out the form below and ours admissions team will get back to you.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="relative z-10 space-y-5 max-w-xl mx-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5 text-left">
                                    <label className="text-xs font-bold text-[#1a202c] ml-1 uppercase tracking-wide">Full Name</label>
                                    <input
                                        required
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="John Doe"
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all text-[#1a202c] placeholder:text-slate-400 font-medium text-sm"
                                    />
                                </div>
                                <div className="space-y-1.5 text-left">
                                    <label className="text-xs font-bold text-[#1a202c] ml-1 uppercase tracking-wide">Phone</label>
                                    <input
                                        required
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        type="tel"
                                        placeholder="+91..."
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all text-[#1a202c] placeholder:text-slate-400 font-medium text-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-[#1a202c] ml-1 uppercase tracking-wide">Email</label>
                                    <input
                                        required
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        type="email"
                                        placeholder="you@example.com"
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all text-[#1a202c] placeholder:text-slate-400 font-medium text-sm"
                                    />
                                </div>
                                <div className="space-y-1.5 text-left">
                                    <label className="text-xs font-bold text-[#1a202c] ml-1 uppercase tracking-wide">Program</label>
                                    <div className="relative">
                                        <select
                                            name="interest"
                                            value={formData.interest}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all appearance-none cursor-pointer text-[#1a202c] font-medium text-sm"
                                        >
                                            <option className="text-slate-500">Select a program</option>
                                            <option>Degree Breaking Study</option>
                                            <option>Fast Track Program</option>
                                            <option>Credit Transfer</option>
                                            <option>Online Degree</option>
                                            <option>Secondary (10th)</option>
                                            <option>Senior Secondary (12th)</option>
                                            <option>Diploma</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                            <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5 text-left">
                                <label className="text-xs font-bold text-[#1a202c] ml-1 uppercase tracking-wide">Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Tell us about your educational goals..."
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all resize-none text-[#1a202c] placeholder:text-slate-400 font-medium text-sm"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-br from-primary to-primary-dark text-white relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-10px_#5B4B9E] before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:transition-all before:duration-500 hover:before:left-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 shadow-xl hover:shadow-primary/30 disabled:opacity-70 text-base"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        Submit
                                        <Send size={18} />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
