import { fetchManagementTeam } from "@/lib/services/airtable";
import { spotifyService } from "@/lib/services/spotify";
import type { SpotifyEpisode } from "@/lib/services/spotify";
import { fetchLatestVideos } from "@/lib/services/youtube";
import type { YouTubeVideo } from "@/lib/services/youtube";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Linkedin } from "lucide-react";
import { PodcastEpisodesList } from "../components/PodcastEpisodesList";
import { YouTubeVideosList } from "../components/YouTubeVideosList";

// Helper function to convert name to URL slug
function nameToSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

export const revalidate = 86400; // 24 hours in seconds

// This generates the static paths for all management team members
export async function generateStaticParams() {
  const members = await fetchManagementTeam();

  return members.map((member) => ({
    id: nameToSlug(member.name),
  }));
}

export default async function ManagementMemberPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const members = await fetchManagementTeam();
  const member = members.find((m) => nameToSlug(m.name) === id);

  if (!member) {
    notFound();
  }

  // Fetch podcast episodes and YouTube videos if this is Peter's page
  let podcastEpisodes: SpotifyEpisode[] = [];
  let youtubeVideos: YouTubeVideo[] = [];

  if (id === "peter-harris") {
    try {
      // Fetch YouTube videos
      youtubeVideos = await fetchLatestVideos();

      // Fetch podcast episodes
      const showId = process.env.SPOTIFY_VENTURE_CAPITAL_SHOW_ID;
      if (showId) {
        podcastEpisodes = await spotifyService.getLatestPodcastEpisodes(showId);
      }
    } catch (error) {}
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <div className="mb-8">
        <Link
          href="/team"
          className="text-[#17A2FF] hover:text-[#B2E0FF] flex items-center gap-2 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Team</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Large photo column */}
        <div className="lg:col-span-1 flex flex-col">
          <div className="overflow-hidden shadow-xl h-full">
            <Image
              src={member.photo}
              alt={member.name}
              width={600}
              height={600}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        </div>

        {/* Member info column */}
        <div className="lg:col-span-2 flex flex-col">
          <div className="bg-black p-6 h-full flex flex-col border-b border-white">
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-white text-3xl md:text-4xl font-bold">
                {member.name}
              </h1>

              {/* LinkedIn icon */}
              {member.LinkedIn && (
                <a
                  href={member.LinkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#17A2FF] hover:text-[#B2E0FF] transition-colors"
                  title="LinkedIn"
                >
                  <Linkedin size={24} />
                </a>
              )}
            </div>

            {/* Bio */}
            <div className="prose prose-lg prose-invert">
              <p className="whitespace-pre-line text-gray-200 font-mono text-lg leading-relaxed mt-6">
                {member.bio}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* YouTube Videos Section - Only shows for Peter Harris */}
      {id === "peter-harris" && youtubeVideos.length > 0 && (
        <YouTubeVideosList videos={youtubeVideos} />
      )}

      {/* Podcast Episodes Section - Only shows for Peter Harris */}
      {id === "peter-harris" && (
        <PodcastEpisodesList episodes={podcastEpisodes} />
      )}
    </div>
  );
}
