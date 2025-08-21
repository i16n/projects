"use client";

import { YouTubeVideo } from "@/lib/services/youtube";
import { YouTubeVideoItem } from "./YouTubeVideoItem";
import { useIsMobile } from "@/hooks/use-mobile";

interface YouTubeVideosListProps {
  videos: YouTubeVideo[];
}

export function YouTubeVideosList({ videos }: YouTubeVideosListProps) {
  const isMobile = useIsMobile();

  if (videos.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h3
        className={`${
          isMobile ? "text-xl" : "text-2xl"
        } font-montserrat mb-6 text-white`}
      >
        Latest Videos
      </h3>
      <div className={`space-y-${isMobile ? "3" : "4"}`}>
        {videos.map((video) => (
          <YouTubeVideoItem key={video.videoId} video={video} />
        ))}
      </div>
    </div>
  );
}
