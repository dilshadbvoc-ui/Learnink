import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Testimonial } from "@/lib/models";

export async function GET() {
    try {
        await dbConnect();
        const testimonials = await Testimonial.find({}).sort({ order: 1, createdAt: -1 });
        return NextResponse.json(testimonials);
    } catch {
        return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
    }
}
