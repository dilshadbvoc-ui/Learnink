import { NextResponse } from "next/server";
import { Program } from "@/lib/models";
import dbConnect from "@/lib/mongodb";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const program = await Program.findById(id).lean();
        if (!program) {
            return NextResponse.json({ error: "Program not found" }, { status: 404 });
        }
        return NextResponse.json(JSON.parse(JSON.stringify(program)));
    } catch {
        return NextResponse.json({ error: "Failed to fetch program" }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const body = await request.json();
        const { id } = await params;
        const program = await Program.findByIdAndUpdate(id, body, { new: true }).lean();
        return NextResponse.json(JSON.parse(JSON.stringify(program)));
    } catch {
        return NextResponse.json({ error: "Failed to update program" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        await Program.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Failed to delete program" }, { status: 500 });
    }
}
