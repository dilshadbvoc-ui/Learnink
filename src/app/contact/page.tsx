import { Metadata } from "next";
import Contact from "@/components/Contact";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PageSEO, SiteConfig } from "@/lib/models";
import dbConnect from "@/lib/mongodb";

export async function generateMetadata(): Promise<Metadata> {
    try {
        await dbConnect();
        const pageSeo = await PageSEO.findOne({ pageKey: 'contact' }).lean();
        const globalConfig = await SiteConfig.findOne({ key: 'global-seo' }).lean();

        const title = pageSeo?.title || "Contact Us";
        const description = pageSeo?.description || "Get in touch with Learnink Education. Submit your enquiry, talk to our counselors, or visit our office in Calicut.";
        const keywords = pageSeo?.keywords?.length ? pageSeo.keywords : ["contact learnink", "education enquiry", "calicut education"];
        const ogImage = pageSeo?.ogImage || globalConfig?.ogImage;

        return {
            title,
            description,
            keywords,
            openGraph: {
                title,
                description,
                images: ogImage ? [{ url: ogImage }] : undefined,
            },
        };
    } catch {
        return {
            title: "Contact Us",
            description: "Get in touch with Learnink Education",
        };
    }
}

export default function ContactPage() {
    return (
        <main className="min-h-screen pt-25 flex flex-col bg-slate-50">
            <Navbar />
            <div className="flex-1 w-full">
                <Contact />
            </div>
            <Footer />
        </main>
    );
}
