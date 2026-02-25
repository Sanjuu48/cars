import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    console.log(" sendBookingEmail API HIT");
    const contentType = req.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      return NextResponse.json(
        { error: "Content-Type must be application/json" },
        { status: 400 }
      );
    }

    const body = await req.json();
    console.log(" BODY:", body);

    const { car, plan, name, email, phone } = body;
    if (!car || !plan || !name || !email || !phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (typeof car.pricePerDay !== "number") {
      return NextResponse.json(
        { error: "Invalid car price" },
        { status: 400 }
      );
    }
    if (
      !process.env.EMAIL_USER ||
      !process.env.EMAIL_PASS ||
      !process.env.EMAIL_RECEIVER
    ) {
      console.error("Missing email environment variables");
      return NextResponse.json(
        { error: "Email configuration missing" },
        { status: 500 }
      );
    }
    const price =
      plan === "day"
        ? car.pricePerDay
        : plan === "week"
        ? Math.round(car.pricePerDay * 7 * 0.9)
        : Math.round(car.pricePerDay * 30 * 0.75);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log("Sending email...");

    await transporter.sendMail({
      from: `"Car Rental Booking" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_RECEIVER,
      replyTo: email,
      subject: `New Booking: ${car.manufacturer} ${car.model}`,
      html: `
        <h2>New Booking Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Car:</strong> ${car.manufacturer} ${car.model}</p>
        <p><strong>Plan:</strong> ${plan}</p>
        <p><strong>Total Price:</strong> $${price}</p>
      `,
    });

    console.log("Email sent successfully");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(" sendBookingEmail ERROR:", error);
    console.error("STACK:", error?.stack);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
