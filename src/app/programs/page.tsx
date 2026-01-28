import { Metadata } from "next";
import Programs from "@/components/Programs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PageSEO, SiteConfig } from "@/lib/models";
import dbConnect from "@/lib/mongodb";

export async function generateMetadata(): Promise<Metadata> {
    try {
        await dbConnect();
        const pageSeo = await PageSEO.findOne({ pageKey: 'programs' }).lean();
        const globalConfig = await SiteConfig.findOne({ key: 'global-seo' }).lean();

        const title = pageSeo?.title || "Educational Programs";
        const description = pageSeo?.description || "Explore our wide range of educational programs - Fast Track Degrees, Credit Transfer, Online Degrees, and more.";
        const keywords = pageSeo?.keywords?.length ? pageSeo.keywords : ["degree programs", "fast track degree", "online education"];
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
            title: "Educational Programs",
            description: "Explore our wide range of educational programs",
        };
    }
}

export default function ProgramsPage() {
    return (
        <main className="min-h-screen pt-25 flex flex-col bg-slate-50">
            <Navbar />
            <div className="flex-1 w-full">
                <Programs />
            </div>
            <Footer />
        </main>
    );
}
