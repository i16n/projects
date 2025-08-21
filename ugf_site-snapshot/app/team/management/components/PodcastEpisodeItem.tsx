"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import type { SpotifyEpisode } from "@/lib/services/spotify";
import { useIsMobile } from "@/hooks/use-mobile";

interface PodcastEpisodeItemProps {
  episode: SpotifyEpisode;
}

export function PodcastEpisodeItem({ episode }: PodcastEpisodeItemProps) {
  const isMobile = useIsMobile();
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    // Set truncation based on mobile state
    setIsTruncated(!!isMobile);
  }, [isMobile]);

  return (
    <a
      href={episode.external_urls.spotify}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <div className="bg-gray-700 p-4 flex items-start gap-4 hover:bg-gray-600 transition-colors">
        <div className="flex-shrink-0">
          {episode.images[0] && (
            <Image
              src={episode.images[0].url}
              alt={episode.name}
              width={isMobile ? 60 : 160} // to match the youtube width
              height={isMobile ? 60 : 160}
            />
          )}
        </div>
        <div
          className={`flex-grow overflow-hidden ${
            isMobile ? "max-w-[180px] sm:max-w-[220px]" : ""
          }`}
        >
          <h4
            className={`font-medium ${
              isMobile ? "text-base" : "text-lg"
            } mb-1 text-[#B2E0FF] ${
              isMobile ? "line-clamp-2" : isTruncated ? "truncate" : ""
            }`}
          >
            {episode.name}
          </h4>
          <p className="text-sm text-gray-400 mb-2">
            {new Date(episode.release_date).toLocaleDateString()}
          </p>
          {!isTruncated && (
            <p className="text-sm text-gray-300 line-clamp-2">
              {episode.description}
            </p>
          )}
        </div>
        <div
          className="flex-shrink-0 p-2 text-[#17A2FF] hover:text-[#B2E0FF] transition-colors ml-auto"
          title="Listen on Spotify"
        >
          <Play size={isMobile ? 20 : 24} />
        </div>
      </div>
    </a>
  );
}
