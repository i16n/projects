import React, { useEffect } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { useLoading } from "@/app/contexts/LoadingContext";

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
  jobs: string;
  sector: string;
  stageInvested: string;
  dealLeads: string[];
}

interface CompanyModalProps {
  company: Company;
  onClose: () => void;
}

export function CompanyModal({ company, onClose }: CompanyModalProps) {
  const { hideLoading } = useLoading();

  useEffect(() => {
    // Prevent scrolling on the body when modal is open
    document.body.style.overflow = "hidden";

    // Hide loading screen when modal is rendered
    hideLoading();

    return () => {
      // Re-enable scrolling when modal is closed
      document.body.style.overflow = "auto";
    };
  }, [hideLoading]);

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-black w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-black z-10 p-6 border-b">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold font-mono text-white">
              {company.name}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row md:space-x-6 mb-6">
            <div className="w-full md:w-1/3 mb-4 md:mb-0">
              <img
                src={company.logo[0]?.url || "/placeholder.svg"}
                alt={`${company.name} logo`}
                className="w-full h-auto object-contain mb-4"
              />
              <div className="flex justify-between gap-2">
                {company.website && (
                  <button
                    onClick={() => {
                      const url = company.website.startsWith("http")
                        ? company.website
                        : `https://${company.website}`;
                      window.open(url, "_blank");
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 border border-white hover:bg-gray-200 hover:text-black transition-colors font-mono text-md text-white"
                  >
                    Website <span className="text-[#17A2FF]">↗</span>
                  </button>
                )}
                {company.jobs && (
                  <button
                    onClick={() => {
                      const url = company.jobs.startsWith("http")
                        ? company.jobs
                        : `https://${company.jobs}`;
                      window.open(url, "_blank");
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 border border-white hover:bg-gray-200 hover:text-black transition-colors font-mono text-md text-white"
                  >
                    Jobs <span className="text-[#17A2FF]">↗</span>
                  </button>
                )}
              </div>
            </div>

            <div className="w-full md:w-2/3 text-white">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <h3 className="font-mono font-bold text-sm mb-1">Stage</h3>
                  <p className="font-mono text-sm">
                    {company.stageInvested || "N/A"}
                  </p>
                </div>
                <div>
                  <h3 className="font-mono font-bold text-sm mb-1">Sector</h3>
                  <p className="font-mono text-sm">{company.sector || "N/A"}</p>
                </div>
                <div>
                  <h3 className="font-mono font-bold text-sm mb-1">Status</h3>
                  <p className="font-mono text-sm">{company.status || "N/A"}</p>
                </div>
                <div>
                  <h3 className="font-mono font-bold text-sm mb-1">
                    Deal {company.dealLeads.length === 1 ? "Lead" : "Leads"}
                  </h3>
                  <p className="font-mono text-sm">
                    {company.dealLeads.length > 0
                      ? company.dealLeads.join(", ")
                      : "-"}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-mono font-bold text-lg mb-2 text-white">
                  What they do
                </h3>
                <p className="font-mono text-sm leading-relaxed text-white">
                  {company.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
