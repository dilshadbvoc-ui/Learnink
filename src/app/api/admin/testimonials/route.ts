import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Testimonial } from "@/lib/models";
import { getServerSession } from "next-auth";

export async function GET() {
    try {
        await dbConnect();
        const testimonials = await Testimonial.find({}).sort({ order: 1, createdAt: -1 });
        return NextResponse.json(testimonials);
    } catch {
        return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        await dbConnect();
        const body = await req.json();
        const testimonial = await Testimonial.create(body);
        return NextResponse.json(testimonial);
    } catch {
        return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 });
    }
}
