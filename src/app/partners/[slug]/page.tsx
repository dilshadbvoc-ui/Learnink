import { Partner } from "@/lib/models";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, GraduationCap, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import dbConnect from "@/lib/mongodb";

interface Props {
    params: Promise<{ slug: string }>;
}

interface ProgramItem {
    _id: string;
    title: string;
    description: string;
    category: string;
    slug: string;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    await dbConnect();
    const { slug } = await params;
    const partner = await Partner.findOne({ slug }).lean();

    if (!partner) return {};

    return {
        title: `${partner.name} | Learnink University Partner`,
        description: partner.description || `Learn about ${partner.name} and the programs they offer through Learnink Education.`,
    };
}

export default async function PartnerDetailPage({ params }: Props) {
    await dbConnect();
    const { slug } = await params;

    // Populate programs to show the list
    const partner = await Partner.findOne({ slug }).populate('programs').lean();

    if (!partner) notFound();

    return (
        <main className="min-h-screen pt-32 pb-20 flex flex-col bg-slate-50">
            <Navbar />
            <div className="flex-1 px-6">
                <div className="max-w-6xl mx-auto animate-[fadeIn_0.8s_ease-out_forwards]">
                    {/* Header Section */}
                    <Link href="/partners" className="inline-flex items-center gap-2 text-primary/80 hover:text-primary mb-12 font-bold transition-all hover:-translate-x-1">
                        <ArrowLeft size={20} /> Back to Partners
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Sidebar: Logo & Quick Info */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-[3rem] p-10 border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center sticky top-24">
                                <div className="w-48 h-48 rounded-3xl bg-white border border-slate-100 p-8 flex items-center justify-center mb-8 shadow-inner">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={partner.logo} alt={partner.name} className="w-full h-full object-contain mix-blend-multiply" />
                                </div>
                                <h1 className="text-3xl font-black text-slate-900 mb-4">{partner.name}</h1>

                                {partner.enrollLink && (
                                    <a
                                        href={partner.enrollLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full bg-primary text-white py-4 rounded-2xl font-black hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group"
                                    >
                                        Direct Enrollment <ExternalLink size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </a>
                                )}

                                <div className="mt-8 pt-8 border-t border-slate-100 w-full space-y-4">
                                    <div className="flex items-center gap-3 text-slate-500 text-sm font-bold uppercase tracking-wider">
                                        <CheckCircle2 size={18} className="text-success" />
                                        Verified Partner
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-500 text-sm font-bold uppercase tracking-wider">
                                        <GraduationCap size={18} className="text-secondary" />
                                        {partner.programs?.length || 0} Programs Offered
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Content: Description & Programs */}
                        <div className="lg:col-span-2 space-y-12">
                            {/* University Description */}
                            <section className="bg-white rounded-[3rem] p-12 border border-slate-200 shadow-xl shadow-slate-200/50">
                                <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-primary" />
                                    </div>
                                    About the University
                                </h2>
                                <div className="prose prose-lg text-slate-600 max-w-none leading-relaxed font-medium">
                                    {partner.description || "Information about this prestigious partner will be updated shortly."}
                                </div>
                            </section>

                            {/* Programs Offered */}
                            <section>
                                <h2 className="text-2xl font-black text-slate-900 mb-8 px-4 flex items-center gap-3">
                                    Available Programs at {partner.name}
                                </h2>

                                <div className="grid grid-cols-1 gap-6">
                                    {partner.programs?.length > 0 ? (
                                        partner.programs.map((program: ProgramItem) => (
                                            <div key={program._id} className="bg-white group p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:border-primary/50 transition-all duration-500 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                <div className="flex-1">
                                                    <span className="inline-block px-3 py-1 rounded-lg bg-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest mb-3 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                        {program.category}
                                                    </span>
                                                    <h3 className="text-xl font-bold text-slate-800 group-hover:text-primary transition-colors">{program.title}</h3>
                                                    <p className="text-slate-500 text-sm mt-2 line-clamp-1">{program.description}</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Link
                                                        href={`/programs/${program.slug}`}
                                                        className="px-6 py-3 rounded-xl bg-slate-50 text-slate-600 font-bold text-sm hover:bg-slate-100 transition-all"
                                                    >
                                                        Details
                                                    </Link>
                                                    <Link
                                                        href="/contact"
                                                        className="px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark shadow-md hover:shadow-lg transition-all"
                                                    >
                                                        Enroll Now
                                                    </Link>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="bg-slate-100/50 border-2 border-dashed border-slate-200 rounded-[2rem] p-12 text-center text-slate-400 font-bold italic">
                                            No programs currently listed.
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
