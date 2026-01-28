"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NavLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Programs", href: "/programs" },
    { name: "Universities", href: "/partners" },
    { name: "Contact", href: "/contact" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);




    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
            <div
                className={cn(
                    "w-full max-w-7xl transition-all duration-500 ease-in-out rounded-full",
                    scrolled
                        ? "bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl py-3 px-8"
                        : "bg-transparent py-6 px-8 border-transparent shadow-none"
                )}
            >
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-4 group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/logo.png" alt="Learnink" className="h-12 w-auto object-contain" />
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-10">
                        {NavLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-bold text-slate-600 hover:text-primary transition-all relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <Link
                            href="/admin/login"
                            className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors px-4 py-2"
                        >
                            LOGIN
                        </Link>
                        <Link
                            href="/contact"
                            className="relative overflow-hidden group bg-gradient-to-r from-primary to-primary-dark text-white px-8 py-3 rounded-full text-sm font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300"
                        >
                            <span className="relative z-10">ENQUIRE NOW</span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-slate-800 p-2 rounded-full hover:bg-black/5 transition-colors"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="absolute top-24 left-4 right-4 bg-white/90 backdrop-blur-2xl border border-white/50 shadow-2xl rounded-[2rem] md:hidden animate-[fadeIn_0.5s_ease-out_forwards] overflow-hidden">
                    <div className="flex flex-col p-8 gap-6 text-center">
                        {NavLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-xl font-bold text-slate-700 hover:text-primary py-4 border-b border-slate-100 last:border-0"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            href="/admin/login"
                            className="text-lg font-bold text-slate-400 hover:text-slate-700 py-2"
                            onClick={() => setIsOpen(false)}
                        >
                            Staff Login
                        </Link>
                        <Link
                            href="/contact"
                            className="bg-primary text-black px-6 py-5 rounded-2xl text-lg font-bold mt-2 shadow-lg active:scale-95 transition-transform"
                            onClick={() => setIsOpen(false)}
                        >
                            Enquire Now
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
