import { NextResponse } from "next/server";
import Car from "@/app/models/Car";
import fs from "fs";
import path from "path";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id?: string }> | { id?: string } }
) {

  const resolvedParams = await context.params;
  const { id } = resolvedParams;

  console.log("DELETE request received for car ID:", id);
  if (!id) {
    console.error("DELETE ERROR: Missing car ID", resolvedParams);
    return NextResponse.json({ message: "Missing car ID" }, { status: 400 });
  }

  try {
    const car = await Car.findById(id);
    if (!car) {
      return NextResponse.json({ message: "Car not found" }, { status: 404 });
    }

    if (car.image) {
      const imagePath = path.join(
        process.cwd(),
        "public",
        car.image.replace(/^\/+/, "")
      );
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await Car.findByIdAndDelete(id);
    return NextResponse.json({ message: "Car deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    return NextResponse.json({ message: "Server error while deleting car" }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  context: { params: Promise<{ id?: string }> | { id?: string } }
) {
  const resolvedParams = await context.params;
  const { id } = resolvedParams;

  console.log("GET request received for car ID:", id);
  if (!id) {
    console.error("GET ERROR: Missing car ID");
    return NextResponse.json({ message: "Missing car ID" }, { status: 400 });
  }

  try {
    const car = await Car.findById(id).lean();
    if (!car) {
      console.error("GET ERROR: Car not found for ID", id);
      return NextResponse.json({ message: "Car not found" }, { status: 404 });
    }

    console.log("GET SUCCESS: Car found for ID", id);
    return NextResponse.json(car);
  } catch (err) {
    console.error("GET ERROR:", err);
    return NextResponse.json(
      { message: "Server error while fetching car" },
      { status: 500 }
    );
  }
}