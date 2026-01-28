import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PageSEO, SiteConfig } from "@/lib/models";
import dbConnect from "@/lib/mongodb";

export async function generateMetadata(): Promise<Metadata> {
    try {
        await dbConnect();
        const pageSeo = await PageSEO.findOne({ pageKey: 'privacy' }).lean();
        const globalConfig = await SiteConfig.findOne({ key: 'global-seo' }).lean();

        const title = pageSeo?.title || "Privacy Policy";
        const description = pageSeo?.description || "Learn how Learnink Education Pvt Ltd collects, uses, and protects your personal information.";
        const ogImage = pageSeo?.ogImage || globalConfig?.ogImage;

        return {
            title,
            description,
            openGraph: {
                title,
                description,
                images: ogImage ? [{ url: ogImage }] : undefined,
            },
        };
    } catch {
        return {
            title: "Privacy Policy",
            description: "Learn how Learnink Education Pvt Ltd protects your personal information.",
        };
    }
}

export default function PrivacyPage() {
    return (
        <main className="min-h-screen pt-25 flex flex-col bg-slate-50">
            <Navbar />
            <div className="flex-1 w-full max-w-4xl mx-auto px-6 py-16">
                <h1 className="text-4xl font-black text-[#1a202c] mb-8">Privacy Policy</h1>

                <div className="prose prose-lg text-slate-600 max-w-none">
                    <p className="text-lg font-medium mb-6">
                        Last updated: {new Date().toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-[#1a202c] mb-4">Information We Collect</h2>
                        <p>
                            We collect information you provide directly to us, such as when you create an account,
                            submit an enquiry, subscribe to our newsletter, or contact us for support.
                        </p>
                        <ul className="list-disc pl-6 mt-4 space-y-2">
                            <li>Name and contact information (email, phone number)</li>
                            <li>Educational background and program preferences</li>
                            <li>Any other information you choose to provide</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-[#1a202c] mb-4">How We Use Your Information</h2>
                        <p>We use the information we collect to:</p>
                        <ul className="list-disc pl-6 mt-4 space-y-2">
                            <li>Process your enquiries and applications</li>
                            <li>Send you information about our programs and services</li>
                            <li>Respond to your comments and questions</li>
                            <li>Improve our website and services</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-[#1a202c] mb-4">Data Protection</h2>
                        <p>
                            We implement appropriate security measures to protect your personal information
                            against unauthorized access, alteration, disclosure, or destruction.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-[#1a202c] mb-4">Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us at{" "}
                            <a href="mailto:learninkclt@gmail.com" className="text-primary hover:underline">
                                learninkclt@gmail.com
                            </a>
                        </p>
                    </section>
                </div>
            </div>
            <Footer />
        </main>
    );
}
