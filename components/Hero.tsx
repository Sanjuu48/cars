"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

const decades = [
  { title: "1990s", value: "1990s", start: 1990, end: 1999 },
  { title: "2000s", value: "2000s", start: 2000, end: 2009 },
  { title: "2010s", value: "2010s", start: 2010, end: 2019 },
  { title: "2020s", value: "2020s", start: 2020, end: 2029 },
];

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

const Hero = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedManufacturer, setSelectedManufacturer] = useState("");
  const [selectedDecade, setSelectedDecade] = useState("");
  const [selectedFuel, setSelectedFuel] = useState("");

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await fetch("/api/cars");
        const data = await res.json();
        setCars(data);
      } catch (err) {
        console.error("Failed to fetch cars", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  const manufacturers = useMemo(
    () => [...new Set(cars.map((car) => car.manufacturer))],
    [cars]
  );
  const fuels = ["Gas", "Electricity"];

  const handleScroll = () => {
    const nextSection = document.getElementById("discover");
    nextSection?.scrollIntoView({ behavior: "smooth" });
  };

  const filteredCars = cars.filter((car) => {
    const matchesManufacturer = selectedManufacturer
      ? car.manufacturer === selectedManufacturer
      : true;

    const matchesFuel = selectedFuel ? car.fuel === selectedFuel : true;

    let matchesDecade = true;
    if (selectedDecade) {
      const decade = decades.find((d) => d.value === selectedDecade);
      if (decade) {
        matchesDecade =
          car.year >= decade.start && car.year <= decade.end;
      }
    }

    return matchesManufacturer && matchesFuel && matchesDecade;
  });

  return (
    <section className="relative mx-auto min-h-screen pt-24 bg-linear-to-b from-blue-100 via-white to-blue-300 px-6 sm:px-12">
      <div className="flex min-h-screen flex-col-reverse items-center gap-12 xl:flex-row max-w-7xl mx-auto">
        <div className="flex-1 pt-32 xl:pt-0 z-10">
          <h1 className="text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl lg:text-6xl 2xl:text-7xl">
            Find, Book & Rent Cars
            <span className="block bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Effortlessly & Instantly
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-gray-700">
            Discover premium vehicles at unbeatable prices. Seamless booking. Zero hassle. Total freedom.
          </p>

          <button
            type="button"
            onClick={handleScroll}
            className="mt-8 w-fit rounded-full bg-blue-600 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-xl"
          >
            Explore Cars →
          </button>


          <div className="mt-10 rounded-3xl bg-white/40 backdrop-blur-md p-6 shadow-xl border border-white/30">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Manufacturer</label>
                <select
                  className="rounded-lg border border-white/50 bg-white/60 px-4 py-3 text-sm backdrop-blur-sm shadow-inner"
                  value={selectedManufacturer}
                  onChange={(e) => setSelectedManufacturer(e.target.value)}
                >
                  <option value="">All</option>
                  {manufacturers.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Year</label>
                <select
                  className="rounded-lg border border-white/50 bg-white/60 px-4 py-3 text-sm backdrop-blur-sm shadow-inner"
                  value={selectedDecade}
                  onChange={(e) => setSelectedDecade(e.target.value)}
                >
                  <option value="">All</option>
                  {decades.map((d) => (
                    <option key={d.value} value={d.value}>{d.title}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Fuel</label>
                <select
                  className="rounded-lg border border-white/50 bg-white/60 px-4 py-3 text-sm backdrop-blur-sm shadow-inner"
                  value={selectedFuel}
                  onChange={(e) => setSelectedFuel(e.target.value)}
                >
                  <option value="">All</option>
                  {fuels.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full items-end justify-end xl:h-screen xl:flex-[1.5] relative">
          <Image
            src="/m3.png"
            alt="Hero Car"
            fill
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>
      </div>

      <div id="discover" className="mt-24 max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Discover Available Cars
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading ? (
            <p className="col-span-full text-center">Loading cars...</p>
          ) : filteredCars.length > 0 ? (
            filteredCars.map((car) => (
              <Link key={car._id} href={`/cars/${car._id}`}>
                <div className="relative rounded-3xl bg-white/40 backdrop-blur-md p-5 shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-2 cursor-pointer overflow-hidden group">
                  <div className="relative w-full h-40 mb-3">
                    <Image
                      src={car.image}
                      alt={`${car.manufacturer} ${car.model}`}
                      fill
                      className="object-contain rounded-lg"
                    />
                  </div>
                  <h3 className="font-bold text-gray-900">{car.manufacturer} {car.model}</h3>
                  <p className="text-blue-600 font-semibold mb-2">${car.pricePerDay} / day</p>
                  <div className="text-sm text-gray-700 flex justify-between mt-1">
                    <span>{car.kmPerLitre} km/l</span>
                    <span>{car.drive}</span>
                    <span>{car.transmission}</span>
                  </div>

                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-3xl">
                    <span className="text-white font-semibold text-lg">View Details →</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-600">
              No cars match your filters.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;