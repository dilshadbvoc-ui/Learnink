import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Enquiry, IntegrationConfig } from "@/lib/models";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    try {
        const enquiries = await Enquiry.find({}).sort({ createdAt: -1 }).lean();
        return NextResponse.json(JSON.parse(JSON.stringify(enquiries)));
    } catch {
        return NextResponse.json({ error: "Failed to fetch enquiries" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const data = await req.json();
        const enquiry = await Enquiry.create(data);

        // --- CRM Integration ---
        // Fetch configuration from database
        const crmConfig = await IntegrationConfig.findOne({ key: 'crm-integration' }).lean();

        if (crmConfig && crmConfig.enabled && crmConfig.crmWebhookUrl) {
            try {
                // Send data to CRM in the background
                await fetch(crmConfig.crmWebhookUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // Add secret token if configured
                        ...(crmConfig.crmAuthToken && { 'Authorization': `Bearer ${crmConfig.crmAuthToken}` })
                    },
                    body: JSON.stringify({
                        source: 'Learnink Website',
                        timestamp: new Date().toISOString(),
                        ...data, // includes name, email, phone, interest, message
                    }),
                });
            } catch (crmError) {
                // Log error but do not fail the request to the user
                console.error("Failed to forward enquiry to CRM:", crmError);
            }
        }
        // -----------------------

        return NextResponse.json(JSON.parse(JSON.stringify(enquiry)), { status: 201 });
    } catch {
        return NextResponse.json({ error: "Failed to submit enquiry" }, { status: 500 });
    }
}
