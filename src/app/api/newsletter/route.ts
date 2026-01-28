import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Subscriber } from "@/lib/models";

export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const { email } = await req.json();

        // Basic email validation
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json(
                { error: "Please provide a valid email address" },
                { status: 400 }
            );
        }

        // Check if already subscribed
        const existing = await Subscriber.findOne({ email: email.toLowerCase() });
        if (existing) {
            if (existing.status === 'unsubscribed') {
                // Reactivate subscription
                existing.status = 'active';
                await existing.save();
                return NextResponse.json({ message: "Welcome back! You've been resubscribed." });
            }
            return NextResponse.json(
                { error: "This email is already subscribed" },
                { status: 409 }
            );
        }

        // Create new subscriber
        await Subscriber.create({ email: email.toLowerCase() });
        return NextResponse.json(
            { message: "Thank you for subscribing!" },
            { status: 201 }
        );
    } catch {
        return NextResponse.json(
            { error: "Failed to subscribe. Please try again later." },
            { status: 500 }
        );
    }
}
