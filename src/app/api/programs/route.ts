import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Program } from "@/lib/models";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
    await dbConnect();
    try {
        const programs = await Program.find({}).sort({ createdAt: -1 }).lean();
        return NextResponse.json(JSON.parse(JSON.stringify(programs)));
    } catch {
        return NextResponse.json({ error: "Failed to fetch programs" }, { status: 500 });
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
        const program = await Program.create(data);
        return NextResponse.json(JSON.parse(JSON.stringify(program)), { status: 201 });
    } catch {
        return NextResponse.json({ error: "Failed to create program" }, { status: 500 });
    }
}
