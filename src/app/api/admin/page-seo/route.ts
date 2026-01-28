import { NextRequest, NextResponse } from "next/server";
import { PageSEO } from "@/lib/models";
import dbConnect from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// Get all page SEO settings or specific page
export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const pageKey = searchParams.get('page');

        if (pageKey) {
            const pageSeo = await PageSEO.findOne({ pageKey }).lean();
            return NextResponse.json(pageSeo || { pageKey, title: '', description: '', keywords: [], ogImage: '' });
        }

        // Return all page SEO settings
        const allPages = await PageSEO.find({}).lean();
        return NextResponse.json(JSON.parse(JSON.stringify(allPages)));
    } catch {
        return NextResponse.json({ error: "Failed to fetch page SEO" }, { status: 500 });
    }
}

// Update or create page SEO settings
export async function PUT(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await dbConnect();
        const body = await req.json();
        const { pageKey, title, description, keywords, ogImage } = body;

        if (!pageKey) {
            return NextResponse.json({ error: "pageKey is required" }, { status: 400 });
        }

        const pageSeo = await PageSEO.findOneAndUpdate(
            { pageKey },
            { title, description, keywords, ogImage },
            { new: true, upsert: true }
        ).lean();

        return NextResponse.json(JSON.parse(JSON.stringify(pageSeo)));
    } catch {
        return NextResponse.json({ error: "Failed to update page SEO" }, { status: 500 });
    }
}
