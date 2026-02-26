import { NextResponse } from "next/server";
import Car from "@/app/models/Car";
import connectDB from "@/app/lib/db";
import cloudinary from "@/app/lib/cloudinary";

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
  await connectDB(); 

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
    
    const uploadResult: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "cars" }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(buffer);
    });

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
      image: uploadResult.secure_url,
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