import { fetchPortfolioCompanies } from "@/lib/services/airtable";
import Navbar from "@/app/components/Navbar";
import PortfolioPageClient from "@/app/portfolio/PortfolioPageClient";
import { Suspense } from "react";

interface PortfolioCompany {
  id: string;
  name: string;
  logo: Array<{
    id: string;
    url: string;
  }>;
  icon: string;
  stageInvested: string;
  description: string;
  website: string;
  sector: string;
  status: "active" | "exited";
  dealLeads: string[];
  jobs: string;
}

export const revalidate = 86400; // revalidate at most every 24 hours

export default async function PortfolioPage() {
  try {
    // Fetch portfolio companies at build time
    const deals = await fetchPortfolioCompanies();

    // Log for debugging in production
    console.log("Portfolio companies fetched:", deals.length);

    // Handle empty data gracefully in production
    if (deals.length === 0) {
      console.warn(
        "No portfolio companies found - this may indicate a data fetching issue"
      );
    }

    const companies: PortfolioCompany[] = deals.map((deal) => ({
      id: deal.id,
      name: deal.name,
      logo: deal.logo || [{ id: "", url: "/placeholder.svg" }],
      icon: "/placeholder.svg?height=100&width=100",
      status: deal.status,
      stageInvested: deal.stageInvested,
      description: deal.description,
      website: deal.website,
      sector: deal.sector,
      dealLeads: deal.dealLeads,
      jobs: deal.jobs,
    }));

    return (
      <Suspense
        fallback={
          <div className="flex flex-col bg-white relative min-h-screen">
            <Navbar />
            <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-gray-100 via-white to-gray-100" />
            <div className="relative z-10">
              <header className="pt-24 pb-32 text-center">
                <h1 className="text-6xl md:text-8xl font-bold text-gray-800 font-montserrat">
                  <span className="md:hidden">Our Portfolio</span>
                  <span className="hidden md:inline">Our Investments</span>
                </h1>
              </header>
              <div className="container mx-auto px-4 py-4">
                <p className="text-center text-gray-600">
                  Loading portfolio...
                </p>
              </div>
            </div>
          </div>
        }
      >
        <PortfolioPageClient companies={companies} />
      </Suspense>
    );
  } catch (error) {
    return (
      <div className="flex flex-col bg-white relative min-h-screen">
        <Navbar />

        {/* Gradient background */}
        <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-gray-100 via-white to-gray-100" />

        {/* Content that scrolls with the page */}
        <div className="relative z-10">
          <header className="pt-24 pb-32 text-center">
            <h1
              className="text-6xl md:text-8xl font-bold text-gray-800 font-montserrat
            "
            >
              <span className="md:hidden">Our Portfolio</span>
              <span className="hidden md:inline">Our Investments</span>
            </h1>
          </header>

          <div className="container mx-auto px-4 py-4">
            <p className="text-red-600 text-center">
              Error loading portfolio companies:{" "}
              {error instanceof Error ? error.message : String(error)}
            </p>
          </div>
        </div>
      </div>
    );
  }
}
