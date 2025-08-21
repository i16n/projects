"use client";

import { SpotifyEpisode } from "@/lib/services/spotify";
import { PodcastEpisodeItem } from "./PodcastEpisodeItem";
import { useIsMobile } from "@/hooks/use-mobile";

interface PodcastEpisodesListProps {
  episodes: SpotifyEpisode[];
}

export function PodcastEpisodesList({ episodes }: PodcastEpisodesListProps) {
  const isMobile = useIsMobile();

  if (episodes.length === 0) {
    return null;
  }

  return (
    <div>
      <h3
        className={`${
          isMobile ? "text-xl" : "text-2xl"
        } font-montserrat mb-6 text-white`}
      >
        Latest Podcasts
      </h3>
      <div className={`space-y-${isMobile ? "3" : "4"}`}>
        {episodes.map((episode) => (
          <PodcastEpisodeItem key={episode.id} episode={episode} />
        ))}
      </div>
    </div>
  );
}
