import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Enquiry } from "@/lib/models";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    try {
        const { id } = await params;
        await Enquiry.findByIdAndDelete(id);
        return NextResponse.json({ message: "Enquiry deleted" });
    } catch {
        return NextResponse.json({ error: "Failed to delete enquiry" }, { status: 500 });
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    try {
        const { id } = await params;
        const body = await req.json();
        const enquiry = await Enquiry.findByIdAndUpdate(id, body, { new: true });
        return NextResponse.json(JSON.parse(JSON.stringify(enquiry)));
    } catch {
        return NextResponse.json({ error: "Failed to update enquiry" }, { status: 500 });
    }
}
