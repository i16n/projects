import Navbar from "@/app/components/Navbar";
import { CountdownTimer } from "./CountdownTimer";
import CompetitionTimeline from "./CompetitionTimeline";
import VideoRecordings from "./VideoRecordings";
import FAQ from "./FAQ";
import { VCCCData } from "@/lib/services/airtable";
import HeroSection from "./HeroSection";
import { GraduationCap, Users, Trophy } from "lucide-react";

interface VCCCPageProps {
  vcccData: VCCCData;
  city: string;
  image: string;
}

export default function VCCCPage({ vcccData, city, image }: VCCCPageProps) {
  // Get current date without time for comparison
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const deadlines = {
    teamRegDeadline: vcccData.teamRegDeadline,
    threeCompSubDeadline: vcccData.threeCompSubDeadline,
    pitchDeckDeadline: vcccData.pitchDeckDeadline,
    semisTeamsAnnounced: vcccData.semisTeamsAnnounced,
    semisPresentationDeadline: vcccData.semisPresentationDeadline,
    finalsPresentationDeadline: vcccData.finalsPresentationDeadline,
  };

  // Static mapping of deadline keys to human-readable names
  // omit the semifinalist teams announcement since there's no timestamp and it's not a deadline.
  // this is the natural logical ordering -- if they want to change the competition details, we have to change the code.
  const deadlineNames: { [key: string]: string } = {
    teamRegDeadline: "Team Registration Deadline",
    threeCompSubDeadline: "Top 3 Companies Submission Deadline",
    pitchDeckDeadline: "Pitch Deck Deadline",
    semisPresentationDeadline: "Semifinal Presentation Submission",
    finalsPresentationDeadline: "Final Presentation Submission",
  };

  // Find the next event(s)
  const deadlineEntries = Object.entries(deadlines)
    .filter(([key]) => deadlineNames[key]) // Only include deadlines that have a name mapping
    .map(([key, date]) => ({
      key,
      date: new Date(date),
      name: deadlineNames[key] || key, // Use mapped name or fallback to key
    }));

  // Filter to future deadlines and sort by date
  const futureDeadlines = deadlineEntries
    .filter((deadline) => deadline.date >= now)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  // Get the next deadline
  const targetEvent = futureDeadlines.length > 0 ? futureDeadlines[0] : null;

  // Get prize amount from vcccData (with fallback)
  const prizeAmount = (vcccData as any).prizeAmount || null;

  // Parse and combine date and time for the target event
  const targetEventDate = targetEvent ? targetEvent.date.toISOString() : null;

  return (
    <div className="text-white">
      <Navbar />

      {/* Hero Section */}
      <HeroSection
        city={city}
        image={image}
        teamRegDeadline={vcccData.teamRegDeadline}
        registrationForm={vcccData.registrationForm}
      />

      {/* Countdown Section */}
      <div className="bg-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-4xl font-bold text-white">
              {targetEvent ? targetEvent.name : "Competition Over"}
            </h2>
            {targetEvent && (
              <div className="text-5xl font-bold text-white mb-8">
                {targetEvent.date.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            )}
            <CountdownTimer targetDate={targetEventDate} />
          </div>
        </div>
      </div>

      {/* Three Sections */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Learn Section */}
          <div className="text-center">
            <div className="flex items-center justify-center h-48 mb-4 bg-[#17A2FF]">
              <GraduationCap className="h-24 w-24 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Learn</h3>
            <p className="text-gray-300">
              Master the fundamentals of venture capital through hands-on
              experience
            </p>
          </div>

          {/* Network Section */}
          <div className="text-center">
            <div className="flex items-center justify-center h-48 mb-4 bg-[#17A2FF]">
              <Users className="h-24 w-24 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Network</h3>
            <p className="text-gray-300">
              Connect with industry professionals and fellow students
            </p>
          </div>

          {/* Win Section */}
          <div className="text-center">
            <div className="flex items-center justify-center h-48 mb-4 bg-[#17A2FF]">
              <Trophy className="h-24 w-24 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Win</h3>
            <p className="text-gray-300">
              {prizeAmount
                ? `Compete for a grand prize of ${prizeAmount} and gain recognition in the venture capital community`
                : "Compete for prizes and gain recognition in the venture capital community"}
            </p>
          </div>
        </div>

        {/* Questions Section */}
        <div className="text-center mt-16">
          <h3 className="text-3xl font-bold text-white mb-4">Questions?</h3>
          <p className="text-xl text-gray-300">
            <a
              href="mailto:info@ugrowthfund.com"
              className="text-[#17A2FF] hover:text-[#004A7C] transition-colors duration-300"
            >
              info@ugrowthfund.com
            </a>
          </p>
        </div>
      </div>

      {/* Competition Timeline Section */}
      <CompetitionTimeline vcccData={vcccData} city={city} />

      {/* Workshop Recordings Section */}
      <VideoRecordings vcccData={vcccData} city={city} />

      {/* FAQ Section */}
      <FAQ />
    </div>
  );
}
