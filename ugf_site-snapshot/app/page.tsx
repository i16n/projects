"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import LogoCarousel from "@/app/components/LogoCarousel";
import { useLoading } from "@/app/contexts/LoadingContext";
import {
  ChartBarIcon,
  GlobeAltIcon,
  UserGroupIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

export default function HomePage() {
  const { showLoading, hideLoading } = useLoading();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isMissionVisible, setIsMissionVisible] = useState(false);
  const missionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Show global loading immediately
    showLoading();

    // Set up video loading detection
    const video = document.querySelector("video");

    const handleVideoLoaded = () => {
      hideLoading();
      setIsPageLoading(false);
    };

    if (video) {
      // If video is already loaded
      if (video.readyState >= 3) {
        handleVideoLoaded();
      } else {
        video.addEventListener("canplaythrough", handleVideoLoaded);
        video.addEventListener("loadeddata", handleVideoLoaded);
      }

      return () => {
        video.removeEventListener("canplaythrough", handleVideoLoaded);
        video.removeEventListener("loadeddata", handleVideoLoaded);
      };
    } else {
      // Fallback: hide loading after a short delay if no video found
      const timer = setTimeout(() => {
        handleVideoLoaded();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showLoading, hideLoading]);

  // Intersection Observer for mission statement animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsMissionVisible(true);
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: "-50px 0px", // Trigger slightly before element is fully visible
      }
    );

    if (missionRef.current) {
      observer.observe(missionRef.current);
    }

    return () => {
      if (missionRef.current) {
        observer.unobserve(missionRef.current);
      }
    };
  }, []);

  return (
    <>
      <main
        className={`text-white transition-opacity duration-500 ${
          isPageLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        <Navbar />
        {/* Hero Section */}
        <div className="relative w-full h-screen">
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="object-cover w-full h-full"
              preload="auto"
              poster="/airplane.webp"
            >
              <source
                src=" https://7sq3ubtgkasnkrzh.public.blob.vercel-storage.com/ShortUGF.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
          <div className="relative z-10 text-center px-4 w-full h-full flex items-center justify-center">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-oswald mb-8 bg-clip-text text-transparent bg-gradient-to-r from-[#17A2FF] to-white leading-tight pb-4 noselect">
              Change Your Trajectory
            </h1>
          </div>
        </div>

        <div className="animated-gradient-bg">
          {/* Mission Statement */}
          <div className="min-h-screen w-full flex items-center justify-center">
            <div
              ref={missionRef}
              className={`p-8 max-w-4xl mx-auto transition-all duration-1000 ease-out ${
                isMissionVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-32"
              }`}
            >
              <h2 className="text-4xl md:text-4xl text-gray-300 leading-relaxed noselect">
                Whether you are a courageous entrepreneur building the next
                great company or a student at the beginning of your career, we
                want to help you achieve greater heights. 🚀
              </h2>
            </div>
          </div>
        </div>

        {/* Fund Information */}
        <div className="py-20 w-full border-b border-white relative">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
            style={{ backgroundImage: "url(/community/bridgewalk.webp)" }}
          ></div>
          <div className="relative z-10">
            <p className="text-4xl lg:text-5xl font-mono font-bold text-center mb-12 text-white noselect">
              Our Investment Strategy
            </p>
            <div className="w-full px-4 p-12 rounded-xl min-h-[80px] flex flex-col">
              <div className="w-full px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-6xl mx-auto">
                  <div className="p-8 h-[480px] w-full max-w-sm mx-auto flex flex-col justify-center animated-gradient-bg opacity-80 border-2 border-transparent hover:border-white transition-colors duration-300 rounded-lg noselect">
                    <div className="flex flex-col items-center gap-4 mb-6">
                      <GlobeAltIcon className="h-10 w-10" />
                      <h3 className="text-2xl md:text-4xl font-bold text-white text-center">
                        Multi-Sector
                      </h3>
                    </div>
                    <p className="text-gray-300 text-xl text-center mt-6">
                      From Consumer Products to Consumer Tech and Semiconductors
                      to Enterprise Software, we invest across a broad range of
                      sectors.
                    </p>
                  </div>
                  <div className="p-8 h-[480px] w-full max-w-sm mx-auto flex flex-col justify-center animated-gradient-bg opacity-80 border-2 border-transparent hover:border-white transition-colors duration-300 rounded-lg noselect">
                    <div className="flex flex-col items-center gap-4 mb-6">
                      <ChartBarIcon className="h-10 w-10" />
                      <h3 className="text-2xl md:text-4xl font-bold text-white text-center">
                        Growth Focused
                      </h3>
                    </div>
                    <p className="text-gray-300 text-xl text-center mt-6">
                      We focus on companies with established business models
                      looking for growth capital, be it a Series A or pre-IPO
                      round.
                    </p>
                  </div>
                  <div className="p-8 h-[480px] w-full max-w-sm mx-auto flex flex-col justify-center animated-gradient-bg opacity-80 border-2 border-transparent hover:border-white transition-colors duration-300 rounded-lg noselect">
                    <div className="flex flex-col items-center gap-4 mb-6">
                      <UserGroupIcon className="h-10 w-10" />
                      <h3 className="text-2xl md:text-4xl font-bold text-white text-center">
                        Complementary Partner
                      </h3>
                    </div>
                    <p className="text-gray-300 text-xl text-center mt-6">
                      We combine our capital with other smart money and find
                      complementary ways of adding value to our portfolio
                      companies.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logo Carousel */}
        <div className="py-16 bg-black w-full">
          <LogoCarousel />
        </div>

        {/* Portfolio Button Section */}
        <div className="py-20 bg-black w-full flex justify-center">
          <Link
            href="/portfolio"
            className="group relative cursor-pointer px-8 py-4 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-4 text-4xl font-bold text-white">
              Check Out Our Portfolio
              <ArrowRightIcon className="h-8 w-8 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 bg-blue-400/30 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
            <div className="absolute inset-0 bg-blue-600/10"></div>
          </Link>
        </div>

        {/* Offices Section */}
        <div className="py-20 w-full border-t border-white">
          <div className="w-full">
            <h2 className="text-6xl font-montserrat text-center mb-12 text-white px-4 noselect">
              Our Offices
            </h2>
            <div className="flex flex-col gap-1 w-full">
              <div className="relative aspect-[4/3] rounded-none overflow-hidden w-full max-h-[36rem] group">
                <Image
                  src="/officeImages/atl.webp"
                  alt="Atlanta Office"
                  fill
                  className="object-cover transition-all duration-300 group-hover:scale-105"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-start px-8">
                  <div>
                    <h3 className="text-4xl font-mono font-bold text-white drop-shadow-lg">
                      Atlanta
                    </h3>
                    <p className="text-white/0 group-hover:text-white/90 transition-all duration-300 text-lg mt-2 font-mono">
                      57 Forsyth St NW #222
                      <br />
                      Atlanta, GA 30303
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative aspect-[4/3] rounded-none overflow-hidden w-full max-h-[36rem] group">
                <Image
                  src="/officeImages/slc.webp"
                  alt="Salt Lake City Office"
                  fill
                  className="object-cover transition-all duration-300 group-hover:scale-105"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-start px-8">
                  <div>
                    <h3 className="text-4xl font-mono font-bold text-white drop-shadow-lg">
                      Salt Lake City
                    </h3>
                    <p className="text-white/0 group-hover:text-white/90 transition-all duration-300 text-lg mt-2 font-mono">
                      299 S Main St Ste #357
                      <br />
                      Salt Lake City, UT 84111
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative aspect-[4/3] rounded-none overflow-hidden w-full max-h-[36rem] group">
                <Image
                  src="/officeImages/sd.webp"
                  alt="San Diego Office"
                  fill
                  className="object-cover transition-all duration-300 group-hover:scale-105"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-start px-8">
                  <div>
                    <h3 className="text-4xl font-mono font-bold text-white drop-shadow-lg">
                      San Diego
                    </h3>
                    <p className="text-white/0 group-hover:text-white/90 transition-all duration-300 text-lg mt-2 font-mono">
                      1094 Cudahy Pl Ste #210
                      <br />
                      San Diego, CA 92110
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
