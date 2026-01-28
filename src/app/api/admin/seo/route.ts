import { NextResponse } from "next/server";
import { SiteConfig } from "@/lib/models";
import dbConnect from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        await dbConnect();

        let config = await SiteConfig.findOne({ key: 'global-seo' }).lean();

        // Create default if not exists
        if (!config) {
            const newConfig = await SiteConfig.create({
                key: 'global-seo',
                title: 'Learnink Education',
                description: 'Linking Learning, Skills & Careers',
                keywords: ['education', 'learnink'],
            });
            config = newConfig.toObject();
        }

        return NextResponse.json(JSON.parse(JSON.stringify(config)));
    } catch (e) {
        console.error("SEO API Error:", e);
        return NextResponse.json(
            { error: "Failed to fetch SEO settings" },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await dbConnect();
        const body = await request.json();

        const config = await SiteConfig.findOneAndUpdate(
            { key: 'global-seo' },
            {
                title: body.title,
                description: body.description,
                keywords: body.keywords,
                favicon: body.favicon,
                ogImage: body.ogImage,
                robotsTxt: body.robotsTxt,
                googleAnalyticsId: body.googleAnalyticsId,
                googleVerification: body.googleVerification,
                twitterHandle: body.twitterHandle,
                socialLinks: body.socialLinks,
                images: body.images
            },
            { new: true, upsert: true }
        ).lean();

        return NextResponse.json(JSON.parse(JSON.stringify(config)));
    } catch {
        return NextResponse.json(
            { error: "Failed to update SEO settings" },
            { status: 500 }
        );
    }
}
