"use client";

import { useState, useEffect } from "react";
import { Save, Globe, Loader2, Search, Twitter, FileText, ChevronDown, ChevronUp, Image as ImageIcon, Upload } from "lucide-react";

interface PageSEO {
    pageKey: string;
    title: string;
    description: string;
    keywords: string;
    ogImage: string;
}

const PAGES = [
    { key: 'home', label: 'Home Page', path: '/' },
    { key: 'about', label: 'About Us', path: '/about' },
    { key: 'programs', label: 'Programs Listing', path: '/programs' },
    { key: 'partners', label: 'Partners', path: '/partners' },
    { key: 'contact', label: 'Contact Us', path: '/contact' },
    { key: 'privacy', label: 'Privacy Policy', path: '/privacy' },
    { key: 'terms', label: 'Terms of Service', path: '/terms' },
];

export default function SEOSettings() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'global' | 'pages' | 'images'>('global');
    const [expandedPage, setExpandedPage] = useState<string | null>(null);
    const [savingPage, setSavingPage] = useState<string | null>(null);

    // Global SEO state
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        keywords: "",
        favicon: "",
        ogImage: "",
        robotsTxt: "User-agent: *\nAllow: /",
        googleAnalyticsId: "",
        googleVerification: "",
        twitterHandle: "",
        socialLinks: {
            facebook: "",
            twitter: "",
            instagram: "",
            linkedin: "",
            youtube: ""
        },
        images: {
            logo: "",
            heroBg: "",
            aboutImage: ""
        }
    });

    // Page SEO state
    const [pageSeoData, setPageSeoData] = useState<Record<string, PageSEO>>({});

    useEffect(() => {
        fetchSettings();
        fetchPageSEO();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch("/api/admin/seo");
            const data = await res.json();
            setFormData({
                title: data.title || "",
                description: data.description || "",
                keywords: data.keywords?.join(", ") || "",
                favicon: data.favicon || "",
                ogImage: data.ogImage || "",
                robotsTxt: data.robotsTxt || "User-agent: *\nAllow: /",
                googleAnalyticsId: data.googleAnalyticsId || "",
                googleVerification: data.googleVerification || "",
                twitterHandle: data.twitterHandle || "",
                socialLinks: {
                    facebook: data.socialLinks?.facebook || "",
                    twitter: data.socialLinks?.twitter || "",
                    instagram: data.socialLinks?.instagram || "",
                    linkedin: data.socialLinks?.linkedin || "",
                    youtube: data.socialLinks?.youtube || ""
                },
                images: {
                    logo: data.images?.logo || "",
                    heroBg: data.images?.heroBg || "",
                    aboutImage: data.images?.aboutImage || ""
                }
            });
        } catch {
            console.error("Failed to fetch SEO settings");
        } finally {
            setLoading(false);
        }
    };

    const fetchPageSEO = async () => {
        try {
            const res = await fetch("/api/admin/page-seo");
            const data = await res.json();
            const pageMap: Record<string, PageSEO> = {};

            // Initialize with defaults
            PAGES.forEach(page => {
                pageMap[page.key] = {
                    pageKey: page.key,
                    title: "",
                    description: "",
                    keywords: "",
                    ogImage: ""
                };
            });

            // Override with saved data
            if (Array.isArray(data)) {
                data.forEach((item: { pageKey: string; title?: string; description?: string; keywords?: string[]; ogImage?: string }) => {
                    if (pageMap[item.pageKey]) {
                        pageMap[item.pageKey] = {
                            ...pageMap[item.pageKey],
                            title: item.title || "",
                            description: item.description || "",
                            keywords: item.keywords?.join(", ") || "",
                            ogImage: item.ogImage || ""
                        };
                    }
                });
            }

            setPageSeoData(pageMap);
        } catch {
            console.error("Failed to fetch page SEO");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch("/api/admin/seo", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    keywords: formData.keywords.split(",").map(k => k.trim()).filter(k => k)
                })
            });
            if (!res.ok) throw new Error("Failed to save");
            alert("Global SEO settings saved successfully!");
        } catch {
            alert("Error saving settings");
        } finally {
            setSaving(false);
        }
    };

    const handlePageSEOSave = async (pageKey: string) => {
        setSavingPage(pageKey);
        try {
            const pageData = pageSeoData[pageKey];
            const res = await fetch("/api/admin/page-seo", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    pageKey,
                    title: pageData.title,
                    description: pageData.description,
                    keywords: pageData.keywords.split(",").map(k => k.trim()).filter(k => k),
                    ogImage: pageData.ogImage
                })
            });
            if (!res.ok) throw new Error("Failed to save");
            alert(`SEO for ${PAGES.find(p => p.key === pageKey)?.label} saved!`);
        } catch {
            alert("Error saving page SEO");
        } finally {
            setSavingPage(null);
        }
    };

    const updatePageSEO = (pageKey: string, field: keyof PageSEO, value: string) => {
        setPageSeoData(prev => ({
            ...prev,
            [pageKey]: {
                ...prev[pageKey],
                [field]: value
            }
        }));
    };

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-primary" /></div>;

    return (
        <div className="max-w-5xl mx-auto animate-[fadeIn_0.5s_ease-out_forwards] pb-20">
            <div className="flex items-center gap-4 mb-8">
                <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
                    <Globe className="w-8 h-8 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-slate-800">SEO Settings</h1>
                    <p className="text-slate-500 font-medium">Manage global and per-page SEO settings</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8">
                <button
                    onClick={() => setActiveTab('global')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all border ${activeTab === 'global'
                        ? 'bg-primary text-white border-primary shadow-lg shadow-primary/25'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-primary/50 hover:bg-slate-50'
                        }`}
                >
                    <Globe size={18} className="inline mr-2" />
                    Global Settings
                </button>
                <button
                    onClick={() => setActiveTab('pages')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all border ${activeTab === 'pages'
                        ? 'bg-primary text-white border-primary shadow-lg shadow-primary/25'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-primary/50 hover:bg-slate-50'
                        }`}
                >
                    <FileText size={18} className="inline mr-2" />
                    Page SEO
                </button>
                <button
                    onClick={() => setActiveTab('images')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all border ${activeTab === 'images'
                        ? 'bg-primary text-white border-primary shadow-lg shadow-primary/25'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-primary/50 hover:bg-slate-50'
                        }`}
                >
                    <ImageIcon size={18} className="inline mr-2" />
                    Images & Branding
                </button>
            </div>

            {activeTab === 'images' ? (
                <div className="space-y-8 animate-[fadeIn_0.5s_ease-out_forwards]">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
                        <p className="text-slate-600">
                            Manage your site&apos;s key images. Upload new images to replace the defaults.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Logo Upload */}
                        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl space-y-6">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                <h3 className="text-xl font-bold text-slate-800">Site Logo</h3>
                                <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded">Recommended: PNG/SVG</span>
                            </div>

                            <div className="aspect-video bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center relative overflow-hidden group hover:border-primary transition-colors">
                                {formData.images.logo ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={formData.images.logo} alt="Logo" className="max-h-full max-w-full p-4 object-contain" />
                                ) : (
                                    <div className="text-center p-6 text-slate-400">
                                        <ImageIcon size={40} className="mx-auto mb-2 opacity-50" />
                                        <span className="text-sm font-medium">No logo uploaded</span>
                                    </div>
                                )}

                                <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="bg-white text-slate-900 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2">
                                        <Upload size={16} /> Change Logo
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;

                                            const data = new FormData();
                                            data.append("file", file);

                                            try {
                                                const res = await fetch("/api/upload", { method: "POST", body: data });
                                                if (res.ok) {
                                                    const json = await res.json();
                                                    setFormData(prev => ({ ...prev, images: { ...prev.images, logo: json.url } }));
                                                }
                                            } catch (err) {
                                                console.error(err);
                                                alert("Upload failed");
                                            }
                                        }}
                                    />
                                </label>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Image URL</label>
                                <input
                                    type="text"
                                    value={formData.images.logo}
                                    onChange={(e) => setFormData(prev => ({ ...prev, images: { ...prev.images, logo: e.target.value } }))}
                                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-600 focus:outline-none focus:border-primary"
                                    placeholder="/uploads/..."
                                />
                            </div>
                        </div>

                        {/* Hero Background */}
                        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl space-y-6">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                <h3 className="text-xl font-bold text-slate-800">Hero Background</h3>
                            </div>

                            <div className="aspect-video bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center relative overflow-hidden group hover:border-primary transition-colors">
                                {formData.images.heroBg ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={formData.images.heroBg} alt="Hero" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center p-6 text-slate-400">
                                        <ImageIcon size={40} className="mx-auto mb-2 opacity-50" />
                                        <span className="text-sm font-medium">No image uploaded</span>
                                    </div>
                                )}

                                <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="bg-white text-slate-900 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2">
                                        <Upload size={16} /> Upload Image
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            const data = new FormData();
                                            data.append("file", file);
                                            try {
                                                const res = await fetch("/api/upload", { method: "POST", body: data });
                                                if (res.ok) {
                                                    const json = await res.json();
                                                    setFormData(prev => ({ ...prev, images: { ...prev.images, heroBg: json.url } }));
                                                }
                                            } catch (err) {
                                                console.error(err);
                                                alert("Upload failed");
                                            }
                                        }}
                                    />
                                </label>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Image URL</label>
                                <input
                                    type="text"
                                    value={formData.images.heroBg}
                                    onChange={(e) => setFormData(prev => ({ ...prev, images: { ...prev.images, heroBg: e.target.value } }))}
                                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-600 focus:outline-none focus:border-primary"
                                    placeholder="/uploads/..."
                                />
                            </div>
                        </div>

                        {/* About Image */}
                        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl space-y-6">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                <h3 className="text-xl font-bold text-slate-800">About Section Image</h3>
                            </div>

                            <div className="aspect-[4/3] bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center relative overflow-hidden group hover:border-primary transition-colors">
                                {formData.images.aboutImage ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={formData.images.aboutImage} alt="About" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center p-6 text-slate-400">
                                        <ImageIcon size={40} className="mx-auto mb-2 opacity-50" />
                                        <span className="text-sm font-medium">No image uploaded</span>
                                    </div>
                                )}

                                <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="bg-white text-slate-900 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2">
                                        <Upload size={16} /> Upload Image
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            const data = new FormData();
                                            data.append("file", file);
                                            try {
                                                const res = await fetch("/api/upload", { method: "POST", body: data });
                                                if (res.ok) {
                                                    const json = await res.json();
                                                    setFormData(prev => ({ ...prev, images: { ...prev.images, aboutImage: json.url } }));
                                                }
                                            } catch (err) {
                                                console.error(err);
                                                alert("Upload failed");
                                            }
                                        }}
                                    />
                                </label>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Image URL</label>
                                <input
                                    type="text"
                                    value={formData.images.aboutImage}
                                    onChange={(e) => setFormData(prev => ({ ...prev, images: { ...prev.images, aboutImage: e.target.value } }))}
                                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-600 focus:outline-none focus:border-primary"
                                    placeholder="/uploads/..."
                                />
                            </div>
                        </div>

                    </div>

                    <div className="flex justify-end sticky bottom-6 z-20">
                        <div className="bg-white/80 backdrop-blur-md p-2 rounded-2xl border border-slate-200 shadow-2xl">
                            <button
                                onClick={handleSubmit}
                                disabled={saving}
                                className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-900/20 disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                Save Image Settings
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}

            {activeTab === 'global' ? (
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* General Settings */}
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl space-y-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[50px] pointer-events-none" />
                        <h3 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4">Default Metadata</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Default Site Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full p-4 rounded-xl bg-white border-2 border-slate-200 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-bold text-slate-900 placeholder:text-slate-400"
                                    placeholder="e.g. Learnink Education"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Meta Keywords</label>
                                <input
                                    type="text"
                                    value={formData.keywords}
                                    onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                                    className="w-full p-4 rounded-xl bg-white border-2 border-slate-200 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-bold text-slate-900 placeholder:text-slate-400"
                                    placeholder="education, degrees, online courses"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Default Meta Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full p-4 rounded-xl bg-white border-2 border-slate-200 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium min-h-[100px] text-slate-900 placeholder:text-slate-400"
                                placeholder="A brief description of your site for search engines."
                            />
                        </div>
                    </div>

                    {/* Search Engine Preview */}
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl space-y-4">
                        <h3 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4 flex items-center gap-2">
                            <Search size={20} className="text-primary" />
                            Search Result Preview
                        </h3>
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                            <p className="text-blue-600 text-xl font-medium hover:underline cursor-pointer truncate">
                                {formData.title || "Your Site Title"}
                            </p>
                            <p className="text-green-700 text-sm">
                                https://learnink.edu.in
                            </p>
                            <p className="text-slate-600 text-sm mt-1 line-clamp-2">
                                {formData.description || "Your meta description will appear here..."}
                            </p>
                        </div>
                    </div>

                    {/* Assets & Integrations */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl space-y-6">
                            <h3 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4">Assets</h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Favicon URL</label>
                                    <input
                                        type="text"
                                        value={formData.favicon}
                                        onChange={(e) => setFormData({ ...formData, favicon: e.target.value })}
                                        className="w-full p-4 rounded-xl bg-white border-2 border-slate-200 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-bold text-slate-900 placeholder:text-slate-400"
                                        placeholder="https://..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Default OG Image URL</label>
                                    <input
                                        type="text"
                                        value={formData.ogImage}
                                        onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
                                        className="w-full p-4 rounded-xl bg-white border-2 border-slate-200 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-bold text-slate-900 placeholder:text-slate-400"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl space-y-6">
                            <h3 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4">Integrations</h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Google Analytics ID</label>
                                    <input
                                        type="text"
                                        value={formData.googleAnalyticsId}
                                        onChange={(e) => setFormData({ ...formData, googleAnalyticsId: e.target.value })}
                                        className="w-full p-4 rounded-xl bg-white border-2 border-slate-200 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-bold text-slate-900 placeholder:text-slate-400"
                                        placeholder="G-XXXXXXXXXX"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Google Search Console Verification</label>
                                    <input
                                        type="text"
                                        value={formData.googleVerification}
                                        onChange={(e) => setFormData({ ...formData, googleVerification: e.target.value })}
                                        className="w-full p-4 rounded-xl bg-white border-2 border-slate-200 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-bold text-slate-900 placeholder:text-slate-400"
                                        placeholder="Verification code"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Twitter */}
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl space-y-6">
                        <h3 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4 flex items-center gap-2">
                            <Twitter size={20} className="text-sky-500" />
                            Twitter Card Settings
                        </h3>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Twitter Handle</label>
                            <input
                                type="text"
                                value={formData.twitterHandle}
                                onChange={(e) => setFormData({ ...formData, twitterHandle: e.target.value })}
                                className="w-full p-4 rounded-xl bg-white border-2 border-slate-200 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-bold text-slate-900 placeholder:text-slate-400"
                                placeholder="@learnink"
                            />
                        </div>
                    </div>

                    {/* Social Media */}
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl space-y-6">
                        <h3 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4">Social Media Links</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {(['facebook', 'twitter', 'instagram', 'linkedin', 'youtube'] as const).map((social) => (
                                <div key={social} className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1 capitalize">{social}</label>
                                    <input
                                        type="text"
                                        value={formData.socialLinks[social]}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            socialLinks: { ...formData.socialLinks, [social]: e.target.value }
                                        })}
                                        className="w-full p-4 rounded-xl bg-white border-2 border-slate-200 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-bold text-slate-900 placeholder:text-slate-400"
                                        placeholder={`https://${social}.com/...`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Robots.txt */}
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl space-y-6">
                        <h3 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4">Robots.txt Configuration</h3>
                        <div className="space-y-2">
                            <textarea
                                value={formData.robotsTxt}
                                onChange={(e) => setFormData({ ...formData, robotsTxt: e.target.value })}
                                className="w-full p-4 rounded-xl bg-[#1e293b] text-green-400 font-mono text-sm border border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all min-h-[200px]"
                                placeholder="User-agent: *..."
                            />
                        </div>
                    </div>

                    <div className="flex justify-end sticky bottom-6 z-20">
                        <div className="bg-white/80 backdrop-blur-md p-2 rounded-2xl border border-slate-200 shadow-2xl">
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-900/20 disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                Save Global Settings
                            </button>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="space-y-4">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <p className="text-slate-600">
                            Configure SEO settings for individual pages. Leave fields empty to use global defaults.
                        </p>
                    </div>

                    {PAGES.map((page) => (
                        <div key={page.key} className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden">
                            <button
                                onClick={() => setExpandedPage(expandedPage === page.key ? null : page.key)}
                                className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <FileText size={20} className="text-primary" />
                                    </div>
                                    <div className="text-left">
                                        <h4 className="font-bold text-slate-800">{page.label}</h4>
                                        <p className="text-sm text-slate-500">{page.path}</p>
                                    </div>
                                </div>
                                {expandedPage === page.key ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                            </button>

                            {expandedPage === page.key && (
                                <div className="p-6 pt-0 space-y-4 border-t border-slate-100">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Page Title</label>
                                            <input
                                                type="text"
                                                value={pageSeoData[page.key]?.title || ""}
                                                onChange={(e) => updatePageSEO(page.key, 'title', e.target.value)}
                                                className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-slate-900 placeholder:text-slate-400"
                                                placeholder={`${page.label} | Learnink Education`}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Keywords</label>
                                            <input
                                                type="text"
                                                value={pageSeoData[page.key]?.keywords || ""}
                                                onChange={(e) => updatePageSEO(page.key, 'keywords', e.target.value)}
                                                className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-slate-900 placeholder:text-slate-400"
                                                placeholder="keyword1, keyword2"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Meta Description</label>
                                        <textarea
                                            value={pageSeoData[page.key]?.description || ""}
                                            onChange={(e) => updatePageSEO(page.key, 'description', e.target.value)}
                                            className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium min-h-[80px] text-slate-900 placeholder:text-slate-400"
                                            placeholder="Description for this page..."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">OG Image URL (optional)</label>
                                        <input
                                            type="text"
                                            value={pageSeoData[page.key]?.ogImage || ""}
                                            onChange={(e) => updatePageSEO(page.key, 'ogImage', e.target.value)}
                                            className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-slate-900 placeholder:text-slate-400"
                                            placeholder="https://... (leave empty to use default)"
                                        />
                                    </div>

                                    {/* Preview */}
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Search Preview</p>
                                        <p className="text-blue-600 font-medium truncate">
                                            {pageSeoData[page.key]?.title || `${page.label} | Learnink Education`}
                                        </p>
                                        <p className="text-green-700 text-sm">
                                            https://learnink.edu.in{page.path}
                                        </p>
                                        <p className="text-slate-600 text-sm mt-1 line-clamp-2">
                                            {pageSeoData[page.key]?.description || "Using default description..."}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => handlePageSEOSave(page.key)}
                                        disabled={savingPage === page.key}
                                        className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-900/20 disabled:opacity-50"
                                    >
                                        {savingPage === page.key ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                        Save {page.label} SEO
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
