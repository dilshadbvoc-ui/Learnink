import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Partner } from "@/lib/models";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
    await dbConnect();
    try {
        const partners = await Partner.find({}).sort({ order: 1 }).lean();
        return NextResponse.json(JSON.parse(JSON.stringify(partners)));
    } catch {
        return NextResponse.json({ error: "Failed to fetch partners" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    try {
        const data = await req.json();
        const partner = await Partner.create(data);
        return NextResponse.json(JSON.parse(JSON.stringify(partner)), { status: 201 });
    } catch {
        return NextResponse.json({ error: "Failed to create partner" }, { status: 500 });
    }
}
