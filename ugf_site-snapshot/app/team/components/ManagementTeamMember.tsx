import { useState, useEffect } from "react";
import Image from "next/image";

interface ManagementTeamMemberProps {
  id: string;
  name: string;
  title: string;
  photo: string;
  bio: string;
}

export default function ManagementTeamMember({
  name,
  title,
  photo,
}: ManagementTeamMemberProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTapped, setIsTapped] = useState(false);

  // Check if we're on a mobile device
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check on initial load
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Handle touch events for mobile tap effect
  const handleTouchStart = () => {
    if (isMobile) {
      setIsTapped(true);
    }
  };

  const handleTouchEnd = () => {
    if (isMobile) {
      // Add a small delay before removing the tap effect
      setTimeout(() => {
        setIsTapped(false);
      }, 150);
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 ease-in-out transform md:hover:scale-105 cursor-pointer bg-gray-800 ${
        isTapped ? "scale-98 opacity-90" : ""
      }`}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <Image
        src={photo || "/placeholder.svg"}
        alt={name}
        width={400}
        height={400}
        className="w-full h-auto object-cover aspect-square"
      />
      <div
        className={`absolute inset-0 bg-gray-700 bg-opacity-80 backdrop-blur-sm transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        } ${isMobile ? "hidden" : ""}`}
      >
        <div className="p-4 h-full flex flex-col justify-center items-center text-center">
          <h3 className="text-white text-4xl font-semibold mb-2 scale-115">
            {name}
          </h3>
          <p className="text-gray-400 text-base mb-2 scale-115">{title}</p>
        </div>
      </div>
      <div
        className={`absolute bottom-0 left-0 right-0 p-4 bg-gray-800 transition-transform duration-300 ${
          isHovered && !isMobile ? "translate-y-full" : "translate-y-0"
        }`}
      >
        <h3 className="text-white text-xl font-semibold">{name}</h3>
      </div>
    </div>
  );
}
