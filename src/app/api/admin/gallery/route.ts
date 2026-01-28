import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { GalleryPhoto } from "@/lib/models";
import { getServerSession } from "next-auth";

export async function GET() {
    try {
        await dbConnect();
        const photos = await GalleryPhoto.find({}).sort({ order: 1, createdAt: -1 });
        return NextResponse.json(photos);
    } catch {
        return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        await dbConnect();
        const body = await req.json();
        const photo = await GalleryPhoto.create(body);
        return NextResponse.json(photo);
    } catch {
        return NextResponse.json({ error: "Failed to create photo" }, { status: 500 });
    }
}
