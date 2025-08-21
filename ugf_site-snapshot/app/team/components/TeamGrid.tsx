"use client";

import React, { useState, useEffect, useRef } from "react";
import TeamMember from "./TeamMember";
import FilterAndSearch from "./FilterAndSearch";
import Modal from "./Modal";
import { ArrowUp } from "lucide-react";
import { useRouter } from "next/navigation";

interface Deal {
  id: string;
  name: string;
  stage: string;
  logo: Array<{
    id: string;
    url: string;
  }>;
  stageInvested: string;
  description: string;
  website: string;
  sector: string;
  status: "active" | "exited";
  dealLeads: string[];
}

interface TeamMember {
  id: string;
  name: string;
  title: string;
  bio: string;
  school: string;
  photo: string;
  degree: string;
  office?: string;
  LinkedIn?: string;
  deals?: Deal[];
  onClick?: () => void;
}

interface TeamGridProps {
  teamMembers: TeamMember[];
  titles: string[];
  onAlumniClick?: () => void;
}

export default function TeamGrid({
  teamMembers,
  titles,
  onAlumniClick,
}: TeamGridProps) {
  const router = useRouter();
  const [selectedTitle, setSelectedTitle] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // New state for filtering by office and school
  const [selectedOffice, setSelectedOffice] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");

  // Lists for dropdown options
  const [offices, setOffices] = useState<string[]>([]);
  const [schools, setSchools] = useState<string[]>([]);

  // Add state for management team
  const [managementTeam, setManagementTeam] = useState<TeamMember[]>([]);

  const teamSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Find management team members (Tom, Peter, and Lindsey)
    const managementNames = ["Tom", "Peter", "Lindsey"];
    const management = teamMembers.filter((member) =>
      managementNames.some((name) => member.name.includes(name))
    );

    // Sort management team in reverse chronological order (Tom first, then Peter, then Lindsey)
    const sortedManagement = management.sort((a, b) => {
      const orderMap = new Map([
        ["Tom Stringham", 0],
        ["Peter Harris", 1],
        ["Lindsey Hansen", 2],
      ]);

      const aOrder = orderMap.get(a.name) ?? 999;
      const bOrder = orderMap.get(b.name) ?? 999;

      return aOrder - bOrder;
    });

    setManagementTeam(sortedManagement);

    // Extract unique offices and schools for filtering
    const uniqueOffices = Array.from(
      new Set(
        teamMembers
          .map((member) => member.office)
          .filter((office): office is string => !!office)
      )
    ).sort();

    const uniqueSchools = Array.from(
      new Set(
        teamMembers
          .map((member) => member.school)
          .filter((school): school is string => !!school)
      )
    ).sort();

    setOffices(uniqueOffices);
    setSchools(uniqueSchools);

    // Add scroll event listener to show/hide back to top button
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [teamMembers, titles]);

  // Handle back to top click
  const handleBackToTopClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Function to handle management team member click
  const handleManagementMemberClick = (member: TeamMember) => {
    // Convert name to slug for URL
    const nameSlug = member.name.toLowerCase().replace(/\s+/g, "-");
    router.push(`/team/management/${nameSlug}`);
  };

  const filteredMembers = teamMembers.filter((member) => {
    // Exclude management team from the main grid when using "All" filter
    const isManagement = managementTeam.some((mgmt) => mgmt.id === member.id);
    if (selectedTitle === "All" && isManagement) return false;

    // Filter by title
    const matchesTitle =
      selectedTitle === "All" || member.title === selectedTitle;

    // Filter by office
    const matchesOffice = !selectedOffice || member.office === selectedOffice;

    // Filter by school
    const matchesSchool = !selectedSchool || member.school === selectedSchool;

    // Filter by search query
    if (!searchQuery) return matchesTitle && matchesOffice && matchesSchool;

    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = (member.name?.toLowerCase() || "").includes(
      searchLower
    );

    return matchesTitle && matchesOffice && matchesSchool && matchesSearch;
  });

  // Filter out members without names and sort alphabetically by name
  const sortedFilteredMembers = [...filteredMembers]
    .filter((member) => member.name && member.name.trim() !== "")
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      {/* Management Team Section */}
      <div className="mb-16">
        <div className="p-8 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {managementTeam.map((member) => (
              <TeamMember
                key={`management-${member.id}`}
                id={member.id}
                name={member.name}
                title={
                  // Manual assignment of titles, in airtable all titles are "management" for organization purposes
                  member.name === "Peter Harris"
                    ? "Founding Partner"
                    : member.name === "Lindsey Hansen"
                    ? "Chief Of Staff"
                    : member.name === "Tom Stringham"
                    ? "Managing Partner"
                    : member.title
                }
                school={member.school}
                degree={""}
                photo={member.photo}
                bio={member.bio}
                onClick={() => handleManagementMemberClick(member)}
                allTeamMembers={managementTeam}
              />
            ))}
          </div>
        </div>
      </div>

      <div ref={teamSectionRef} id="team-section">
        <FilterAndSearch
          roles={titles}
          selectedRole={selectedTitle}
          setSelectedRole={setSelectedTitle}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onAlumniClick={onAlumniClick}
          offices={offices}
          schools={schools}
          selectedOffice={selectedOffice}
          setSelectedOffice={setSelectedOffice}
          selectedSchool={selectedSchool}
          setSelectedSchool={setSelectedSchool}
          teamMembers={teamMembers}
        />

        {sortedFilteredMembers.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sortedFilteredMembers.map((member) => (
              <TeamMember
                key={member.id}
                id={member.id}
                name={member.name}
                title={member.title}
                photo={member.photo}
                bio={member.bio}
                school={member.school}
                degree={member.degree}
                office={member.office}
                onClick={() => {
                  setSelectedMember(member);
                }}
                allTeamMembers={sortedFilteredMembers}
              />
            ))}
          </div>
        ) : (
          <div className="mt-8 text-center">
            <p className="text-xl text-gray-400">
              No team members match the selected filters.
            </p>
            <button
              onClick={() => {
                setSelectedTitle("All");
                setSelectedOffice("");
                setSelectedSchool("");
                setSearchQuery("");
              }}
              className="mt-4 px-6 py-2 bg-[#17A2FF] text-white hover:bg-[#B2E0FF] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {selectedMember && (
        <Modal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      )}

      {/* Back to top button */}
      {showBackToTop && (
        <button
          onClick={handleBackToTopClick}
          className="fixed bottom-6 right-6 p-3 bg-[#17A2FF] text-white shadow-lg hover:bg-[#B2E0FF] transition-colors z-50"
          aria-label="Back to top"
        >
          <ArrowUp size={24} />
        </button>
      )}
    </>
  );
}
