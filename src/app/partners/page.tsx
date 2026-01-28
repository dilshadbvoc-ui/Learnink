import Navbar from "@/components/Navbar";
import Partners from "@/components/Partners";
import Footer from "@/components/Footer";
import { Metadata } from "next";
import { PageSEO, SiteConfig } from "@/lib/models";
import dbConnect from "@/lib/mongodb";

export async function generateMetadata(): Promise<Metadata> {
    try {
        await dbConnect();
        const pageSeo = await PageSEO.findOne({ pageKey: 'partners' }).lean();
        const globalConfig = await SiteConfig.findOne({ key: 'global-seo' }).lean();

        const title = pageSeo?.title || `Our University Partners | Learnink Education`;
        const description = pageSeo?.description || globalConfig?.description || "Explore our network of prestigious global university partners.";
        const keywords = pageSeo?.keywords?.length ? pageSeo.keywords : globalConfig?.keywords;
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
            title: "Our University Partners | Learnink Education",
        };
    }
}

export default function PartnersPage() {
    return (
        <main className="min-h-screen pt-32 flex flex-col bg-slate-50">
            <Navbar />
            <div className="flex-1 w-full">
                <Partners fullWidth={true} />
            </div>
            <Footer />
        </main>
    );
}
