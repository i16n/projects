"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/app/components/button";

interface HeroSectionProps {
  city: string;
  image?: string;
  teamRegDeadline: Date;
  registrationForm: string;
}

export default function HeroSection({
  city,
  image,
  teamRegDeadline,
  registrationForm,
}: HeroSectionProps) {
  const heroImage = image || "/placeholder.svg";
  const title = city + " Venture Capital Case Competition";

  // Check if team registration deadline has passed
  const now = new Date();
  const deadlineDate = new Date(teamRegDeadline);
  const isRegistrationOpen = deadlineDate > now;

  return (
    <div className="relative w-full h-[60vh]">
      <Image
        src={heroImage}
        alt={`${city} Landscape`}
        fill
        className="object-cover"
        priority
        unoptimized
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-8">
        <h1 className="text-5xl md:text-7xl font-bold text-white text-center">
          {title}
        </h1>
        {isRegistrationOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Button
              className="text-2xl font-bold bg-[#17A2FF] hover:bg-white hover:text-black hover:scale-105 transition-transform px-8 py-4"
              asChild
            >
              <Link href={registrationForm}>Register Now</Link>
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
