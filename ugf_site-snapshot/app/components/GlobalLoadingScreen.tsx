"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useLoading } from "@/app/contexts/LoadingContext";

export default function GlobalLoadingScreen() {
  const { isLoading } = useLoading();
  const [isVisible, setIsVisible] = useState(false);
  const [logoOpacity, setLogoOpacity] = useState(1);
  const [pulseDirection, setPulseDirection] = useState<"in" | "out">("out");

  useEffect(() => {
    if (isLoading) {
      setIsVisible(true);
      setLogoOpacity(1);
      setPulseDirection("out");
    } else {
      // Start fade out animation
      const fadeInterval = setInterval(() => {
        setLogoOpacity((prev) => {
          const newOpacity = prev - 0.05;
          if (newOpacity <= 0) {
            clearInterval(fadeInterval);
            setIsVisible(false);
            return 0;
          }
          return newOpacity;
        });
      }, 16); // ~60fps

      return () => clearInterval(fadeInterval);
    }
  }, [isLoading]);

  // Pulse animation effect
  useEffect(() => {
    if (!isVisible || !isLoading) return;

    const pulseInterval = setInterval(() => {
      setLogoOpacity((prev) => {
        if (pulseDirection === "out") {
          const newOpacity = prev - 0.03;
          if (newOpacity <= 0.3) {
            setPulseDirection("in");
            return 0.3;
          }
          return newOpacity;
        } else {
          const newOpacity = prev + 0.03;
          if (newOpacity >= 1) {
            setPulseDirection("out");
            return 1;
          }
          return newOpacity;
        }
      });
    }, 30); // Faster pulse for more noticeable effect

    return () => clearInterval(pulseInterval);
  }, [isVisible, isLoading, pulseDirection]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center transition-opacity duration-300">
      <div className="flex flex-col items-center">
        <div
          className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 relative"
          style={{ opacity: logoOpacity }}
        >
          <Image
            src="/logo.svg"
            alt="UGF Logo"
            fill
            className="object-contain"
            priority
            unoptimized
          />
        </div>
      </div>
    </div>
  );
}
