import { Suspense } from "react";
import Navbar from "@/app/components/Navbar";
import Loading from "./loading";
import { fetchActiveMembers } from "@/lib/services/airtable";
import TeamPageClient from "./components/TeamPageClient";

export const revalidate = 86400; // 24 hours in seconds

export default async function TeamPage() {
  try {
    const activeMembers = await fetchActiveMembers(); // includes management team

    // These never change
    const allTitles = [
      "All",
      "Intern",
      "Analyst",
      "Associate",
      "Senior Associate",
    ];

    return (
      <div className="text-white">
        <Navbar />
        <div className="fixed inset-0 bg-gray-900 -z-10" />
        <main className="flex-1">
          <div className="min-h-screen py-8">
            <div className="container mx-auto px-4 py-4 font-mono text-gray-100">
              <h2 className="text-3xl md:text-4xl lg:text-7xl mb-16 text-center font-montserrat max-w-5xl mx-auto leading-tight text-gray-400">
                Our student interns are the focus of our fund.
              </h2>
              <Suspense fallback={<Loading />}>
                <TeamPageClient
                  activeMembers={activeMembers}
                  titles={allTitles}
                />
              </Suspense>
            </div>
          </div>
        </main>
      </div>
    );
  } catch (error) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-900">
        <Navbar />
        <div className="fixed inset-0 bg-gray-900 -z-10" />
        <main className="flex-1">
          <div className="min-h-screen py-8">
            <div className="container mx-auto px-4 py-4 font-mono text-gray-100">
              <h2 className="text-4xl md:text-6xl lg:text-8xl mb-16 text-center font-montserrat max-w-5xl mx-auto leading-tight text-gray-400">
                Meet Our Team
              </h2>
              <p className="text-red-400 text-center">
                Error loading team members:{" "}
                {error instanceof Error ? error.message : String(error)}
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }
}
