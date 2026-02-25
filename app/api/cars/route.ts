import { NextResponse } from "next/server";
import Car from "@/app/models/Car";
import fs from "fs";
import connectDB from "@/app/lib/db"
import path from "path";

export async function GET() {
  await connectDB();
  try {
    const cars = await Car.find().sort({ createdAt: -1 });
    return NextResponse.json(cars);
  } catch (error) {
    console.error("Fetch cars error:", error);
    return NextResponse.json(
      { message: "Failed to fetch cars" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {

  try {
    const formData = await req.formData();

    const file = formData.get("image") as File;
    if (!file) {
      return NextResponse.json(
        { message: "No image uploaded" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public/uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, buffer);

    const car = await Car.create({
      manufacturer: formData.get("manufacturer"),
      model: formData.get("model"),
      year: Number(formData.get("year")),
      fuel: formData.get("fuel"),
      engine: formData.get("engine"),
      pricePerDay: Number(formData.get("pricePerDay")),
      transmission: formData.get("transmission"),
      drive: formData.get("drive"),
      kmPerLitre: Number(formData.get("kmPerLitre")),
      image: `/uploads/${fileName}`,
    });

    return NextResponse.json(car, { status: 201 });

  } catch (error) {
    console.error("Car creation error:", error);
    return NextResponse.json(
      { message: "Failed to add car" },
      { status: 500 }
    );
  }
}