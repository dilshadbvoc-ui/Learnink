import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PageSEO, SiteConfig } from "@/lib/models";
import dbConnect from "@/lib/mongodb";

export async function generateMetadata(): Promise<Metadata> {
    try {
        await dbConnect();
        const pageSeo = await PageSEO.findOne({ pageKey: 'terms' }).lean();
        const globalConfig = await SiteConfig.findOne({ key: 'global-seo' }).lean();

        const title = pageSeo?.title || "Terms of Service";
        const description = pageSeo?.description || "Read the terms and conditions for using Learnink Education's services and platform.";
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
            title: "Terms of Service",
            description: "Read the terms and conditions for using Learnink Education's services.",
        };
    }
}

export default function TermsPage() {
    return (
        <main className="min-h-screen pt-25 flex flex-col bg-slate-50">
            <Navbar />
            <div className="flex-1 w-full max-w-4xl mx-auto px-6 py-16">
                <h1 className="text-4xl font-black text-[#1a202c] mb-8">Terms of Service</h1>

                <div className="prose prose-lg text-slate-600 max-w-none">
                    <p className="text-lg font-medium mb-6">
                        Last updated: {new Date().toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-[#1a202c] mb-4">Acceptance of Terms</h2>
                        <p>
                            By accessing and using this website, you accept and agree to be bound by the terms
                            and provisions of this agreement. If you do not agree to abide by these terms,
                            please do not use this service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-[#1a202c] mb-4">Services</h2>
                        <p>
                            Learnink Education Pvt Ltd provides educational consulting services, including
                            but not limited to degree programs, fast track courses, credit transfers, and
                            online learning options. All services are subject to availability and applicable
                            eligibility criteria.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-[#1a202c] mb-4">User Responsibilities</h2>
                        <ul className="list-disc pl-6 mt-4 space-y-2">
                            <li>Provide accurate and complete information when submitting enquiries</li>
                            <li>Maintain the confidentiality of your account information</li>
                            <li>Use our services only for lawful purposes</li>
                            <li>Not to misuse or attempt to exploit our platform</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-[#1a202c] mb-4">Intellectual Property</h2>
                        <p>
                            All content on this website, including text, graphics, logos, and images,
                            is the property of Learnink Education Pvt Ltd and is protected by applicable
                            intellectual property laws.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-[#1a202c] mb-4">Limitation of Liability</h2>
                        <p>
                            Learnink Education Pvt Ltd shall not be liable for any indirect, incidental,
                            special, or consequential damages arising from the use of our services.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-[#1a202c] mb-4">Contact</h2>
                        <p>
                            For any questions regarding these terms, please contact us at{" "}
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
