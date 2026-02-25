import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();
  const email = (await cookieStore).get("user")?.value;

  if (!email) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({ user: { email } });
}