import { NextRequest, NextResponse } from "next/server";
import handler from "./users";

export async function GET(req: NextRequest){
    const fu = await handler(req);
    console.log("Fetched users:", fu);
    return NextResponse.json(fu);
}