"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Rocket, ArrowUp, Trophy, Star } from "lucide-react";

interface PlaceSectionProps {
  testimonial: {
    quote: string;
    name: string;
    role: string;
    image?: string;
  };
}

export default function PlaceSection({ testimonial }: PlaceSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const newScrollY = window.scrollY;
          setScrollY(newScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  const description = [
    "• Land positions at top-tier investment banks and venture capital firms that set you on a fantastic career trajectory",
    "• Join a network of UGF alumni who have placed across a wide range of high-level jobs at prestigious companies",
    "• Receive comprehensive interview preparation and career guidance tailored to your goals",
    "• Benefit from our established relationships with industry-leading firms actively seeking UGF talent",
  ];

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900"
    >
      {/* Background with career theme */}
      <div className="absolute inset-0">
        <Image
          src="/backgrounds/buy-side.webp"
          alt="Career Success"
          fill
          className="object-cover object-center opacity-40"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-l from-black/90 via-black/70 to-transparent" />
      </div>

      {/* Floating success/career icons with consistent positioning */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-20 left-20 text-[#17A2FF]/20"
          style={{
            transition: "transform 0.1s ease-out",
          }}
        >
          <Rocket size={60} />
        </div>
        <div
          className="absolute top-1/3 right-20 text-[#B2E0FF]/15"
          style={{
            transition: "transform 0.1s ease-out",
          }}
        >
          <ArrowUp size={50} />
        </div>
        <div
          className="absolute bottom-1/4 left-1/4 text-[#004A7C]/20"
          style={{
            transition: "transform 0.1s ease-out",
          }}
        >
          <Trophy size={45} />
        </div>
      </div>

      {/* Content container */}
      <div className="relative h-screen flex items-center">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Main content with dynamic scaling */}
            <div
              className="space-y-8"
              style={{
                transition: "transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              {/* Icon */}
              <div>
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#17A2FF] to-[#004A7C] shadow-2xl">
                  <Rocket className="w-10 h-10 text-white" />
                </div>
              </div>

              {/* Title with subtle scaling */}
              <div className="space-y-4">
                <h2
                  className={`text-5xl md:text-6xl font-bold text-white transition-all duration-1000 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                >
                  PLACE
                </h2>
                <div
                  className={`w-24 h-1 bg-gradient-to-r from-[#17A2FF] to-[#B2E0FF] opacity-100 scale-x-100`}
                  style={{ transitionDelay: "700ms" }}
                />
              </div>

              {/* Description with staggered reveal */}
              <div className="space-y-4">
                {description.map((point, index) => (
                  <p
                    key={index}
                    className={`text-gray-300 leading-relaxed transition-all duration-700 ${
                      isVisible ? "opacity-100" : "opacity-0"
                    }`}
                    style={{
                      transitionDelay: `${900 + index * 120}ms`,
                    }}
                  >
                    {point}
                  </p>
                ))}
              </div>
            </div>

            {/* Right side - Testimonial */}
            <div
              className={`transition-all duration-1000 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-20"
              }`}
            >
              <div className="bg-gray-900/80 backdrop-blur-md p-8 border border-gray-700/50 shadow-2xl rounded-none">
                <div className="space-y-6">
                  <blockquote className="text-xl italic text-gray-200 leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>

                  <div className="flex items-center space-x-4">
                    {testimonial.image && (
                      <div className="relative h-16 w-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-[#17A2FF]/30">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-white text-lg">
                        {testimonial.name}
                      </p>
                      <p className="text-[#17A2FF] text-sm">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Career progress indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-2">
          {[1, 2, 3].map((step) => (
            <button
              key={step}
              onClick={() => {
                const sections = ["#learn", "#invest", "#place"];
                const targetSection = document.querySelector(
                  sections[step - 1]
                );
                if (targetSection) {
                  targetSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className={`w-3 h-3 rounded-full transition-all duration-500 cursor-pointer hover:scale-110 ${
                step === 3 ? "bg-[#17A2FF]" : "bg-gray-600 hover:bg-gray-500"
              }`}
              title={
                step === 1
                  ? "Learn Section"
                  : step === 2
                  ? "Invest Section"
                  : "Place Section"
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
