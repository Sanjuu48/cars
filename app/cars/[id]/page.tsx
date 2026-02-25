"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

type Plan = "day" | "week" | "month";

interface Car {
  _id: string;
  manufacturer: string;
  model: string;
  year: number;
  fuel: string;
  engine: string;
  image: string;
  pricePerDay: number;
  transmission: string;
  drive: string;
  kmPerLitre: number;
}

export default function CarPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params?.id === "string" ? params.id : null;

  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<Plan>("day");

  useEffect(() => {
    if (!id) return;

    const fetchCar = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/cars/${id}`);
        const data = await res.json();

        if (!res.ok) {
          console.error("API Error:", data.message);
          setCar(null);
        } else {
          setCar(data);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setCar(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  if (loading)
    return (
      <p className="text-center mt-20 text-gray-500 text-lg">
        Loading car details...
      </p>
    );

  if (!car)
    return (
      <p className="text-center mt-20 text-gray-500 text-lg">
        Car not found
      </p>
    );

  const price =
    plan === "day"
      ? car.pricePerDay
      : plan === "week"
      ? Math.round(car.pricePerDay * 7 * 0.9)
      : Math.round(car.pricePerDay * 30 * 0.75);

  return (
    <section className="mx-auto min-h-screen bg-gradient-to-r from-white via-blue-100 to-blue-400 px-6 sm:px-12">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <button
          onClick={() => {
            if (window.history.length > 1) router.back();
            else router.push("/cars");
          }}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium transition"
        >
          ← Back
        </button>

        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-gray-900">
          Rent the{" "}
          <span className="text-blue-600">
            {car.manufacturer} {car.model}
          </span>
        </h1>
        <p className="mt-4 max-w-2xl text-gray-600 text-base sm:text-lg">
          Flexible rental plans, no hidden fees, premium vehicles.
        </p>

        <div className="mt-10 bg-white/50 backdrop-blur-md rounded-2xl shadow-xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-10">
            {/* Car Image */}
            <div className="md:w-1/2">
              <div className="relative w-full h-72 sm:h-80 md:h-96 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden group">
                {car.image ? (
                  <Image
                    src={car.image}
                    alt={car.model}
                    width={520}
                    height={320}
                    className="object-contain transition-transform duration-500 transform group-hover:scale-105"
                  />
                ) : (
                  <p className="text-gray-400">No Image</p>
                )}
              </div>
            </div>

            {/* Car Specs & Plans */}
            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <Spec label="Year" value={car.year} />
                <Spec label="Fuel" value={car.fuel} />
                <Spec label="Engine" value={car.engine} />
                <Spec label="Transmission" value={car.transmission} />
                <Spec label="Drive" value={car.drive} />
                <Spec
                  label="Efficiency"
                  value={car.kmPerLitre > 0 ? `${car.kmPerLitre} km/L` : "Electric"}
                />
              </div>

              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-4">
                  Choose your plan
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <PlanCard
                    active={plan === "day"}
                    title="Daily"
                    subtitle="Short trips"
                    price={`$${car.pricePerDay}/day`}
                    onClick={() => setPlan("day")}
                  />
                  <PlanCard
                    active={plan === "week"}
                    title="Weekly"
                    subtitle="Save 10%"
                    price={`$${Math.round(car.pricePerDay * 7 * 0.9)}`}
                    onClick={() => setPlan("week")}
                  />
                  <PlanCard
                    active={plan === "month"}
                    title="Monthly"
                    subtitle="Save 25%"
                    price={`$${Math.round(car.pricePerDay * 30 * 0.75)}`}
                    onClick={() => setPlan("month")}
                  />
                </div>

                <div className="mt-6 flex items-center justify-between rounded-xl bg-blue-50 p-5">
                  <div>
                    <p className="text-sm text-gray-600">Total price</p>
                    <p className="text-3xl font-extrabold text-blue-600">
                      ${price}
                    </p>
                  </div>
                  <button
                    onClick={() => router.push(`/submission/${car._id}?plan=${plan}`)}
                    className="rounded-full bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700 hover:scale-105 shadow-lg"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const Spec = ({ label, value }: { label: string; value: any }) => (
  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-lg font-semibold text-gray-900">{value}</p>
  </div>
);

const PlanCard = ({
  title,
  subtitle,
  price,
  active,
  onClick,
}: {
  title: string;
  subtitle: string;
  price: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`rounded-xl border p-4 text-left transition transform duration-300 ${
      active
        ? "border-blue-600 bg-blue-50 scale-105 shadow-lg"
        : "border-gray-200 hover:border-blue-400 hover:shadow-md hover:scale-105"
    }`}
  >
    <p className="text-lg font-bold text-gray-900">{title}</p>
    <p className="text-sm text-gray-500">{subtitle}</p>
    <p className="mt-2 text-xl font-extrabold text-blue-600">{price}</p>
  </button>
);