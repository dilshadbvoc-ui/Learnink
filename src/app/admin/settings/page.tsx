"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, Webhook, ShieldCheck, AlertCircle } from "lucide-react";

export default function IntegrationSettings() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [config, setConfig] = useState({
        crmWebhookUrl: "",
        crmAuthToken: "",
        enabled: false
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch("/api/admin/integrations");
            if (res.ok) {
                const data = await res.json();
                setConfig({
                    crmWebhookUrl: data.crmWebhookUrl || "",
                    crmAuthToken: data.crmAuthToken || "",
                    enabled: data.enabled || false
                });
            }
        } catch (error) {
            console.error("Failed to fetch settings", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const res = await fetch("/api/admin/integrations", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(config),
            });

            if (res.ok) {
                alert("Settings saved successfully!");
            } else {
                throw new Error("Failed to save");
            }
        } catch {
            alert("Failed to save settings. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center p-20">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    return (
        <div className="animate-[fade-in_0.5s_ease-out_forwards] max-w-4xl mx-auto pb-20">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-800 mb-2">Integration Settings</h1>
                <p className="text-slate-600 font-medium">Configure connections to external tools and CRMs.</p>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-blue-500 shadow-sm">
                            <Webhook size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">CRM Webhook Integration</h2>
                            <p className="text-slate-500 text-sm font-medium">Automatically forward new student enquiries to your CRM.</p>
                        </div>
                        <div className="ml-auto">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={config.enabled}
                                    onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                                <span className="ml-3 text-sm font-bold text-slate-600">{config.enabled ? 'Enabled' : 'Disabled'}</span>
                            </label>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Webhook URL</label>
                            <div className="relative">
                                <input
                                    type="url"
                                    value={config.crmWebhookUrl}
                                    onChange={(e) => setConfig({ ...config, crmWebhookUrl: e.target.value })}
                                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 border-2 border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-slate-800 placeholder:text-slate-400"
                                    placeholder="https://hooks.zapier.com/hooks/catch/..."
                                />
                                <Webhook className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            </div>
                            <p className="text-xs text-slate-500 flex items-center gap-1 pl-1">
                                <AlertCircle size={12} />
                                Enter the webhook URL provided by your CRM (HubSpot, Salesforce, Zapier, etc.)
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Authorization Token (Optional)</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={config.crmAuthToken}
                                    onChange={(e) => setConfig({ ...config, crmAuthToken: e.target.value })}
                                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 border-2 border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-slate-800 placeholder:text-slate-400"
                                    placeholder="Secret Token / API Key"
                                />
                                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            </div>
                            <p className="text-xs text-slate-500 pl-1">
                                Only required if your webhook endpoint needs a Bearer token authentication.
                            </p>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex items-center justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center gap-2"
                        >
                            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
