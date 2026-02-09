import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    console.log("📩 API HIT");

    const data = await req.json();
    console.log("📦 DATA RECEIVED:", data);

    const { car, plan, name, email, phone } = data;

    if (!car || !plan || !name || !email || !phone) {
      throw new Error("Missing required fields");
    }

    console.log("🔐 ENV CHECK:", {
      EMAIL_USER: process.env.EMAIL_USER,
      EMAIL_PASS_EXISTS: !!process.env.EMAIL_PASS,
      EMAIL_RECEIVER: process.env.EMAIL_RECEIVER,
    });

    const price =
      plan === "day"
        ? car.pricePerDay
        : plan === "week"
        ? Math.round(car.pricePerDay * 7 * 0.9)
        : Math.round(car.pricePerDay * 30 * 0.75);

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log("📨 SENDING EMAIL...");

    await transporter.sendMail({
      from: `"Car Rental Booking" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_RECEIVER,
      subject: `New Booking: ${car.manufacturer} ${car.model}`,
      html: `<p>Test Email</p>`,
    });

    console.log("✅ EMAIL SENT");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("❌ API ERROR:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
