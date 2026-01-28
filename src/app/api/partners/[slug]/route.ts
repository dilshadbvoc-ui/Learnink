import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Partner } from "@/lib/models";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    await dbConnect();
    try {
        const { slug } = await params;
        // Populate programs so they can be displayed on the detail page
        const partner = await Partner.findOne({ slug }).populate('programs').lean();

        if (!partner) {
            return NextResponse.json({ error: "Partner not found" }, { status: 404 });
        }

        return NextResponse.json(JSON.parse(JSON.stringify(partner)));
    } catch {
        return NextResponse.json({ error: "Failed to fetch partner" }, { status: 500 });
    }
}
