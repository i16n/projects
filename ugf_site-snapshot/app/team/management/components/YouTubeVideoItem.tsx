"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { PlaySquare } from "lucide-react";
import type { YouTubeVideo } from "@/lib/services/youtube";
import { useIsMobile } from "@/hooks/use-mobile";

interface YouTubeVideoItemProps {
  video: YouTubeVideo;
}

export function YouTubeVideoItem({ video }: YouTubeVideoItemProps) {
  const isMobile = useIsMobile();
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    // Set truncation based on mobile state
    setIsTruncated(!!isMobile);
  }, [isMobile]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Function to decode HTML entities without using document
  const decodeHtmlEntities = (text: string) => {
    if (typeof window === "undefined") {
      // Server-side fallback - handle basic entities
      return text
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&#39;/g, "'");
    }

    // Client-side method
    const textArea = document.createElement("textarea");
    textArea.innerHTML = text;
    return textArea.value;
  };

  return (
    <a
      href={`https://www.youtube.com/watch?v=${video.videoId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <div className="bg-gray-700 p-4 flex items-start gap-4 hover:bg-gray-600 transition-colors">
        <div className="flex-shrink-0">
          <Image
            src={video.thumbnail}
            alt={video.title}
            width={isMobile ? 120 : 160}
            height={isMobile ? 68 : 90}
          />
        </div>
        <div
          className={`flex-grow overflow-hidden ${
            isMobile ? "max-w-[180px] sm:max-w-[220px]" : ""
          }`}
        >
          <h4
            className={`font-montserrat ${
              isMobile ? "text-base" : "text-lg"
            } mb-1 text-[#B2E0FF] ${
              isMobile ? "line-clamp-2" : isTruncated ? "truncate" : ""
            }`}
          >
            {decodeHtmlEntities(video.title)}
          </h4>
          <p className="text-sm text-gray-400 mb-2">
            {formatDate(video.publishedAt)}
          </p>
        </div>
        <div
          className="flex-shrink-0 p-2 text-red-400 hover:text-red-300 transition-colors ml-auto"
          title="Watch on YouTube"
        >
          <PlaySquare size={isMobile ? 20 : 24} />
        </div>
      </div>
    </a>
  );
}
