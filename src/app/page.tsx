
import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Programs from "@/components/Programs";
import Partners from "@/components/Partners";
import Gallery from "@/components/Gallery";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageSEO, SiteConfig } from "@/lib/models";
import dbConnect from "@/lib/mongodb";

export async function generateMetadata(): Promise<Metadata> {
  try {
    await dbConnect();
    const pageSeo = await PageSEO.findOne({ pageKey: 'home' }).lean();
    const globalConfig = await SiteConfig.findOne({ key: 'global-seo' }).lean();

    const title = pageSeo?.title || globalConfig?.title || "Learnink Education | Linking Learning, Skills & Careers";
    const description = pageSeo?.description || globalConfig?.description || "Learnink Education Pvt Ltd is an all-in-one education platform offering degree programs, fast track courses, and more.";
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
      title: "Learnink Education | Linking Learning, Skills & Careers",
      description: "Learnink Education Pvt Ltd is an all-in-one education platform offering degree programs, fast track courses, and more.",
    };
  }
}

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <Hero />

      {/* Featured Partners Section */}
      <div>
        <Partners limit={6} />
        <div className="text-center pb-20 -mt-10 mb-10">
          <Link
            href="/partners"
            className="inline-flex items-center gap-2 text-primary font-bold hover:text-primary-dark transition-colors text-lg"
          >
            View All Universities <ArrowRight size={20} />
          </Link>
        </div>
      </div>

      {/* Featured Programs Section */}
      <div className="relative">
        <Programs limit={3} />
        <div className="text-center pb-20 relative z-10 -mt-10">
          <Link
            href="/programs"
            className="inline-flex items-center gap-2 text-primary font-bold hover:text-primary-dark transition-colors text-lg"
          >
            View All Programs <ArrowRight size={20} />
          </Link>
        </div>
      </div>

      <Gallery />
      <Testimonials />

      <Footer />
    </main>
  );
}
