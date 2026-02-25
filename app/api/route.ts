import { NextRequest, NextResponse } from "next/server";
import handler from "./users";
import connectDB from "@/app/lib/db";

try {
  await connectDB();
} catch (err) {
  console.error("DB connect failed at module load:", err);
} 

export async function GET(req: NextRequest){
    const fu = await handler(req);
    console.log("Fetched users:", fu);
    return NextResponse.json(fu);
}


