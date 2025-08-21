"use client";

import { useRef, useEffect, useState } from "react";
import { Linkedin, Search, ArrowUp } from "lucide-react";
import AlumniModal from "./AlumniModal";
import { Toaster, toast } from "react-hot-toast";

interface AlumniMember {
  id: string;
  name: string;
  school: string;
  degree: string;
  firstJob?: string;
  LinkedIn?: string;
}

interface AlumniSectionProps {
  alumni: AlumniMember[];
  isVisible: boolean; // Control visibility from parent
  loading?: boolean;
}

export default function AlumniSection({
  alumni,
  isVisible,
  loading = false,
}: AlumniSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAlumni, setSelectedAlumni] = useState<AlumniMember | null>(
    null
  );
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile devices
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

  // Scroll into view when isVisible changes to true
  useEffect(() => {
    if (isVisible && sectionRef.current) {
      const elementPosition = sectionRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - 100; // 80px for header + 20px padding

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }, [isVisible]);

  // Filter alumni based on search query
  const filteredAlumni = alumni.filter((alumnus) => {
    if (!searchQuery) return true;

    const searchLower = searchQuery.toLowerCase();
    return (alumnus.name?.toLowerCase() || "").includes(searchLower);
  });

  // Handle alumni click - open modal on mobile
  const handleAlumniClick = (alumnus: AlumniMember) => {
    if (isMobile) {
      setSelectedAlumni(alumnus);
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedAlumni(null);
  };

  return (
    <div ref={sectionRef} className="mt-16 pt-8" id="alumni-section">
      <div>
        <Toaster />
      </div>
      {isVisible && (
        <div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex items-center">
              <h2 className="text-3xl font-bold text-white">Alumni Network</h2>
            </div>

            {/* Alumni search bar */}
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key == "Enter" && searchQuery == "Samuel Brown") {
                    toast("Samuel Brown ist die beste Person");
                  }
                  if (e.key == "Enter" && searchQuery == "Isaac Huntsman") {
                    toast("This website created by me, Isaac Huntsman :)");
                  }
                }}
                className="w-full pl-10 pr-4 py-2 bg-black border border-white text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#17A2FF] focus:border-transparent"
              />
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-400">
              Loading alumni...
            </div>
          ) : (
            <div className="bg-gray-800 shadow-lg overflow-hidden">
              {/* Table header - responsive */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-gray-700 font-medium text-white">
                <div>Name</div>
                <div className="hidden md:block">Major</div>
                <div>School</div>
                <div className="hidden md:block">First Post-Grad Job</div>
                <div className="hidden md:block">LinkedIn</div>
              </div>

              {/* Table rows - responsive */}
              <div className="divide-y divide-gray-700">
                {filteredAlumni.length > 0 ? (
                  filteredAlumni.map((alumnus) => (
                    <div
                      key={alumnus.id}
                      className={`grid grid-cols-2 md:grid-cols-5 gap-4 p-4 hover:bg-gray-700 transition-all ${
                        isMobile ? "cursor-pointer" : ""
                      }`}
                      onClick={() => handleAlumniClick(alumnus)}
                    >
                      <div className="text-white font-medium">
                        {alumnus.name}
                      </div>
                      <div className="hidden md:block text-gray-300">
                        {alumnus.degree || "-"}
                      </div>
                      <div className="text-gray-300">
                        {alumnus.school || "-"}
                      </div>
                      <div className="hidden md:block text-gray-300">
                        {alumnus.firstJob || "-"}
                      </div>
                      <div className="hidden md:block text-gray-300">
                        {alumnus.LinkedIn ? (
                          <a
                            href={alumnus.LinkedIn}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#17A2FF] hover:text-[#B2E0FF] flex items-center"
                          >
                            <Linkedin className="h-4 w-4" />
                          </a>
                        ) : (
                          <span className="text-gray-600">
                            <Linkedin className="h-4 w-4" />
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-400">
                    No alumni found matching your search.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Jump to top of alumni section button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => {
                if (sectionRef.current) {
                  const elementPosition =
                    sectionRef.current.getBoundingClientRect().top;
                  const offsetPosition = elementPosition + window.scrollY - 100; // 80px for header + 20px padding

                  window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth",
                  });
                }
              }}
              className={`px-4 py-2 bg-gray-700 text-gray-300 hover:bg-gray-600 text-sm font-medium transition-all flex items-center`}
            >
              <ArrowUp className="mr-1 h-4 w-4" />
              Top of Alumni
            </button>
          </div>

          {/* Alumni Modal for mobile */}
          {selectedAlumni && isMobile && (
            <AlumniModal alumni={selectedAlumni} onClose={handleCloseModal} />
          )}
        </div>
      )}
    </div>
  );
}
