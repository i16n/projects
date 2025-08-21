"use client";

import { MapPin } from "lucide-react";
import Link from "next/link";
import { Button } from "@/app/components/button";

interface Office {
  city: string;
  address: string[];
  image: string;
}

export default function OfficesSection() {
  const offices: Office[] = [
    {
      city: "SAN DIEGO",
      address: ["1094 Cudahy Place", "#210", "San Diego, CA", "92110"],
      image: "/officeImages/sd.webp",
    },
    {
      city: "SALT LAKE CITY",
      address: ["299 S. Main St", "#357", "Salt Lake City, UT", "84111"],
      image: "/officeImages/slc.webp",
    },

    {
      city: "ATLANTA",
      address: ["57 Forsyth St NW", "#222", "Atlanta, GA", "30303"],
      image: "/officeImages/atl.webp",
    },
  ];

  // Map city names to their correct VCCC page slugs
  const cityToSlug: { [key: string]: string } = {
    "SALT LAKE CITY": "slc",
    "SAN DIEGO": "sandiego",
    ATLANTA: "atlanta",
  };

  return (
    <section id="offices" className="text-white py-8 relative z-10">
      <div className="container text-center space-y-3 mb-8">
        <h1 className="text-4xl font-bold mb-20 tracking-tighter">
          OUR OFFICES
        </h1>
      </div>

      <div className="container grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-20 mb-20">
        {offices.map((office, index) => (
          <div
            key={index}
            className="bg-gray-800/50 overflow-hidden shadow-lg hover:shadow-xl transition-all hover:translate-y-[-4px] group h-full flex flex-col"
          >
            <div
              className="h-72 bg-cover bg-center"
              style={{ backgroundImage: `url(${office.image})` }}
            >
              <div className="w-full h-full flex items-center justify-center bg-black/40 group-hover:bg-black/30 transition-all">
                <h3 className="text-3xl font-bold text-white drop-shadow-lg">
                  {office.city}
                </h3>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-start mb-5">
                <MapPin className="w-5 h-5 text-primary mt-1 mr-3 flex-shrink-0" />
                <div>
                  {office.address.map((line, i) => (
                    <p key={i} className="text-gray-300">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
              <div className="mt-auto">
                <Button
                  asChild
                  variant="secondary"
                  className="w-full group text-[#17A2FF] hover:bg-[#17A2FF] hover:text-white transition-colors"
                  size="lg"
                >
                  <Link
                    href={`/vccc/${
                      cityToSlug[office.city.trim().toUpperCase()] || ""
                    }`}
                    className="flex items-center justify-center"
                  >
                    {" "}
                    {office.city
                      .split(" ")
                      .map(
                        (word) =>
                          word.charAt(0).toUpperCase() +
                          word.slice(1).toLowerCase()
                      )
                      .join(" ")}{" "}
                    VC Competition
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
