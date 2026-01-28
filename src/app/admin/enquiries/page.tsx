"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Mail, Phone, Calendar, Trash2, Eye, Search, Loader2, X } from "lucide-react";

interface Enquiry {
    _id: string;
    name: string;
    email: string;
    phone: string;
    interest?: string;
    message?: string;
    status: 'new' | 'contacted' | 'resolved';
    createdAt: string;
}

export default function AdminEnquiries() {
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const fetchEnquiries = async () => {
        try {
            const res = await fetch("/api/enquiries");
            if (res.ok) {
                const data = await res.json();
                setEnquiries(data);
            }
        } catch (error) {
            console.error("Failed to fetch enquiries", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this enquiry?")) return;
        try {
            const res = await fetch(`/api/enquiries/${id}`, { method: "DELETE" });
            if (res.ok) {
                setEnquiries(enquiries.filter(e => e._id !== id));
            }
        } catch (error) {
            console.error("Failed to delete enquiry", error);
        }
    };

    const filteredEnquiries = enquiries.filter(e =>
        e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.phone.includes(searchTerm)
    );

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="animate-[fade-in_0.5s_ease-out_forwards] space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 mb-2">Student Enquiries</h1>
                    <p className="text-slate-600 font-medium">Track and respond to student messages.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="px-4 py-2 bg-primary/10 text-primary rounded-xl font-bold text-sm">
                        {enquiries.length} Total
                    </span>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/40 flex items-center gap-4">
                <Search className="text-slate-400 ml-2" size={20} />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, email or phone..."
                    className="flex-1 bg-transparent outline-none text-slate-800 font-medium placeholder:text-slate-500"
                />
            </div>

            {loading ? (
                <div className="flex justify-center p-20">
                    <Loader2 className="animate-spin text-primary" size={40} />
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredEnquiries.map((enquiry) => (
                        <div key={enquiry._id} className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 md:flex items-center justify-between group">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary-dark flex items-center justify-center font-bold text-2xl group-hover:scale-110 transition-transform duration-300 border border-primary/10">
                                    {enquiry.name.charAt(0)}
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-primary transition-colors">{enquiry.name}</h3>
                                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600 font-medium">
                                        <span className="flex items-center gap-2">
                                            <Mail size={14} className="text-slate-400" /> {enquiry.email}
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <Phone size={14} className="text-slate-400" /> {enquiry.phone}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 md:mt-0 flex flex-col md:items-end gap-3">
                                {enquiry.interest && (
                                    <span className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider border border-slate-200">
                                        {enquiry.interest}
                                    </span>
                                )}
                                <div className="flex items-center gap-6">
                                    <span className="text-xs text-slate-500 flex items-center gap-1.5 font-bold">
                                        <Calendar size={14} /> {formatDate(enquiry.createdAt)}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setSelectedEnquiry(enquiry)}
                                            className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                                            title="View Message"
                                        >
                                            <Eye size={20} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(enquiry._id)}
                                            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                            title="Delete"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredEnquiries.length === 0 && !loading && (
                        <div className="bg-white p-20 rounded-[2rem] border border-slate-200 text-center shadow-sm">
                            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                                <MessageSquare size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">No Enquiries Found</h3>
                            <p className="text-slate-500 font-medium">
                                {searchTerm ? "Try a different search term." : "When students contact you, their messages will appear here."}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Detail Modal */}
            {selectedEnquiry && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedEnquiry(null)}>
                    <div className="bg-white rounded-[2rem] p-8 max-w-lg w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-black text-slate-800">Enquiry Details</h3>
                            <button onClick={() => setSelectedEnquiry(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Name</label>
                                <p className="text-lg font-bold text-slate-800">{selectedEnquiry.name}</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email</label>
                                <p className="text-slate-700">{selectedEnquiry.email}</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone</label>
                                <p className="text-slate-700">{selectedEnquiry.phone}</p>
                            </div>
                            {selectedEnquiry.interest && (
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Interest</label>
                                    <p className="text-slate-700">{selectedEnquiry.interest}</p>
                                </div>
                            )}
                            {selectedEnquiry.message && (
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Message</label>
                                    <p className="text-slate-700 whitespace-pre-wrap">{selectedEnquiry.message}</p>
                                </div>
                            )}
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Received</label>
                                <p className="text-slate-700">{formatDate(selectedEnquiry.createdAt)}</p>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-3">
                            <a
                                href={`mailto:${selectedEnquiry.email}`}
                                className="flex-1 bg-primary text-white py-3 rounded-xl font-bold text-center hover:bg-primary-dark transition-colors"
                            >
                                Reply via Email
                            </a>
                            <a
                                href={`tel:${selectedEnquiry.phone}`}
                                className="flex-1 bg-slate-100 text-slate-800 py-3 rounded-xl font-bold text-center hover:bg-slate-200 transition-colors"
                            >
                                Call
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
