"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Users, BookOpen, MessageSquare, TrendingUp, ArrowRight, Activity, Server, Database, Globe } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
    const { data: session } = useSession();
    const [counts, setCounts] = useState({
        programs: 0,
        partners: 0,
        enquiries: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const [progRes, partRes, enqRes] = await Promise.all([
                    fetch("/api/admin/programs"),
                    fetch("/api/partners"),
                    fetch("/api/enquiries")
                ]);

                const progs = progRes.ok ? await progRes.json() : [];
                const parts = partRes.ok ? await partRes.json() : [];
                const enqs = enqRes.ok ? await enqRes.json() : [];

                setCounts({
                    programs: Array.isArray(progs) ? progs.length : 0,
                    partners: Array.isArray(parts) ? parts.length : 0,
                    enquiries: Array.isArray(enqs) ? enqs.length : 0
                });
            } catch (error) {
                console.error("Failed to fetch dashboard counts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCounts();
    }, []);

    const stats = [
        { name: "Total Programs", value: counts.programs.toString(), icon: BookOpen, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", trend: loading ? "Loading..." : "Live data" },
        { name: "Universities", value: counts.partners.toString(), icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20", trend: loading ? "Loading..." : "Live data" },
        { name: "New Enquiries", value: counts.enquiries.toString(), icon: MessageSquare, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", trend: loading ? "Loading..." : "Live data" },
    ];

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl lg:text-4xl font-black text-slate-800 mb-2">
                        Welcome Back, <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">{session?.user?.name?.split(' ')[0] || 'Admin'}</span>
                    </h1>
                    <p className="text-slate-500 font-medium text-lg">Here&apos;s what&apos;s happening today at Learnink.</p>
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-slate-500 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    System Operational
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <div
                        key={stat.name}
                        className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-200 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
                    >
                        <div className={`absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity -mr-4 -mt-4`}>
                            <stat.icon size={100} className={stat.color} />
                        </div>

                        <div className="relative z-10">
                            <div className={`${stat.bg} ${stat.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg rotate-3 group-hover:rotate-6 transition-transform`}>
                                <stat.icon size={32} strokeWidth={2} />
                            </div>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.name}</p>
                            <h3 className="text-5xl font-black text-slate-800 mb-4">{stat.value}</h3>

                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 bg-slate-50 w-fit px-3 py-1.5 rounded-lg">
                                <TrendingUp size={16} className="text-emerald-500" />
                                {stat.trend}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Content Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity / Enquiries */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                            <Activity className="text-primary" size={24} />
                            Recent Enquiries
                        </h3>
                        <Link href="/admin/enquiries" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                            View All <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="flex-1 p-10 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <MessageSquare className="text-slate-300" size={32} />
                        </div>
                        <p className="text-slate-500 font-medium">No recent enquiries to display.</p>
                        <p className="text-sm text-slate-400">New messages will appear here.</p>
                    </div>
                </div>

                {/* System Status / Quick Links */}
                <div className="space-y-8">
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-[100px] opacity-20 -mr-16 -mt-16 pointer-events-none" />

                        <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                            <Server className="text-primary" size={24} />
                            System Health
                        </h3>

                        <div className="space-y-4 relative z-10">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                <div className="flex items-center gap-3">
                                    <Database size={18} className="text-emerald-400" />
                                    <span className="font-semibold text-white/90">Database</span>
                                </div>
                                <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online
                                </span>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                <div className="flex items-center gap-3">
                                    <Globe size={18} className="text-blue-400" />
                                    <span className="font-semibold text-white/90">Website</span>
                                </div>
                                <span className="bg-blue-500/20 text-blue-400 text-xs font-bold px-3 py-1 rounded-full border border-blue-500/20">
                                    Live
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40">
                        <h3 className="text-lg font-bold text-slate-800 mb-6">Quick Actions</h3>
                        <div className="space-y-3">
                            <Link href="/admin/programs" className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-primary/5 hover:text-primary transition-all group">
                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-slate-400 group-hover:text-primary group-hover:scale-110 transition-all">
                                    <BookOpen size={20} />
                                </div>
                                <span className="font-bold">Add New Program</span>
                            </Link>
                            <Link href="/admin/partners" className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-blue-500/5 hover:text-blue-600 transition-all group">
                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-slate-400 group-hover:text-blue-500 group-hover:scale-110 transition-all">
                                    <Users size={20} />
                                </div>
                                <span className="font-bold">Manage Universities</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
