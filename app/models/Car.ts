import mongoose, { Schema } from "mongoose";

const CarSchema = new Schema(
  {
    manufacturer: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    fuel: { type: String, enum: ["Gas", "Electricity"], required: true },
    engine: { type: String, required: true },
    image: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    transmission: { type: String, enum: ["Manual", "Automatic"], required: true },
    drive: { type: String, enum: ["FWD", "RWD", "AWD"], required: true },
    kmPerLitre: { type: Number, required: true },
  },
  { timestamps: true }
);

const Car = mongoose.models.Car || mongoose.model("Car", CarSchema);
export default Car;