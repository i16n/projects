"use client";

import { GraduationCap } from "lucide-react";
import RoleProgression from "@/app/program/components/role-progression";
import VideoHero from "@/app/program/components/video-hero";
import LearnSection from "@/app/program/components/learn-section";
import InvestSection from "@/app/program/components/invest-section";
import PlaceSection from "@/app/program/components/place-section";
import LogoCarousel from "@/app/program/components/logo-carousel";
import Counter from "@/app/program/components/counter";
import CommunityCarousel from "./components/CommunityCarousel";
import OfficesSection from "@/app/program/components/offices-section";
import Navbar from "@/app/components/Navbar";
import { Button } from "@/app/components/button";
import Link from "next/link";
import Image from "next/image";

import "./styles.css";
import { useIsMobile } from "@/hooks/use-mobile";

const logos = [
  { src: "/comps/apple.svg", alt: "Apple" },
  { src: "/comps/Bank_of_America-Logo.wine.svg", alt: "Bank of America" },
  { src: "/comps/amazon.svg", alt: "Amazon" },
  { src: "/comps/Deloitte-Logo.wine.svg", alt: "Deloitte" },
  { src: "/comps/Evercore_logo.svg", alt: "Evercore" },
  { src: "/comps/goldman.svg", alt: "Goldman Sachs" },
  { src: "/comps/kirkland-ellis.svg", alt: "Kirkland & Ellis" },
  { src: "/comps/lazard.svg", alt: "Lazard" },
  { src: "/comps/Lockheed_Martin-Logo.wine.svg", alt: "Lockheed Martin" },
  { src: "/comps/Meta_Platforms-Logo.wine.svg", alt: "Meta Platforms" },
  { src: "/comps/partners.svg", alt: "Partners Group" },
  { src: "/comps/UBS-Logo.wine.svg", alt: "UBS" },
  { src: "/comps/X_logo.svg", alt: "X" },
  { src: "/comps/mckinsey.svg", alt: "McKinsey" },
];

const pillars = [
  {
    title: "LEARN",
    testimonial: {
      quote:
        "UGF taught me things I never would have learned in a classroom. The mentors pushed me to think like a real investor, and that experience was worth more than any textbook.",
      name: "Hunter Sorensen",
      role: "Investment Analyst at Piper Sandler",
      image: "/hunter.webp",
    },
    backgroundImage: "/backgrounds/peterwb.webp",
  },
  {
    title: "INVEST",
    testimonial: {
      quote:
        "Working with real money changes everything. I got to sit across from founders of major companies and ask tough questions that actually impacted investment decisions.",
      name: "Ana Rusk",
      role: "Associate at Bessemer Venture Partners",
      image: "/ana.webp",
    },
    portfolioLogos: [
      { src: "/comps/sequoia.svg", alt: "Sequoia Capital" },
      { src: "/comps/andreessen.svg", alt: "Andreessen Horowitz" },
      { src: "/comps/accel.svg", alt: "Accel" },
    ],
    backgroundImage: "/backgrounds/talking.webp",
  },
  {
    title: "PLACE",
    testimonial: {
      quote:
        "My Goldman interviews went so smoothly because I had already done the work at UGF. I could talk about real deals I'd analyzed instead of just classroom case studies.",
      name: "Isaac Huntsman",
      role: "Software Engineer at Paygasus",
      image: "/isaac.webp",
    },
    backgroundImage: "/backgrounds/buy-side.webp",
  },
];

const communityPhotos = [
  { src: "/community/summer.webp", alt: "UGF" },
  { src: "/community/beach.webp", alt: "UGF at the beach" },
  {
    src: "/community/daboat.webp",
    alt: "UGF on a boat",
    backgroundPosition: "right center",
  },
  { src: "/community/moto.webp", alt: "UGF on motorcycles" },
  {
    src: "/community/paintball.webp",
    alt: "UGF paintball activity",
    backgroundPosition: "center bottom",
  },
  { src: "/community/bridgewalk.webp", alt: "UGF bridge walk" },
  {
    src: "/community/smileshike.webp",
    alt: "UGF smiles hike",
    backgroundPosition: "right center",
  },
];

export default function Home() {
  const isMobile = useIsMobile();

  return (
    <div className="text-white">
      <Navbar />

      <main className="flex-1 relative z-10">
        {/* Video Hero Section */}
        <div className="min-h-[25vh] py-4">
          <div className="container mx-auto px-4 py-4 font-mono text-gray-100">
            <h2 className="text-3xl md:text-4xl lg:text-7xl mb-20 mt-20 text-center font-oswald max-w-5xl mx-auto leading-tight text-gray-400">
              LEARN. INVEST. PLACE.
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-20 text-center">
              Learn the fundamentals of VC through training, mentorship, and
              hands on experience. Invest real capital into top companies. Place
              into high-level roles from investment banking to management
              consulting.
            </p>
          </div>
        </div>

        {/* Individual Pillar Sections */}
        <div id="program" className="relative z-10">
          <div id="learn">
            <LearnSection testimonial={pillars[0].testimonial} />
          </div>
          <div id="invest">
            <InvestSection testimonial={pillars[1].testimonial} />
          </div>
          <div id="place">
            <PlaceSection testimonial={pillars[2].testimonial} />
          </div>
        </div>

        <section id="path" className="relative z-20 pb-0 bg-black">
          <div className="pb-0 relative z-10">
            <div className="container mx-auto text-center mb-2 pt-6"></div>
            <RoleProgression />
          </div>
        </section>

        {/* Video Hero Section - moved to less prominent position */}
        <div className="py-8 bg-black">
          <VideoHero tagline="" description="" />
        </div>

        {/* Section break with static image */}
        <div className="relative z-15">
          <section className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
            <Image
              src="/backgrounds/goldengate.webp"
              alt="Golden Gate Bridge"
              fill
              className="object-cover object-center"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-black/25" />
          </section>
        </div>

        {/* Updated Change Your Trajectory section with enhanced transition */}
        <section className="text-white relative z-10 bg-black">
          <div className="text-center space-y-4 pt-12 pb-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-12 mt-20">
              CHANGE YOUR TRAJECTORY
            </h1>
            {/* Main paragraph about UGF being hard, now above the logos */}
            <div className="px-4 mb-6">
              <p className="text-lg text-gray-100 max-w-3xl mx-auto text-center drop-shadow-lg">
                Your work at University Growth Fund will challenge and stretch
                you - elevating your career trajectory. Graduates have gone on
                to secure many of the most prestigious jobs at investment firms,
                consulting firms, startups, and tech companies. They have
                started venture-backed and bootstrapped startups and attended
                top-tier graduate programs. In every case, our program gave them
                a leg up on the competition.
              </p>
            </div>
            {/* Animated Logos in 3x7 grid - FULL WIDTH */}
            <div className="relative py-4 overflow-hidden min-h-[300px] w-full">
              <div className="w-full">
                <div className="logo-container w-full">
                  <LogoCarousel logos={logos} />
                </div>
              </div>
            </div>
          </div>

          {/* Updated Animated Logos Section with enhanced visual styling */}

          <div className="container pt-2 pb-12">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
              <div className="p-8 bg-gray-900 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-center">
                  <h4 className="text-sm text-gray-400 uppercase mb-1">
                    JOB PLACEMENT:
                  </h4>
                  <Counter end={100} suffix="%" />
                  <p className="mt-1 text-gray-300 font-medium text-sm">
                    SINCE INCEPTION
                  </p>
                </div>
              </div>
              <div className="p-8 bg-gray-900 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-center">
                  <h4 className="text-sm text-gray-400 uppercase mb-1">
                    PAY PREMIUM OF
                  </h4>
                  <Counter end={120} suffix="%+" />
                  <p className="mt-1 text-gray-300 font-medium text-sm">
                    AT GRADUATION
                  </p>
                </div>
              </div>
              <div className="p-8 bg-gray-900 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-center">
                  <h4 className="text-sm text-gray-400 uppercase mb-1">
                    PROGRAM NPS:
                  </h4>
                  <Counter end={90} />
                  <p className="mt-1 text-gray-300 font-medium text-sm">
                    RATED BY STUDENTS
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Community Section */}
        {!isMobile && (
          <section
            id="community"
            className="text-white py-24 relative z-10 bg-black"
          >
            <div className="container mx-auto px-4">
              {/* Header */}
              <div className="text-center mb-16">
                <h1 className="text-3xl md:text-3xl font-bold text-white mb-12 tracking-tight">
                  OUR COMMUNITY
                </h1>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto mt-16 mb-10">
                  At UGF, our interns forge lasting connections through curated
                  events and activities, building a vibrant community that
                  endures well beyond graduation.
                </p>
              </div>
            </div>
            {/* Carousel outside container to extend full width */}
            <div className="mt-8">
              <CommunityCarousel photos={communityPhotos} />
            </div>
          </section>
        )}
        {/* Application Process Section */}
        <section className="relative z-10 bg-black py-20">
          <div className="container mx-auto px-4">
            {/* Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-20 tracking-tight">
                THE APPLICATION PROCESS
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-20">
                Our rigorous selection process ensures we identify exceptional
                candidates who will thrive in our fast-paced, high-impact
                environment.
              </p>
            </div>

            {/* Process Steps */}
            <div className="grid lg:grid-cols-3 gap-8 mb-20">
              {/* Step 1 */}
              <div className="relative group">
                <div className="bg-gray-900 p-8 h-full border border-gray-700/50 hover:border-[#17A2FF]/30 transition-all duration-300 hover:shadow-2xl hover:shadow-[#17A2FF]/10">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-[#17A2FF] rounded-full flex items-center justify-center mr-4 shadow-lg">
                      <span className="text-white font-bold text-lg">1</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      Initial Interview
                    </h3>
                  </div>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    Demonstrate your analytical thinking and passion for venture
                    capital through a focused 15-minute conversation.
                  </p>
                  <div className="bg-gray-900 p-4">
                    <h4 className="text-[#17A2FF] font-semibold mb-2 text-sm uppercase tracking-wide">
                      Format
                    </h4>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• 15-minute structured interview</li>
                      <li>• 2 foundational questions</li>
                      <li>• 1 challenging case study</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative group">
                <div className="bg-gray-900 p-8 h-full border border-gray-700/50 hover:border-[#17A2FF]/30 transition-all duration-300 hover:shadow-2xl hover:shadow-[#17A2FF]/10">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-[#17A2FF] rounded-full flex items-center justify-center mr-4 shadow-lg">
                      <span className="text-white font-bold text-lg">2</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      Due Diligence
                    </h3>
                  </div>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    Conduct comprehensive analysis on one of three pre-selected
                    companies and develop a compelling investment thesis.
                  </p>
                  <div className="bg-gray-900 p-4">
                    <h4 className="text-[#17A2FF] font-semibold mb-2 text-sm uppercase tracking-wide">
                      Deliverables
                    </h4>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• 1-week intensive research</li>
                      <li>• Investment memo</li>
                      <li>• Presentation deck</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative group">
                <div className="bg-gray-900 p-8 h-full border border-gray-700/50 hover:border-[#17A2FF]/30 transition-all duration-300 hover:shadow-2xl hover:shadow-[#17A2FF]/10">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-[#17A2FF] rounded-full flex items-center justify-center mr-4 shadow-lg">
                      <span className="text-white font-bold text-lg">3</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      Final Presentation
                    </h3>
                  </div>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    Present your investment analysis to our team and defend your
                    thesis through rigorous questioning and discussion.
                  </p>
                  <div className="bg-gray-900 p-4">
                    <h4 className="text-[#17A2FF] font-semibold mb-2 text-sm uppercase tracking-wide">
                      Session
                    </h4>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• 1-hour presentation</li>
                      <li>• Q&A with senior team</li>
                      <li>• Real-time feedback</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* What We Look For Section */}
            <div className="bg-gray-900 p-12 mb-16">
              <div className="text-center mb-12">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  WHAT WE LOOK FOR
                </h3>
                <p className="text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed">
                  We recruit exceptional students across all majors,
                  disciplines, and academic levels. From English undergraduates
                  to Ph.D. candidates in genetic engineering, we value diverse
                  perspectives and experiences. Our only requirements: you must
                  be a current student and located near one of our offices.
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-12">
                {/* Passion */}
                <div className="bg-gray-900 p-8 border border-gray-700/50">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#17A2FF] to-[#004A7C] flex items-center justify-center mr-6 shadow-lg">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <h4 className="text-2xl font-bold text-white">PASSION</h4>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    We seek individuals who live and breathe investing—those who
                    recognize this as a transformative opportunity, not merely a
                    resume builder. While UGF requires short-term sacrifices,
                    the experience gained is unparalleled and sets you apart in
                    the competitive landscape.
                  </p>
                </div>

                {/* Intellectual Horsepower */}
                <div className="bg-gray-900 p-8 border border-gray-700/50">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#17A2FF] to-[#004A7C] flex items-center justify-center mr-6 shadow-lg">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                    </div>
                    <h4 className="text-2xl font-bold text-white">
                      INTELLECTUAL HORSEPOWER
                    </h4>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    Our investors expect exceptional returns, requiring
                    analytical and strategic thinking of the highest caliber.
                    You'll predict market trends with limited information and
                    back those predictions with real capital. The learning curve
                    is steep, demanding your absolute best.
                  </p>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center mb-16">
              <div className="p-12">
                <h3 className="text-4xl md:text-5xl font-bold text-white mb-20 tracking-tight">
                  Ready to Transform Your Career?
                </h3>
                <p className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed pb-16">
                  If you possess the drive, intellect, and passion to excel in
                  venture capital, we want to hear from you. We recruit multiple
                  times per year across all our office locations.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button
                    size="lg"
                    className="bg-[#17A2FF] hover:bg-[#004A7C] text-white px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                    asChild
                  >
                    <Link
                      href="https://ugrowthfund.hire.trakstar.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Start Your Application
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-[#17A2FF] text-[#17A2FF] hover:bg-[#17A2FF] hover:text-white px-8 py-4 text-lg font-semibold transition-all duration-300"
                    asChild
                  >
                    <Link href="/team">Meet Our Team</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <OfficesSection />
      </main>
    </div>
  );
}
