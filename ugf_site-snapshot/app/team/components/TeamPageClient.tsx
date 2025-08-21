"use client";

import { useState, useRef } from "react";
import TeamGrid from "./TeamGrid";
import AlumniSection from "./AlumniSection";

interface TeamPageClientProps {
  activeMembers: any[];
  titles: string[];
}

export default function TeamPageClient({
  activeMembers,
  titles,
}: TeamPageClientProps) {
  const [showAlumni, setShowAlumni] = useState(false);
  const [alumniMembers, setAlumniMembers] = useState<any[] | null>(null);
  const [alumniLoading, setAlumniLoading] = useState(false);
  const alumniSectionRef = useRef<HTMLDivElement>(null);

  const handleAlumniClick = async () => {
    setShowAlumni(true);
    if (!alumniMembers) {
      setAlumniLoading(true);
      try {
        const res = await fetch("/api/alumni");
        const data = await res.json();
        setAlumniMembers(data);
      } catch (e) {
        setAlumniMembers([]);
      } finally {
        setAlumniLoading(false);
      }
    }
    // Scroll to alumni section with offset to account for sticky header
    setTimeout(() => {
      if (alumniSectionRef.current) {
        const elementPosition =
          alumniSectionRef.current.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - 100; // 80px for header + 20px padding
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }, 100);
  };

  return (
    <>
      <TeamGrid
        teamMembers={activeMembers}
        titles={titles}
        onAlumniClick={handleAlumniClick}
      />
      {/* Alumni Section with ref */}
      <div ref={alumniSectionRef}>
        <AlumniSection
          alumni={alumniMembers || []}
          isVisible={showAlumni}
          loading={alumniLoading}
        />
      </div>
    </>
  );
}
