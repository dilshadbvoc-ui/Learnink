import { Program } from "@/lib/models";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CourseSchema } from "@/components/JsonLd";

import dbConnect from "@/lib/mongodb";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://learnink.edu.in";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    await dbConnect();
    const { slug } = await params;
    const program = await Program.findOne({ slug }).lean();

    if (!program) return {};

    const title = program.metaTitle || program.title;
    const description = program.metaDescription || program.description;

    return {
        title: title,
        description: description,
        keywords: program.keywords,
        alternates: {
            canonical: `${siteUrl}/programs/${slug}`,
        },
        openGraph: {
            title: title,
            description: description,
            url: `${siteUrl}/programs/${slug}`,
            type: 'article',
        },
        twitter: {
            card: 'summary',
            title: title,
            description: description,
        },
    };
}

export default async function ProgramPage({ params }: Props) {
    await dbConnect();
    const { slug } = await params;
    const program = await Program.findOne({ slug }).lean();

    if (!program) notFound();

    return (
        <>
            <CourseSchema
                name={program.title}
                description={program.description}
                provider="Learnink Education"
                url={`${siteUrl}/programs/${slug}`}
                category={program.category}
            />
            <main className="min-h-screen pt-25 pb-20 flex flex-col bg-slate-50">
                <Navbar />
                <div className="flex-1 px-6">
                    <div className="max-w-4xl mx-auto animate-[fadeIn_0.8s_ease-out_forwards]">
                        <Link href="/programs" className="inline-flex items-center gap-2 text-primary/80 hover:text-primary mb-8 font-medium transition-colors">
                            <ArrowLeft size={20} /> Back to Programs
                        </Link>

                        <article className="bg-white/70 backdrop-blur-md border border-slate-200 shadow-xl p-10 rounded-[3rem]">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-sm tracking-widest uppercase mb-6">
                                {program.category}
                            </span>

                            <h1 className="text-4xl md:text-5xl font-black text-[#1a202c] mb-6 leading-tight">
                                {program.title}
                            </h1>

                            <div className="prose prose-lg text-slate-600 max-w-none">
                                <p className="text-xl leading-relaxed mb-8 font-medium">
                                    {program.description}
                                </p>

                                {program.content ? (
                                    <div dangerouslySetInnerHTML={{ __html: program.content }} />
                                ) : (
                                    <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 text-center text-slate-400 italic">
                                        Detailed content coming soon.
                                    </div>
                                )}
                            </div>

                            <div className="mt-12 pt-12 border-t border-slate-100 flex flex-col md:flex-row gap-6 items-center justify-between">
                                <div>
                                    <p className="font-bold text-[#1a202c] text-lg">Interested in this program?</p>
                                    <p className="text-slate-500">Get in touch with our counselors today.</p>
                                </div>
                                <Link
                                    href="/contact"
                                    className="bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg hover:-translate-y-1"
                                >
                                    Enquire Now
                                </Link>
                            </div>
                        </article>
                    </div>
                </div>
                <Footer />
            </main>
        </>
    );
}
