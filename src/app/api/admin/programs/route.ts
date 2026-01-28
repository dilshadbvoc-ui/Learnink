import { NextResponse } from "next/server";
import { Program } from "@/lib/models";
import dbConnect from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await dbConnect();
        const programs = await Program.find().sort({ createdAt: -1 }).lean();
        return NextResponse.json(JSON.parse(JSON.stringify(programs)));
    } catch {
        return NextResponse.json({ error: "Failed to fetch programs" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await dbConnect();
        const body = await request.json();
        const program = await Program.create(body);
        return NextResponse.json(JSON.parse(JSON.stringify(program)), { status: 201 });
    } catch {
        return NextResponse.json({ error: "Failed to create program" }, { status: 500 });
    }
}
