"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { ChevronDown, Search, ArrowUp, ArrowRight } from "lucide-react";
import { CompanyModal } from "./company-modal";
import { useRouter, useSearchParams } from "next/navigation";
import { useLoading } from "@/app/contexts/LoadingContext";
import Image from "next/image";

interface Company {
  id: string;
  name: string;
  logo: Array<{
    id: string;
    url: string;
  }>;
  status: string;
  description: string;
  website: string;
  sector: string;
  stageInvested: string;
  dealLeads: string[];
  jobs: string;
}

interface PortfolioListProps {
  companies: Company[];
}

const sectorOptions = [
  "Fintech",
  "Health",
  "AI",
  "SaaS",
  "Infrastructure",
  "Consumer",
];

type SectorOption = (typeof sectorOptions)[number];

export function PortfolioList({ companies }: PortfolioListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [sectorFilter, setSectorFilter] = useState<SectorOption | "">("");
  const [statusSort, setStatusSort] = useState<"" | "active" | "exited">("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showSectorDropdown, setShowSectorDropdown] = useState(false);
  const { hideLoading } = useLoading();

  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const sectorDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run after hydration on client-side
    if (typeof window === "undefined") return;

    const dealId = searchParams.get("deal");
    if (dealId) {
      const company = companies.find((c) => c.id.toString() === dealId);
      if (company) {
        setSelectedCompany(company);
        setTimeout(() => hideLoading(), 100);
      } else {
        hideLoading();
      }
    } else {
      hideLoading();
    }
  }, [searchParams, companies, hideLoading]);

  useEffect(() => {
    // Only run after hydration on client-side
    if (typeof window === "undefined") return;

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
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    // Only run after hydration on client-side
    if (typeof window === "undefined") return;

    function handleClickOutside(event: MouseEvent) {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target as Node)
      ) {
        setShowStatusDropdown(false);
      }
      if (
        sectorDropdownRef.current &&
        !sectorDropdownRef.current.contains(event.target as Node)
      ) {
        setShowSectorDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle back to top click
  const handleBackToTopClick = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleCompanyClick = (company: Company) => {
    setSelectedCompany(company);
    router.replace(`?deal=${company.id}`, { scroll: false });
  };

  const handleCloseModal = () => {
    setSelectedCompany(null);
    if (typeof window !== "undefined") {
      router.replace(window.location.pathname, { scroll: false });
    }
  };

  const sortedAndFilteredCompanies = useMemo(() => {
    let filtered = [...companies];

    if (sectorFilter) {
      filtered = filtered.filter((company) => company.sector === sectorFilter);
    }

    if (statusSort) {
      filtered = filtered.filter((company) =>
        statusSort === "active"
          ? company.status.toLowerCase() === "active"
          : company.status.toLowerCase() === "exited"
      );
    }

    return filtered.filter(
      (company) =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [companies, sectorFilter, statusSort, searchTerm]);

  const getPearlClass = (index: number) => {
    return `pearl-${(index % 5) + 1}`;
  };

  return (
    <>
      <div className="mb-8">
        <div className="flex flex-wrap items-center justify-between mb-4">
          <div className="relative w-full md:w-64 mt-4 md:mt-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-black border border-white text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#17A2FF] focus:border-transparent"
            />
          </div>
        </div>

        {/* Desktop: Buttons */}
        <div className="hidden md:flex flex-wrap gap-2">
          <button
            onClick={() => setSectorFilter("")}
            className={`px-4 py-2 text-md font-oswald transition-colors mb-4 ${
              sectorFilter === ""
                ? "bg-[#17A2FF] text-white"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            All Sectors
          </button>
          {sectorOptions.map((sector) => (
            <button
              key={sector}
              onClick={() => setSectorFilter(sector)}
              className={`px-4 py-2 text-md font-oswald transition-colors mb-4 ${
                sectorFilter === sector
                  ? "bg-[#17A2FF] text-white"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {sector}
            </button>
          ))}
        </div>

        {/* Mobile: Dropdown */}
        <div className="md:hidden flex flex-wrap gap-4 mb-4">
          <div className="relative" ref={sectorDropdownRef}>
            <button
              onClick={() => setShowSectorDropdown(!showSectorDropdown)}
              className="flex items-center justify-between w-48 px-4 py-2 bg-gray-700 text-white hover:bg-gray-600 transition-colors text-md font-oswald"
            >
              <span>{sectorFilter === "" ? "All Sectors" : sectorFilter}</span>
              <ChevronDown
                className={`h-4 w-4 ml-2 transition-transform duration-200 ${
                  showSectorDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {showSectorDropdown && (
              <div className="absolute z-20 mt-1 w-48 shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 divide-y divide-gray-700">
                <div className="py-1 max-h-60 overflow-auto">
                  <button
                    onClick={() => {
                      setSectorFilter("");
                      setShowSectorDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                  >
                    All Sectors
                  </button>
                  {sectorOptions.map((sector) => (
                    <button
                      key={sector}
                      onClick={() => {
                        setSectorFilter(sector);
                        setShowSectorDropdown(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        sectorFilter === sector
                          ? "bg-[#B2E0FF] text-white"
                          : "text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      {sector}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status dropdown */}
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="relative" ref={statusDropdownRef}>
            <button
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className="flex items-center justify-between w-48 px-4 py-2 bg-gray-700 text-white hover:bg-gray-600 transition-colors text-md font-oswald"
            >
              <span>
                {statusSort === "active"
                  ? "Active"
                  : statusSort === "exited"
                  ? "Exited"
                  : "All Statuses"}
              </span>
              <ChevronDown
                className={`h-4 w-4 ml-2 transition-transform duration-200 ${
                  showStatusDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {showStatusDropdown && (
              <div className="absolute z-20 mt-1 w-48 shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 divide-y divide-gray-700">
                <div className="py-1 max-h-60 overflow-auto">
                  <button
                    onClick={() => {
                      setStatusSort("");
                      setShowStatusDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                  >
                    All Statuses
                  </button>
                  <button
                    onClick={() => {
                      setStatusSort("active");
                      setShowStatusDropdown(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      statusSort === "active"
                        ? "bg-[#B2E0FF] text-white"
                        : "text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => {
                      setStatusSort("exited");
                      setShowStatusDropdown(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      statusSort === "exited"
                        ? "bg-[#B2E0FF] text-white"
                        : "text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    Exited
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sortedAndFilteredCompanies.map((company, index) => (
          <div
            key={company.id}
            className={`
              aspect-square min-w-[150px] min-h-[150px] xl:min-w-[350px] xl:min-h-[350px]
              flex flex-col relative group cursor-pointer items-center justify-center
              transition-all duration-300 ease-in-out
              pearl-base ${getPearlClass(index)}
            `}
            onClick={() => handleCompanyClick(company)}
          >
            <Image
              src={company.logo[0]?.url || "/placeholder.svg"}
              alt={`${company.name} logo`}
              width={600}
              height={600}
              className="transition-all duration-300 lg:group-hover:opacity-0"
            />
            <div className="absolute inset-0 bg-black opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 border border-white" />
            <div className="absolute inset-0 flex flex-col justify-between pt-8 pb-8 opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 z-10 md:mt-4">
              <div className="text-center">
                <h3 className="text-white font-montserrat text-lg sm:text-2xl md:text-3xl lg:text-4xl text-center px-4">
                  {company.name}
                </h3>
              </div>
              <div className="text-center">
                <p className="text-white text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl px-4 line-clamp-3">
                  {company.description}
                </p>
                <button className="text-white px-3 py-2 sm:px-4 sm:py-2 md:px-5 md:py-3 lg:px-6 lg:py-3 font-montserrat transform scale-105 transition-transform duration-200 mt-4 flex items-center justify-center gap-2 lg:group-hover:gap-3 transition-all duration-200 mx-auto text-sm sm:text-base md:text-md lg:text-md">
                  View
                  <ArrowRight
                    size={16}
                    className="lg:group-hover:translate-x-1 transition-transform duration-200 delay-150"
                  />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedCompany && (
        <CompanyModal company={selectedCompany} onClose={handleCloseModal} />
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
