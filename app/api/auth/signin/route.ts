import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/app/lib/db"
import User from "@/app/models/User";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  await connectDB();
  try {
    const { email, password } = await req.json();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    (await cookies()).set("user", user.email, {
      httpOnly: true,
      path: "/",
    });

    return NextResponse.json(
      { message: "Signin successful" },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}