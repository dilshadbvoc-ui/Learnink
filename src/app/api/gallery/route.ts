import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { GalleryPhoto } from "@/lib/models";

export async function GET() {
    try {
        await dbConnect();
        const photos = await GalleryPhoto.find({}).sort({ order: 1, createdAt: -1 });
        return NextResponse.json(photos);
    } catch {
        return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 });
    }
}
