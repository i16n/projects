import { useState, useEffect } from "react";
import Image from "next/image";
import { UserCircle } from "lucide-react";

interface TeamMemberProps {
  id: string;
  name: string;
  photo: string;
  bio: string;
  title: string;
  school: string;
  degree: string;
  office?: string;
  onClick?: () => void;
  allTeamMembers?: TeamMemberProps[];
}

export default function TeamMember({
  name,
  photo,
  title,
  onClick = () => {},
  allTeamMembers = [],
}: TeamMemberProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isTapped, setIsTapped] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  // Check if we're on a mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is the standard md breakpoint in Tailwind
    };

    // Check on initial load
    checkMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle touch events for mobile tap effect
  const handleTouchStart = () => {
    setIsTapped(true);
  };

  const handleTouchEnd = () => {
    setIsTapped(false);
  };

  // Function to get display name
  const getDisplayName = () => {
    const firstName = name.split(" ")[0];
    const lastName = name.split(" ")[1] || "";

    // Check if there are other team members with the same first name
    const hasDuplicateFirstName = allTeamMembers.some(
      (member) =>
        member.name.split(" ")[0] === firstName && member.name !== name
    );

    if (hasDuplicateFirstName && lastName) {
      return `${firstName} ${lastName[0]}.`;
    }
    return firstName;
  };

  return (
    <div className="relative overflow-hidden shadow-lg bg-gray-800">
      {/* Photo area with hover effects */}
      <div
        className={`relative transition-all duration-300 ease-in-out transform md:hover:scale-105 cursor-pointer ${
          isTapped ? "scale-98 opacity-90" : ""
        }`}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={onClick}
      >
        <div className="relative aspect-square">
          {isImageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
              {" "}
              <UserCircle className="w-24 h-24 text-gray-400" />
            </div>
          )}
          <Image
            src={photo || "/placeholder.svg"}
            alt={name}
            width={400}
            height={400}
            className="w-full sm:text-sm h-auto object-cover aspect-square"
            onLoad={() => setIsImageLoading(false)}
          />
        </div>

        <div
          className={`absolute inset-0 bg-gray-600 bg-opacity-80 backdrop-blur-sm transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          } ${isMobile ? "hidden" : ""}`}
        >
          <div className="p-4 h-full flex flex-col justify-end items-center text-center">
            <h3 className="text-[#B2E0FF] text-4xl md:text-4xl font-semibold mb-2 scale-115">
              {name}
            </h3>
            <p className="text-gray-400 text-sm md:text-base mb-2 scale-115">
              {title}
            </p>
          </div>
        </div>
      </div>

      {/* Name display below photo - separate from hover effects */}
      <div className="bg-black py-2 px-4">
        <h3
          className={`text-white text-sm sm:text-base md:text-xl font-semibold transition-opacity duration-300 ${
            isHovered ? "opacity-0" : "opacity-100"
          }`}
        >
          {getDisplayName()}
        </h3>
        <div className="w-full h-px bg-white mt-2"></div>
      </div>
    </div>
  );
}
