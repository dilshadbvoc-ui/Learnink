"use client";

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import {
    LayoutDashboard,
    BookOpen,
    Users,
    MessageSquare,
    LogOut,
    GraduationCap,
    Menu,
    X,
    Globe,
    Image as ImageIcon,
    Star,
    Loader2,
    Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Bypass layout and checks for login page
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8] text-primary font-bold">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-primary w-10 h-10" />
                    <span className="text-slate-500">Loading Dashboard...</span>
                </div>
            </div>
        );
    }

    if (status === "unauthenticated") return null;
    if (!session) return null;

    const menuItems = [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
        { name: "Programs", href: "/admin/programs", icon: BookOpen },
        { name: "Universities", href: "/admin/partners", icon: Users },
        { name: "Photo Gallery", href: "/admin/gallery", icon: ImageIcon },
        { name: "Testimonials", href: "/admin/testimonials", icon: Star },
        { name: "Enquiries", href: "/admin/enquiries", icon: MessageSquare },
        { name: "SEO Settings", href: "/admin/seo", icon: Globe },
        { name: "Integrations", href: "/admin/settings", icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-[#f0f4f8] flex flex-col lg:flex-row font-sans">
            {/* Mobile Header */}
            <header className="lg:hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
                <Link href="/" className="flex items-center gap-2">
                    <div className="bg-primary/10 p-2 rounded-xl">
                        <GraduationCap className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-lg font-bold text-slate-800 tracking-tight">Learnink Admin</span>
                </Link>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </header>

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:sticky lg:top-0 flex flex-col shadow-xl lg:shadow-none",
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-8 hidden lg:block border-b border-slate-50">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="bg-gradient-to-br from-primary to-primary-dark p-2.5 rounded-xl shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black text-slate-800 tracking-tight leading-none group-hover:text-primary transition-colors">Learnink</span>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Admin Portal</span>
                        </div>
                    </Link>
                </div>

                <div className="p-4 lg:px-6 lg:py-8 flex-1 overflow-y-auto custom-scrollbar">
                    <nav className="space-y-1.5">
                        <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 mt-2">Main Menu</p>
                        {menuItems.map((item) => {
                            const isActive = item.exact
                                ? pathname === item.href
                                : pathname.startsWith(item.href);

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 group relative overflow-hidden",
                                        isActive
                                            ? "bg-gradient-to-r from-primary/10 to-transparent text-primary shadow-sm ring-1 ring-primary/20"
                                            : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                                    )}
                                >
                                    {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />}
                                    <item.icon size={20} className={cn("transition-colors", isActive ? "text-primary" : "text-slate-400 group-hover:text-slate-600")} strokeWidth={isActive ? 2.5 : 2} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-white border border-slate-100 shadow-sm">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {session.user?.name?.charAt(0) || "A"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-800 truncate">{session.user?.name || "Admin"}</p>
                            <p className="text-xs text-slate-400 truncate">Administrator</p>
                        </div>
                    </div>
                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all border border-transparent hover:border-rose-100"
                    >
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/20 z-30 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="flex-1 p-4 lg:p-10 pt-6 lg:pt-10 h-screen overflow-y-auto overflow-x-hidden relative">
                <div className="max-w-7xl mx-auto animate-[fadeIn_0.5s_ease-out_forwards]">
                    {children}
                </div>
            </main>
        </div>
    );
}
