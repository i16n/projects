"use client";
import { Suspense, useEffect } from "react";
import { PortfolioList } from "@/app/portfolio/components/portfolio-list";
import Navbar from "@/app/components/Navbar";
import { useLoading } from "@/app/contexts/LoadingContext";
import { useSearchParams } from "next/navigation";

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

interface PortfolioPageClientProps {
  companies: PortfolioCompany[];
}

export default function PortfolioPageClient({
  companies,
}: PortfolioPageClientProps) {
  const { hideLoading } = useLoading();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Only run after hydration on client-side
    if (typeof window === "undefined") return;

    // If there's no deal parameter, hide the loading screen immediately
    const dealId = searchParams.get("deal");
    if (!dealId) {
      hideLoading();
    }
  }, [searchParams, hideLoading]);

  return (
    <div className="text-white">
      <Navbar />

      {/* Gradient background */}
      <div className="fixed inset-0 w-full h-full bg-black" />

      {/* Content that scrolls with the page */}
      <div className="relative z-10 flex-grow">
        {/* Header that scrolls with the page */}
        <header className="pt-24 pb-32 text-center">
          <h1 className="text-6xl md:text-8xl font-montserrat text-white">
            <span className="md:hidden">Our Portfolio</span>
            <span className="hidden md:inline">Our Investments</span>
          </h1>
        </header>

        {/* Spacer to push the portfolio list down */}
        <div className="h-[10vh]" />

        {/* Full Portfolio List Section */}
        <section className="w-full py-16">
          <div className="mx-auto px-4">
            <Suspense
              fallback={
                <div className="text-center text-xl text-gray-600">
                  Loading...
                </div>
              }
            >
              <PortfolioList companies={companies} />
            </Suspense>
          </div>
        </section>
      </div>
    </div>
  );
}
