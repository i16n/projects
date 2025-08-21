import axios from "axios";

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface SpotifyEpisode {
  id: string;
  name: string;
  description: string;
  release_date: string;
  duration_ms: number;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  external_urls: {
    spotify: string;
  };
}

interface SpotifyShowEpisodesResponse {
  items: SpotifyEpisode[];
  total: number;
  limit: number;
  offset: number;
}

export class SpotifyService {
  private static instance: SpotifyService;
  private accessToken: string | null = null;
  private tokenExpirationTime: number | null = null;

  public static getInstance(): SpotifyService {
    if (!SpotifyService.instance) {
      SpotifyService.instance = new SpotifyService();
    }
    return SpotifyService.instance;
  }

  private async getAccessToken(): Promise<string> {
    if (
      this.accessToken &&
      this.tokenExpirationTime &&
      Date.now() < this.tokenExpirationTime
    ) {
      return this.accessToken;
    }

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error("Spotify credentials are not configured");
    }

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    try {
      const response = await axios.post<SpotifyTokenResponse>(
        "https://accounts.spotify.com/api/token",
        "grant_type=client_credentials",
        {
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpirationTime = Date.now() + response.data.expires_in * 1000;
      return this.accessToken;
    } catch (error) {
      return "something went wrong :(";
    }
  }

  public async getLatestPodcastEpisodes(
    showId: string,
    limit: number = 5
  ): Promise<SpotifyEpisode[]> {
    try {
      const token = await this.getAccessToken();
      const response = await axios.get<SpotifyShowEpisodesResponse>(
        `https://api.spotify.com/v1/shows/${showId}/episodes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            limit,
            offset: 0,
            market: "US",
          },
        }
      );

      return response.data.items;
    } catch (error) {
      throw error;
    }
  }
}

// Export a singleton instance
export const spotifyService = SpotifyService.getInstance();
