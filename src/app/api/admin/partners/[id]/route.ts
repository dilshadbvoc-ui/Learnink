import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Partner } from "@/lib/models";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

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
        const data = await req.json();
        const partner = await Partner.findByIdAndUpdate(id, data, { new: true });

        if (!partner) {
            return NextResponse.json({ error: "Partner not found" }, { status: 404 });
        }

        return NextResponse.json(JSON.parse(JSON.stringify(partner)));
    } catch {
        return NextResponse.json({ error: "Failed to update partner" }, { status: 500 });
    }
}

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
        await Partner.findByIdAndDelete(id);
        return NextResponse.json({ message: "Partner deleted" });
    } catch {
        return NextResponse.json({ error: "Failed to delete partner" }, { status: 500 });
    }
}
