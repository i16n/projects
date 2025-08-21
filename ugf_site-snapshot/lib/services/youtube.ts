const API_KEY = process.env.YOUTUBE_API_KEY || "";
const CHANNEL_ID = process.env.SPOTIFY_CHANNEL_ID || ""; // YouTube channel ID
const MAX_RESULTS = 5;

export interface YouTubeVideo {
  title: string;
  videoId: string;
  publishedAt: string;
  thumbnail: string;
}

// Function to decode HTML entities server-side.
function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x2F;/g, "/")
    .replace(/&#x27;/g, "'")
    .replace(/&#x60;/g, "`");
}

export async function fetchLatestVideos(): Promise<YouTubeVideo[]> {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=${MAX_RESULTS}&order=date&type=video&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();

    const videos = data.items.map((item: any) => ({
      title: decodeHtmlEntities(item.snippet.title),
      videoId: item.id.videoId,
      publishedAt: item.snippet.publishedAt,
      thumbnail: item.snippet.thumbnails.high.url,
    }));

    return videos;
  } catch (error) {
    return [];
  }
}
