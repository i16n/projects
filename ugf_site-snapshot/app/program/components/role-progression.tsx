"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/app/components/button";
import {
  CheckCircle2,
  Target,
  PieChart,
  BarChart3,
  Users,
  Briefcase,
  GraduationCap,
} from "lucide-react";

const roles = [
  {
    number: "1",
    title: "Intern",
    summary: "Learning the fundamentals with immediate impact",
    description:
      "New members learn fundamentals of VC while contributing to investment decisions with mentor guidance.",
    color: "from-[#B2E0FF] to-[#17A2FF]",
    icon: GraduationCap,
    keySkills: [
      "Investment fundamentals",
      "Due diligence processes",
      "Financial analysis",
      "Industry research",
    ],
    responsibilities: [
      "Participate in weekly trainings",
      "Research potential investments",
      "Work closely with mentors",
      "Contribute to investment decisions",
    ],
  },
  {
    number: "2",
    title: "Analyst",
    summary: "Applying skills with increased responsibility",
    description:
      "Analysts develop stronger diligence skills while taking on increased deal flow and workload.",
    color: "from-[#17A2FF] to-[#004A7C]",
    icon: BarChart3,
    keySkills: [
      "Advanced financial modeling",
      "Market analysis",
      "Competitive landscape evaluation",
      "Trend identification",
    ],
    responsibilities: [
      "Lead initial due diligence efforts",
      "Analyze financial statements",
      "Evaluate business models",
      "Present investment insights",
    ],
  },
  {
    number: "3",
    title: "Associate",
    summary: "Co-leading deals with strategic understanding",
    description:
      "Associates co-lead deals with deeper understanding of finance, VC, and competitive strategy.",
    color: "from-[#004A7C] to-purple-500",
    icon: PieChart,
    keySkills: [
      "Deal structuring",
      "Valuation expertise",
      "Term sheet negotiation",
      "Strategic planning",
    ],
    responsibilities: [
      "Co-lead investment deals",
      "Coordinate due diligence teams",
      "Develop investment thesis",
      "Build founder relationships",
    ],
  },
  {
    number: "4",
    title: "Senior Associate",
    summary: "Leading the fund with expertise and accountability",
    description:
      "Senior Associates lead deals, source investments, build relationships, train interns, and manage the team.",
    color: "from-purple-500 to-purple-600",
    icon: Briefcase,
    keySkills: [
      "Leadership and mentoring",
      "Portfolio management",
      "Network development",
      "Strategic decision making",
    ],
    responsibilities: [
      "Lead deals from start to finish",
      "Train and mentor junior members",
      "Represent UGF at industry events",
      "Build relationships with VCs and founders",
    ],
  },
];

export default function RoleProgression() {
  const [activeTab, setActiveTab] = useState(0);
  const [isExpectationsVisible, setIsExpectationsVisible] = useState(false);
  // Add refs for each tab
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    width: number;
  }>({ left: 0, width: 0 });
  const expectationsRef = useRef<HTMLDivElement>(null);

  // Get current role
  const currentRole = roles[activeTab];
  const RoleIcon = currentRole.icon;

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  // Update indicator position and width on tab change or resize
  useEffect(() => {
    const updateIndicator = () => {
      const node = tabRefs.current[activeTab];
      if (node) {
        setIndicatorStyle({ left: node.offsetLeft, width: node.offsetWidth });
      }
    };
    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [activeTab]);

  // Intersection observer for expectations section
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsExpectationsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    if (expectationsRef.current) {
      observer.observe(expectationsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-black text-white py-12">
      <div className="container mx-auto">
        {/* Section title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tighter mb-12 text-white">
            ROLES AND EXPECTATIONS
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-20">
            See how our students progress within the fund and what we expect of
            them.
          </p>
        </div>

        {/* Tab navigation with always-visible UGF gradient */}
        <div className="flex justify-center mb-20 relative z-10">
          <div
            className="inline-flex p-1 relative overflow-hidden"
            style={{
              minWidth: 320,
              background:
                "linear-gradient(to right, #B2E0FF 0%, #17A2FF 33%, #004A7C 66%, #8B5CF6 100%)",
            }}
          >
            {/* Faded overlay for inactive state */}
            <div className="absolute inset-0 bg-gray-900/70 pointer-events-none z-0" />
            {/* Active tab indicator as a white border highlight, now pixel-perfect */}
            <div
              className="absolute top-1 bottom-1 transition-all duration-300 ease-out pointer-events-none z-10 border-2 border-white/70 shadow-lg"
              style={{
                left: indicatorStyle.left,
                width: indicatorStyle.width,
              }}
            />
            {roles.map((role, index) => (
              <button
                key={index}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                onClick={() => handleTabClick(index)}
                className={`px-6 py-3 text-sm font-medium relative z-20 cursor-pointer transition-all duration-200 ${
                  activeTab === index
                    ? `text-white font-semibold`
                    : "text-gray-300 hover:text-white"
                }`}
                type="button"
                aria-selected={activeTab === index}
                role="tab"
                style={{ background: "transparent" }}
              >
                {role.title}
              </button>
            ))}
          </div>
        </div>

        {/* Content area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left side: Role title and summary */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentRole.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center lg:text-left"
              >
                <div className="flex items-center justify-center lg:justify-start mb-6">
                  <div
                    className={`p-4 rounded-full bg-gradient-to-br ${currentRole.color} shadow-lg mr-4`}
                  >
                    <RoleIcon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-8xl font-bold opacity-20 text-white">
                    {currentRole.number}
                  </div>
                </div>

                <h3 className="text-3xl font-bold text-white mb-4">
                  {currentRole.title}
                </h3>
                <p className="text-xl text-gray-300 max-w-md">
                  {currentRole.summary}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right side: Role description and details */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentRole.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-900 backdrop-blur-sm p-8"
              >
                <p className="text-lg text-gray-200 mb-8 leading-relaxed">
                  {currentRole.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <Target
                        className="w-5 h-5 mr-2"
                        style={{
                          color:
                            activeTab === 0
                              ? "#B2E0FF"
                              : activeTab === 1
                              ? "#17A2FF"
                              : activeTab === 2
                              ? "#004A7C"
                              : "#8B5CF6",
                        }}
                      />{" "}
                      Key Skills
                    </h4>
                    <ul className="space-y-3">
                      {currentRole.keySkills.map((skill) => (
                        <li key={skill} className="flex items-start">
                          <CheckCircle2
                            className="w-5 h-5 mr-2 flex-shrink-0 mt-1"
                            style={{
                              color:
                                activeTab === 0
                                  ? "#B2E0FF"
                                  : activeTab === 1
                                  ? "#17A2FF"
                                  : activeTab === 2
                                  ? "#004A7C"
                                  : "#8B5CF6",
                            }}
                          />
                          <span className="text-gray-300">{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <Users
                        className="w-5 h-5 mr-2"
                        style={{
                          color:
                            activeTab === 0
                              ? "#B2E0FF"
                              : activeTab === 1
                              ? "#17A2FF"
                              : activeTab === 2
                              ? "#004A7C"
                              : "#8B5CF6",
                        }}
                      />{" "}
                      Responsibilities
                    </h4>
                    <ul className="space-y-3">
                      {currentRole.responsibilities.map((resp) => (
                        <li key={resp} className="flex items-start">
                          <CheckCircle2
                            className="w-5 h-5 mr-2 flex-shrink-0 mt-1"
                            style={{
                              color:
                                activeTab === 0
                                  ? "#B2E0FF"
                                  : activeTab === 1
                                  ? "#17A2FF"
                                  : activeTab === 2
                                  ? "#004A7C"
                                  : "#8B5CF6",
                            }}
                          />
                          <span className="text-gray-300">{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Student Expectations Section */}
      <div className="container mx-auto mt-20" ref={expectationsRef}>
        <div className="bg-gray-900 p-12 shadow-2xl">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              WHAT WE EXPECT
            </h3>
            <p className="text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Our program requires dedication and commitment. Here's what we
              expect from our interns to ensure success.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Expectations List */}
            <div className="space-y-8">
              {[
                {
                  title: "Time Commitment",
                  description:
                    "20 hours per week. You choose when and where to work, giving you flexibility around your academic schedule.",
                },
                {
                  title: "Office Hours",
                  description:
                    "5 hours minimum in-office per week to collaborate with the team and participate in meetings.",
                },
                {
                  title: "Team Meetings",
                  description:
                    "Attend Friday morning staff meetings to discuss market news, go over updates, pitch deals, and hear from guest speakers.",
                },
                {
                  title: "Take Initiative",
                  description:
                    "We give our interns full autonomy, but expect them to be proactive and engaged in their work.",
                },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={
                    isExpectationsVisible
                      ? { opacity: 1, scale: 1, y: 0 }
                      : { opacity: 0, scale: 0.8, y: 20 }
                  }
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: "easeOut",
                  }}
                  className="flex items-start"
                >
                  <motion.div
                    className="flex-shrink-0 bg-gradient-to-br from-[#17A2FF] to-[#004A7C] p-3 mr-6 shadow-lg"
                    initial={{ scale: 0 }}
                    animate={
                      isExpectationsVisible ? { scale: 1 } : { scale: 0 }
                    }
                    transition={{
                      duration: 0.4,
                      delay: index * 0.1 + 0.2,
                      ease: "backOut",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={
                      isExpectationsVisible
                        ? { opacity: 1, x: 0 }
                        : { opacity: 0, x: -20 }
                    }
                    transition={{
                      duration: 0.4,
                      delay: index * 0.1 + 0.3,
                      ease: "easeOut",
                    }}
                  >
                    <h4 className="text-xl font-semibold text-white mb-2">
                      {item.title}
                    </h4>
                    <p className="text-gray-300 leading-relaxed">
                      {item.description}
                    </p>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* CTA Section */}
            <motion.div
              className="bg-gradient-to-br from-[#17A2FF] to-[#004A7C] p-10 shadow-2xl relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={
                isExpectationsVisible
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.9 }
              }
              transition={{
                duration: 0.6,
                delay: 0.5,
                ease: "easeOut",
              }}
            >
              <div className="absolute top-0 right-0 w-full h-full opacity-10">
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <pattern
                      id="grid"
                      width="10"
                      height="10"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 10 0 L 0 0 0 10"
                        fill="none"
                        stroke="white"
                        strokeWidth="0.5"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              <div className="relative z-10">
                <h3 className="text-3xl font-bold text-white mb-6">
                  Ready to Join Us?
                </h3>
                <p className="text-lg text-white mb-8 leading-relaxed">
                  We're looking for high intellect, ambitious, entrepreneurial
                  students who are ready to make an impact in venture capital.
                </p>

                <div className="flex items-center justify-left gap-4 mt-2">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="text-[#17A2FF] hover:bg-[#17A2FF] hover:text-white transition-colors px-8 py-3 bg-white border-white hover:border-[#17A2FF]"
                    asChild
                  >
                    <a
                      href="https://ugrowthfund.hire.trakstar.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Start Application
                    </a>
                  </Button>
                  <img src="/logo.svg" alt="UGF Logo" className="h-12 w-auto" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
