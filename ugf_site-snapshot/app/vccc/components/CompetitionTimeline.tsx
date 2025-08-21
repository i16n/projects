"use client";

import { VCCCData } from "@/lib/services/airtable";
import {
  Calendar,
  Users,
  Award,
  BookOpen,
  Target,
  Trophy,
  ClipboardList,
  Clock,
  FlaskConical,
  Microscope,
  FileText,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface CompetitionTimelineProps {
  vcccData: VCCCData;
  city: string;
}

function TimelineItem({
  item,
  index,
  isVisible,
}: {
  item: {
    icon: React.ReactNode;
    title: string;
    date: string;
    description: string;
    link?: string;
  };
  index: number;
  isVisible: boolean;
}) {
  return (
    <div
      className={`transform transition-all duration-700 ease-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="flex items-start space-x-4">
        <div className="hidden sm:flex flex-shrink-0 w-12 h-12 rounded-full items-center justify-center bg-[#004A7C] text-white">
          {item.icon}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white">{item.title}</h3>
          <div className="flex items-center gap-2 whitespace-nowrap text-white font-semibold mt-1">
            <span>{item.date || "Date TBA"}</span>
          </div>
          <p className="mt-2 text-gray-300">{item.description}</p>
          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center mt-2 text-[#17A2FF] hover:text-[#B2E0FF] transition-colors"
            >
              View Details →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CompetitionTimeline({
  vcccData,
}: CompetitionTimelineProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (timelineRef.current) {
      observer.observe(timelineRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Define schedule items in natural order with their icons and descriptions
  const scheduleItems = [
    {
      key: "kickOff",
      title: "Kick Off Meeting",
      date: vcccData.kickOffMeeting,
      icon: <Calendar className="h-6 w-6" />,
      description: "We'll introduce the case and workshop venture capital",
      videoLink: vcccData.kickOffVideoLink,
    },
    {
      key: "sourcing",
      title: "Deal Sourcing Training",
      date: vcccData.sourcingTraining,
      icon: <BookOpen className="h-6 w-6" />,
      description: "Workshop all you need to know about sourcing your deals",
      videoLink: vcccData.sourcingTrainingVideoLink,
    },
    {
      key: "dd1",
      title: "Due Diligence Training #1",
      date: vcccData.dd1Training,
      icon: <FlaskConical className="h-6 w-6" />,
      description: "Workshop all you need to know about due diligence, part 1",
      videoLink: vcccData.dd1TrainingVideoLink,
    },
    {
      key: "dd2",
      title: "Due Diligence Training #2",
      date: vcccData.dd2Training,
      icon: <Microscope className="h-6 w-6" />,
      description: "Workshop all you need to know about due diligence, part 2",
      videoLink: vcccData.dd2TrainingVideoLink,
    },
    {
      key: "regionalSemis",
      title: "Regional Semifinals",
      date: vcccData.regionalSemis,
      icon: <Award className="h-6 w-6" />,
      description:
        "Present your investment thesis to a panel of judges in the regional semifinals",
    },
    {
      key: "nationalFinals",
      title: "National Finals",
      date: vcccData.nationalFinals,
      icon: <Trophy className="h-6 w-6" />,
      description:
        "Top teams will present their final investment recommendations to a panel of industry experts",
    },
  ];

  // Define deadlines in natural order with their icons and descriptions
  const deadlineItems = [
    {
      key: "teamReg",
      title: "Team Registration Deadline",
      date: vcccData.teamRegDeadline,
      icon: <ClipboardList className="h-6 w-6" />,
      description:
        "Sign up in groups of 2-4. If you don't have a team yet, sign up and we will help you find a team",
    },
    {
      key: "threeComp",
      title: "Top 3 Companies Submission",
      date: vcccData.threeCompSubDeadline,
      icon: <FileText className="h-6 w-6" />,
      description:
        "Submit your top 3 companies before the deadline. Late submissions are not accepted.",
    },
    {
      key: "pitchDeck",
      title: "Pitch Deck Deadline",
      date: vcccData.pitchDeckDeadline,
      icon: <FileText className="h-6 w-6" />,
      description:
        "Submit your pitch deck before the deadline. Late submissions are not accepted.",
    },
    {
      key: "semisAnnounced",
      title: "Semifinal Teams Announced",
      date: vcccData.semisTeamsAnnounced,
      icon: <Target className="h-6 w-6" />,
      description: "All teams receive notice regarding their advancement",
    },
    {
      key: "semisPresentation",
      title: "Semifinal Presentation Submission",
      date: vcccData.semisPresentationDeadline,
      icon: <FileText className="h-6 w-6" />,
      description:
        "Submit your semifinal presentation before the deadline. Late submissions are not accepted.",
    },
    {
      key: "finalsPresentation",
      title: "Final Presentation Submission",
      date: vcccData.finalsPresentationDeadline,
      icon: <FileText className="h-6 w-6" />,
      description:
        "Submit your final presentation before the deadline. Late submissions are not accepted.",
    },
  ];

  // Process schedule items into timeline format
  const scheduleTimelineItems = scheduleItems
    .filter((item) => item.date) // Only include items with dates
    .map((item) => {
      return {
        icon: item.icon,
        title: item.title,
        date: item.date, // Use the human-readable date string directly
        description: item.description,
        link: item.videoLink || undefined,
      };
    });

  // Process deadline items into timeline format
  const deadlineTimelineItems = deadlineItems
    .filter((item) => item.date) // Only include items with dates
    .map((item) => {
      const date = new Date(item.date);
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      const formattedTime = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      return {
        icon: item.icon,
        title: item.title,
        date: `${formattedDate} at ${formattedTime}`,
        description: item.description,
      };
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="py-12 bg-black" ref={timelineRef}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-white mb-8 text-center mt-8">
          Competition Timeline
        </h2>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Schedule Column */}
            <div>
              <h3 className="text-2xl font-semibold text-[#004A7C] mb-6 text-center">
                Schedule
              </h3>
              <div className="space-y-6 relative">
                <div className="hidden sm:block absolute left-6 top-6 bottom-12 w-0.5 bg-[#004A7C]"></div>
                {scheduleTimelineItems.map((item, index) => (
                  <TimelineItem
                    key={index}
                    item={item}
                    index={index}
                    isVisible={isVisible}
                  />
                ))}
              </div>
            </div>

            {/* Deadlines Column */}
            <div>
              <h3 className="text-2xl font-semibold text-[#004A7C] mb-6 text-center">
                Deadlines
              </h3>
              <div className="space-y-6 relative">
                <div className="hidden sm:block absolute left-6 top-6 bottom-12 w-0.5 bg-[#004A7C]"></div>
                {deadlineTimelineItems.map((item, index) => (
                  <TimelineItem
                    key={index}
                    item={item}
                    index={index}
                    isVisible={isVisible}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
