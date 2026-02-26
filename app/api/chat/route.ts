import OpenAI from "openai";
import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import Car from "@/app/models/Car";

export async function POST(req: Request) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    await connectDB();

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400 }
      );
    }

    const cars = await Car.find({}).limit(20).lean();

    const formattedInventory = cars
      .map((car: any, index: number) => {
        return `
Car ${index + 1}:
Manufacturer: ${car.manufacturer}
Model: ${car.model}
Year: ${car.year}
Fuel: ${car.fuel}
Engine: ${car.engine}
Transmission: ${car.transmission}
Drive: ${car.drive}
Mileage: ${car.kmPerLitre} km/L
Price Per Day: $${car.pricePerDay}
        `;
      })
      .join("\n");

    const openai = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    const completion = await openai.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0.3, 
      messages: [
        {
          role: "system",
          content: `
You are CarHub's AI assistant.

You must only recommend cars from the provided inventory.
Do not invent vehicles.
If no match is found, clearly say no matching car is available.

Always greet the user warmly and remain professional.

Available Inventory:
${formattedInventory}
          `,
        },
        ...messages,
      ],
    });

    const reply = completion.choices?.[0]?.message?.content;

    if (!reply) {
      throw new Error("No reply from model");
    }

    return NextResponse.json({ reply });

  } catch (error: any) {
    console.error("CHAT API ERROR:", error);

    return NextResponse.json(
      {
        error: error?.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}