"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Loader2, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

interface SocialLinks {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
}

interface SiteConfigData {
    socialLinks?: SocialLinks;
    images?: {
        logo?: string;
    };
}

export default function Footer() {
    const [email, setEmail] = useState("");
    const [subscribing, setSubscribing] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [socialLinks, setSocialLinks] = useState<SocialLinks>({});


    useEffect(() => {
        const fetchSocialLinks = async () => {
            try {
                const res = await fetch("/api/admin/seo");
                if (res.ok) {
                    const data: SiteConfigData = await res.json();
                    setSocialLinks(data.socialLinks || {});
                }
            } catch {
                console.error("Failed to load social links");
            }
        };
        fetchSocialLinks();
    }, []);

    const handleNewsletterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubscribing(true);
        setMessage(null);

        try {
            const res = await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: data.message });
                setEmail("");
            } else {
                setMessage({ type: 'error', text: data.error });
            }
        } catch {
            setMessage({ type: 'error', text: "Something went wrong. Please try again." });
        } finally {
            setSubscribing(false);
        }
    };

    const socialIcons = [
        { icon: Facebook, key: 'facebook', href: socialLinks.facebook },
        { icon: Twitter, key: 'twitter', href: socialLinks.twitter },
        { icon: Instagram, key: 'instagram', href: socialLinks.instagram },
        { icon: Linkedin, key: 'linkedin', href: socialLinks.linkedin },
        { icon: Youtube, key: 'youtube', href: socialLinks.youtube },
    ].filter(s => s.href);

    return (
        <footer className="mt-auto bg-[#0f172a] text-slate-300 py-24 px-6 relative z-10 overflow-hidden">
            <div className="absolute inset-0 bg-[url('/background-grid.svg')] opacity-5 pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-3 group">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/logo.png" alt="Learnink" className="h-10 w-auto object-contain" />
                        </Link>
                        <p className="text-sm leading-relaxed max-w-xs font-medium text-slate-400">
                            Linking learning, skills, and careers in a single platform. We&apos;re committed to breaking barriers in education.
                        </p>
                        {socialIcons.length > 0 && (
                            <div className="flex gap-4 pt-2">
                                {socialIcons.map((social) => (
                                    <a
                                        key={social.key}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all hover:-translate-y-1"
                                        aria-label={`Follow us on ${social.key}`}
                                    >
                                        <social.icon size={18} />
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 text-lg">Quick Links</h4>
                        <ul className="space-y-3 text-sm font-medium">
                            <li><Link href="/about" className="hover:text-primary transition-colors flex items-center gap-2 hover:gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span> About Us</Link></li>
                            <li><Link href="/programs" className="hover:text-primary transition-colors flex items-center gap-2 hover:gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span> Programs</Link></li>
                            <li><Link href="/partners" className="hover:text-primary transition-colors flex items-center gap-2 hover:gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span> Universities</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors flex items-center gap-2 hover:gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span> Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 text-lg">Programs</h4>
                        <ul className="space-y-3 text-sm font-medium">
                            <li><Link href="/programs" className="hover:text-primary transition-colors">Fast Track Degree</Link></li>
                            <li><Link href="/programs" className="hover:text-primary transition-colors">Credit Transfer</Link></li>
                            <li><Link href="/programs" className="hover:text-primary transition-colors">Online Degree</Link></li>
                            <li><Link href="/programs" className="hover:text-primary transition-colors">Secondary (10th)</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 text-lg">Newsletter</h4>
                        <p className="text-sm mb-4 font-medium text-slate-400">Subscribe to get latest updates entirely free.</p>
                        <form onSubmit={handleNewsletterSubmit}>
                            <div className="flex gap-2 p-1.5 bg-white/5 rounded-xl border border-white/10 focus-within:border-primary/50 transition-colors">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email Address"
                                    required
                                    className="bg-transparent border-none focus:ring-0 text-white text-sm px-4 flex-1 outline-none placeholder:text-white/30"
                                />
                                <button
                                    type="submit"
                                    disabled={subscribing}
                                    className="bg-primary text-white p-3 rounded-xl font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center aspect-square"
                                >
                                    {subscribing ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
                                </button>
                            </div>
                        </form>
                        {message && (
                            <p className={`text-xs mt-3 font-medium ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                                {message.text}
                            </p>
                        )}
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-sm font-medium text-slate-500">
                        © {new Date().getFullYear()} Learnink Education Pvt Ltd. <span className="hidden md:inline mx-2">•</span> All rights reserved.
                    </p>
                    <div className="flex gap-8 text-sm font-medium text-slate-400">
                        <Link href="/privacy" className="hover:text-white transition-colors hover:underline decoration-primary decoration-2 underline-offset-4">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors hover:underline decoration-primary decoration-2 underline-offset-4">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
