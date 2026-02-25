import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY is missing");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const messages = body?.messages;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    const completion = await openai.chat.completions.create({
      model: "llama-3.1-8b-instant", 
      messages: [
        {
          role: "system",
          content:
            "You are CarHub's AI assistant. Help users with cars, bookings, and filters in a friendly professional way.",
        },
        ...messages,
      ],
      temperature: 0.7,
    });

    const reply = completion.choices?.[0]?.message?.content;

    if (!reply) {
      throw new Error("No reply from model");
    }

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error(" CHAT API ERROR:", error);

    return NextResponse.json(
      {
        error:
          error?.response?.data ||
          error?.message ||
          "Something went wrong",
      },
      { status: 500 }
    );
  }
}