"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { GraduationCap, Lock, User, Loader2, ArrowRight } from "lucide-react";

export default function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const res = await signIn("credentials", {
            username,
            password,
            redirect: false,
        });

        console.log("SignIn Result:", res); // Debug log

        if (res?.error) {
            console.error("SignIn Error:", res.error); // Debug log
            setError("Invalid credentials. Please verify your access.");
            setLoading(false);
        } else {
            console.log("SignIn Success, redirecting..."); // Debug log
            router.push("/admin");
        }
    };



    return (

        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#f0f4f8]">
            {/* Geometric Background */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[80px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-100 rounded-full blur-[80px]" />
            </div>

            <div className="w-full max-w-md relative z-10 animate-[slideUp_0.5s_ease-out_forwards]">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white text-primary mb-6 shadow-xl shadow-slate-200 border border-slate-100">
                        <GraduationCap size={40} strokeWidth={1.5} />
                    </div>
                    <h1 className="text-3xl font-black text-[#1a202c] mb-2 tracking-tight">Admin Portal</h1>
                    <p className="text-slate-500 font-medium">Secure Access Dashboard</p>
                </div>

                <div className="bg-white p-10 rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group">
                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        {error && (
                            <div className="p-4 bg-red-50 text-red-600 text-sm font-bold rounded-xl text-center animate-[fadeIn_0.3s_ease-out_forwards] flex items-center justify-center gap-2 border border-red-100">
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-2 group/input">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 group-focus-within/input:text-primary transition-colors">
                                Username
                            </label>
                            <div className="relative">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-primary transition-colors">
                                    <User size={20} />
                                </div>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-14 pr-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-[#1a202c] placeholder:text-slate-400"
                                    placeholder="Enter your ID"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2 group/input">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 group-focus-within/input:text-primary transition-colors">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-primary transition-colors">
                                    <Lock size={20} />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-14 pr-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-[#1a202c] placeholder:text-slate-400"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:shadow-slate-900/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group/btn"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <>Access Dashboard <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" /></>}
                        </button>
                    </form>
                </div>

                <p className="text-center mt-8 text-sm font-medium text-slate-400">
                    &copy; {new Date().getFullYear()} Learnink Education System
                </p>
            </div>
        </div>
    );
}
