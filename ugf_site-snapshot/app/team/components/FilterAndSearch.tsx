import type { Dispatch, SetStateAction } from "react";
import { Search, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";

// Add TeamMember interface
interface TeamMember {
  id: string;
  name: string;
  title: string;
  bio: string;
  school: string;
  photo: string;
  degree: string;
  LinkedIn?: string;
  office?: string;
}

interface FilterAndSearchProps {
  roles: string[];
  selectedRole: string;
  setSelectedRole: Dispatch<SetStateAction<string>>;
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  onAlumniClick?: () => void;
  // New filter props
  offices: string[];
  schools: string[];
  selectedOffice: string;
  setSelectedOffice: Dispatch<SetStateAction<string>>;
  selectedSchool: string;
  setSelectedSchool: Dispatch<SetStateAction<string>>;
  // Add teamMembers for dynamic filtering
  teamMembers: TeamMember[];
}

export default function FilterAndSearch({
  roles,
  selectedRole,
  setSelectedRole,
  searchQuery,
  setSearchQuery,
  onAlumniClick,
  offices,
  schools,
  selectedOffice,
  setSelectedOffice,
  selectedSchool,
  setSelectedSchool,
  // Add teamMembers for dynamic filtering
  teamMembers,
}: FilterAndSearchProps) {
  // State for dropdown toggles
  const [showOfficeDropdown, setShowOfficeDropdown] = useState(false);
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);
  const [showPositionsDropdown, setShowPositionsDropdown] = useState(false);

  // Refs for dropdown elements (for clickaway handling)
  const officeDropdownRef = useRef<HTMLDivElement>(null);
  const schoolDropdownRef = useRef<HTMLDivElement>(null);
  const positionsDropdownRef = useRef<HTMLDivElement>(null);

  // Office name converter function
  const convertOfficeName = (officeCode: string): string => {
    const officeMap: Record<string, string> = {
      UT: "Salt Lake",
      SD: "San Diego",
      ATL: "Atlanta",
    };

    return officeMap[officeCode] || officeCode;
  };

  // Calculate filtered options based on current selections
  const filteredOffices = useMemo(() => {
    // If nothing is selected, return all offices
    if (!selectedSchool && selectedRole === "All") return offices;

    // Filter offices based on the current selections
    const availableOffices = new Set<string>();

    teamMembers.forEach((member) => {
      // Check if the member matches the selected filters
      const matchesSchool = !selectedSchool || member.school === selectedSchool;
      const matchesRole =
        selectedRole === "All" || member.title === selectedRole;

      // Only add this member's office if they match all selected filters
      if (matchesSchool && matchesRole && member.office) {
        availableOffices.add(member.office);
      }
    });

    return offices.filter((office) => availableOffices.has(office));
  }, [offices, selectedSchool, selectedRole, teamMembers]);

  const filteredSchools = useMemo(() => {
    // If nothing is selected, return all schools
    if (!selectedOffice && selectedRole === "All") return schools;

    // Filter schools based on the current selections
    const availableSchools = new Set<string>();

    teamMembers.forEach((member) => {
      // Check if the member matches the selected filters
      const matchesOffice = !selectedOffice || member.office === selectedOffice;
      const matchesRole =
        selectedRole === "All" || member.title === selectedRole;

      // Only add this member's school if they match all selected filters
      if (matchesOffice && matchesRole && member.school) {
        availableSchools.add(member.school);
      }
    });

    return schools.filter((school) => availableSchools.has(school));
  }, [schools, selectedOffice, selectedRole, teamMembers]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        officeDropdownRef.current &&
        !officeDropdownRef.current.contains(event.target as Node)
      ) {
        setShowOfficeDropdown(false);
      }
      if (
        schoolDropdownRef.current &&
        !schoolDropdownRef.current.contains(event.target as Node)
      ) {
        setShowSchoolDropdown(false);
      }
      if (
        positionsDropdownRef.current &&
        !positionsDropdownRef.current.contains(event.target as Node)
      ) {
        setShowPositionsDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-center justify-between mb-4">
        {/* Right-aligned search bar */}
        <div className="relative w-full md:w-64 mt-4 md:mt-0">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-black border border-white text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#17A2FF] focus:border-transparent"
          />
        </div>
      </div>

      {/* Mobile Positions Dropdown */}
      <div className="md:hidden mb-4">
        <div className="relative" ref={positionsDropdownRef}>
          <button
            onClick={() => setShowPositionsDropdown(!showPositionsDropdown)}
            className="flex items-center justify-between w-48 px-4 py-2 bg-gray-700 text-white hover:bg-gray-600 transition-colors text-sm font-medium"
          >
            <span>
              {selectedRole === "All" ? "All Positions" : selectedRole}
            </span>
            <ChevronDown
              className={`h-4 w-4 ml-2 transition-transform duration-200 ${
                showPositionsDropdown ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          {showPositionsDropdown && (
            <div className="absolute z-10 mt-1 w-48 shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 divide-y divide-gray-700">
              <div className="py-1 max-h-60 overflow-auto">
                {roles.map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      setSelectedRole(role);
                      setShowPositionsDropdown(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      selectedRole === role
                        ? "bg-[#B2E0FF] text-white"
                        : "text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {role}
                  </button>
                ))}
                <div className="border-t border-gray-700">
                  <button
                    onClick={() => {
                      onAlumniClick?.();
                      setShowPositionsDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                  >
                    Alumni
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop role buttons - hidden on mobile */}
      <div className="hidden md:flex flex-wrap gap-2">
        {roles.map((role) => (
          <button
            key={role}
            onClick={() => setSelectedRole(role)}
            className={`px-4 py-2 text-md font-oswald transition-colors mb-4 ${
              selectedRole === role
                ? "bg-[#17A2FF] text-white"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {role}
          </button>
        ))}

        {/* Alumni Button */}
        <button
          onClick={onAlumniClick || (() => {})}
          className="px-4 py-2 text-md font-oswald bg-gray-700 hover:bg-gray-600 transition-colors mb-4"
        >
          Alumni
        </button>
      </div>

      {/* New dropdowns for office and school filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        {/* Office dropdown */}
        <div className="relative" ref={officeDropdownRef}>
          <button
            onClick={() => setShowOfficeDropdown(!showOfficeDropdown)}
            className="flex items-center justify-between w-48 px-4 py-2 bg-gray-700 text-white hover:bg-gray-600 transition-colors text-sm font-medium"
          >
            <span>
              {selectedOffice
                ? convertOfficeName(selectedOffice)
                : "All Offices"}
            </span>
            <ChevronDown
              className={`h-4 w-4 ml-2 transition-transform duration-200 ${
                showOfficeDropdown ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          {showOfficeDropdown && (
            <div className="absolute z-10 mt-1 w-48 shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 divide-y divide-gray-700">
              <div className="py-1 max-h-60 overflow-auto">
                <button
                  onClick={() => {
                    setSelectedOffice("");
                    setShowOfficeDropdown(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                >
                  All Offices
                </button>
                {filteredOffices.length > 0 ? (
                  filteredOffices.map((office) => (
                    <button
                      key={office}
                      onClick={() => {
                        setSelectedOffice(office);
                        setShowOfficeDropdown(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        selectedOffice === office
                          ? "bg-[#B2E0FF] text-white"
                          : "text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      {convertOfficeName(office)}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-500 italic">
                    No matching offices
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* School dropdown */}
        <div className="relative" ref={schoolDropdownRef}>
          <button
            onClick={() => setShowSchoolDropdown(!showSchoolDropdown)}
            className="flex items-center justify-between w-48 px-4 py-2 bg-gray-700 text-white hover:bg-gray-600 transition-colors text-sm font-medium"
          >
            <span>{selectedSchool || "All Schools"}</span>
            <ChevronDown
              className={`h-4 w-4 ml-2 transition-transform duration-200 ${
                showSchoolDropdown ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          {showSchoolDropdown && (
            <div className="absolute z-10 mt-1 w-48 bg-gray-800 ring-1 ring-black ring-opacity-5 divide-y divide-gray-700">
              <div className="py-1 max-h-60 overflow-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500">
                <button
                  onClick={() => {
                    setSelectedSchool("");
                    setShowSchoolDropdown(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                >
                  All Schools
                </button>
                {filteredSchools.length > 0 ? (
                  filteredSchools.map((school) => (
                    <button
                      key={school}
                      onClick={() => {
                        setSelectedSchool(school);
                        setShowSchoolDropdown(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        selectedSchool === school
                          ? "bg-[#B2E0FF] text-white"
                          : "text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      {school}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-500 italic">
                    No matching schools
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
