import { NextResponse } from "next/server";
import { IntegrationConfig } from "@/lib/models";
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

        // Find existing config or create default
        let config = await IntegrationConfig.findOne({ key: 'crm-integration' }).lean();

        if (!config) {
            config = await IntegrationConfig.create({});
            config = config.toObject();
        }

        return NextResponse.json(config);
    } catch {
        return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await dbConnect();
        const body = await req.json();

        const config = await IntegrationConfig.findOneAndUpdate(
            { key: 'crm-integration' },
            {
                crmWebhookUrl: body.crmWebhookUrl,
                crmAuthToken: body.crmAuthToken,
                enabled: body.enabled
            },
            { new: true, upsert: true }
        ).lean();

        return NextResponse.json(config);
    } catch {
        return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
    }
}
