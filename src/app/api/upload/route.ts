
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json(
                { error: "No file received." },
                { status: 400 }
            );
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = Date.now() + "-" + file.name.replaceAll(" ", "_");

        // Ensure upload directory exists
        const uploadDir = path.join(process.cwd(), "public/uploads");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filepath = path.join(uploadDir, filename);
        await writeFile(filepath, buffer);

        return NextResponse.json({
            message: "Success",
            url: `/uploads/${filename}`
        });
    } catch (error) {
        console.error("Upload failed:", error);
        return NextResponse.json(
            { error: "Upload failed." },
            { status: 500 }
        );
    }
}
