"use client";

import { useState, useEffect } from "react";

export default function AddCar() {
  const [form, setForm] = useState({
    manufacturer: "",
    model: "",
    year: "",
    fuel: "",
    engine: "",
    image: null as File | null,
    pricePerDay: "",
    transmission: "",
    drive: "",
    kmPerLitre: "",
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error" | "";
  }>({ text: "", type: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (e.target.type === "file") {
      const file = (e.target as HTMLInputElement).files?.[0] || null;
      setForm({ ...form, image: file });
      setPreview(file ? URL.createObjectURL(file) : null);
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.image) {
      return setMessage({ text: "Please upload a car image.", type: "error" });
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "image" && value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, value as string);
      }
    });

    try {
      const res = await fetch("/api/cars", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setMessage({ text: "Car added successfully!", type: "success" });

        setForm({
          manufacturer: "",
          model: "",
          year: "",
          fuel: "",
          engine: "",
          image: null,
          pricePerDay: "",
          transmission: "",
          drive: "",
          kmPerLitre: "",
        });

        setPreview(null);
      } else {
        setMessage({ text: "Failed to add car.", type: "error" });
      }
    } catch {
      setMessage({ text: "Unexpected error occurred.", type: "error" });
    }
  };

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ text: "", type: "" }), 3500);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24 
      bg-gradient-to-br from-[#0f172a] via-[#111827] to-black text-white">

      <div className="w-full max-w-5xl">

        {/* Title */}
        <h1 className="text-5xl font-bold text-center mb-14 
          bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Add New Vehicle
        </h1>

        <form
          onSubmit={handleSubmit}
          className="backdrop-blur-xl bg-white/5 border border-white/10 
          shadow-2xl rounded-3xl p-10 grid gap-8 transition-all"
        >
          <div className="grid sm:grid-cols-2 gap-6">
            <FloatingInput name="manufacturer" value={form.manufacturer} onChange={handleChange} label="Manufacturer" />
            <FloatingInput name="model" value={form.model} onChange={handleChange} label="Model" />
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <FloatingInput name="year" type="number" value={form.year} onChange={handleChange} label="Year" />
            <FloatingSelect
              name="fuel"
              value={form.fuel}
              onChange={handleChange}
              label="Fuel Type"
              options={["Gas", "Electric"]}
            />
          </div>

          <FloatingInput name="engine" value={form.engine} onChange={handleChange} label="Engine (e.g. 2.0L Turbo)" />

          <label className="relative flex flex-col items-center justify-center 
            border-2 border-dashed border-white/20 rounded-2xl p-10 text-center 
            cursor-pointer hover:border-blue-500/50 transition bg-white/5 backdrop-blur-xl">

            <span className="text-gray-300 font-medium mb-2">
              {preview ? "Change Vehicle Image" : "Upload Vehicle Image"}
            </span>

            <input
              type="file"
              name="image"
              accept="image/png, image/jpeg"
              onChange={handleChange}
              className="hidden"
              required
            />

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-6 w-48 h-32 object-contain rounded-xl shadow-lg border border-white/10"
              />
            )}
          </label>

          <div className="grid sm:grid-cols-3 gap-6">
            <FloatingInput
              name="pricePerDay"
              type="number"
              value={form.pricePerDay}
              onChange={handleChange}
              label="Price Per Day ($)"
            />

            <FloatingSelect
              name="transmission"
              value={form.transmission}
              onChange={handleChange}
              label="Transmission"
              options={["Automatic", "Manual", "CVT", "DCT"]}
            />

            <FloatingSelect
              name="drive"
              value={form.drive}
              onChange={handleChange}
              label="Drive Type"
              options={["FWD", "RWD", "AWD", "4WD"]}
            />
          </div>

          <FloatingInput
            name="kmPerLitre"
            type="number"
            value={form.kmPerLitre}
            onChange={handleChange}
            label="KM Per Litre"
          />

          <button
            type="submit"
            className="mt-6 py-4 rounded-2xl bg-gradient-to-r 
            from-blue-500 to-indigo-600 text-white font-semibold text-lg 
            shadow-xl hover:shadow-blue-500/20 hover:scale-[1.02] 
            transition-all duration-300"
          >
            Add Vehicle
          </button>
        </form>
      </div>
      {message.text && (
        <div
          className={`fixed top-6 right-6 z-[9999] px-6 py-4 rounded-xl text-white 
          shadow-2xl backdrop-blur-md transition-all duration-500
          ${message.type === "success"
            ? "bg-emerald-500/90"
            : "bg-red-500/90"}`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}

const FloatingInput = ({
  name,
  value,
  onChange,
  label,
  type = "text",
}: {
  name: string;
  value: string;
  onChange: any;
  label: string;
  type?: string;
}) => (
  <div className="relative w-full">
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required
      placeholder=" "
      className="peer w-full p-4 pt-6 rounded-xl 
      bg-white/5 border border-white/10 text-white
      focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40
      outline-none transition"
    />
    <label className="absolute left-4 top-4 text-gray-400 text-sm transition-all 
      peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
      peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-400">
      {label}
    </label>
  </div>
);

const FloatingSelect = ({
  name,
  value,
  onChange,
  label,
  options,
}: {
  name: string;
  value: string;
  onChange: any;
  label: string;
  options: string[];
}) => (
  <div className="relative w-full">
    <select
      name={name}
      value={value}
      onChange={onChange}
      required
      className="peer w-full p-4 pt-6 rounded-xl 
      bg-white/5 border border-white/10 text-white
      focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40
      outline-none transition"
    >
      <option value="" disabled hidden></option>
      {options.map((opt) => (
        <option key={opt} value={opt} className="bg-[#111827]">
          {opt}
        </option>
      ))}
    </select>

    <label className="absolute left-4 top-4 text-gray-400 text-sm transition-all 
      peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-400">
      {label}
    </label>
  </div>
);