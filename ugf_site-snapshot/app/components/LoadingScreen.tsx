"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export default function LoadingScreen({
  onLoadingComplete,
}: LoadingScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [logoOpacity, setLogoOpacity] = useState(1);

  useEffect(() => {
    const minDisplayTime = 800;

    // Start fading the logo immediately
    const fadeStart = Date.now();
    const fadeInterval = setInterval(() => {
      const elapsed = Date.now() - fadeStart;
      const progress = Math.min(elapsed / minDisplayTime, 1);
      const opacity = 1 - progress;
      setLogoOpacity(opacity);

      if (progress >= 1) {
        clearInterval(fadeInterval);
      }
    }, 16); // ~60fps

    // Create a promise that resolves after minimum time
    const minTimePromise = new Promise((resolve) => {
      setTimeout(resolve, minDisplayTime);
    });

    // Create a promise that resolves when page is loaded
    const pageLoadPromise = new Promise((resolve) => {
      if (document.readyState === "complete") {
        resolve(undefined);
      } else {
        const handleLoad = () => {
          resolve(undefined);
          window.removeEventListener("load", handleLoad);
        };
        window.addEventListener("load", handleLoad);
      }
    });

    // Wait for both conditions to be met
    Promise.all([minTimePromise, pageLoadPromise]).then(() => {
      setIsVisible(false);
      // Wait for fade out animation to complete before calling onLoadingComplete
      setTimeout(onLoadingComplete, 300);
    });

    // Cleanup interval on unmount
    return () => {
      clearInterval(fadeInterval);
    };
  }, [onLoadingComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-black flex items-center justify-center transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
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
