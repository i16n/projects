"use client";

import Navbar from "@/app/components/Navbar";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function TBDPageContent() {
  const searchParams = useSearchParams();
  const city = searchParams.get("city") || "Unknown City";
  const interestForm = searchParams.get("interestForm");

  return (
    <div className="flex min-h-screen flex-col text-white">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <Link
          href="/vccc"
          className="inline-flex items-center text-gray-400 hover:text-white mb-8"
        >
          ← Back to VCCC
        </Link>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center">
            {city} VC Case Competition
          </h1>
          <hr className="border-white my-8" />

          <div className="bg-gray-800 p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Competition Not Ongoing
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-xl">
              The {city} Case Competition is not currently ongoing. Fill this
              form out to express your interest, and join the mailing list!
            </p>

            <form>
              {interestForm ? (
                <>
                  <div className="mb-4">
                    <Link
                      href={interestForm}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white underline hover:text-gray-300"
                    >
                      Open this form in another window
                    </Link>
                  </div>
                  <iframe
                    src={interestForm}
                    title="Interest Form"
                    width="100%"
                    height="700"
                    style={{ border: "none", minHeight: 400 }}
                    allowFullScreen
                  />
                </>
              ) : (
                <span>No signup form available.</span>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UniversalTBDPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col text-white">
          <Navbar />
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto text-center">
              <div className="animate-pulse">
                <div className="h-12 bg-gray-700 rounded mb-6"></div>
                <div className="h-8 bg-gray-700 rounded mb-8"></div>
                <div className="h-64 bg-gray-800 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <TBDPageContent />
    </Suspense>
  );
}
