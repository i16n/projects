import axios from "axios";

import { env } from "@/lib/env";

interface IFREDObservation {
  realtime_start: string;
  realtime_end: string;
  date: string;
  value: number;
}

interface IFREDResponse {
  realtime_start: string;
  realtime_end: string;
  observation_start: string;
  observation_end: string;
  units: string;
  output_type: number;
  file_type: string;
  order_by: string;
  sort_order: string;
  count: number;
  offset: number;
  limit: number;
  observations: IFREDObservation[];
}

const FRED_API_URL = "https://api.stlouisfed.org/fred/series/observations";

/**
 * Fetches one data point, the latest data from the FRED API
 */
export async function getLatestFREDData(
  seriesId: string
): Promise<{ date: string; value: number }> {
  if (!env.FRED_API_KEY) {
    throw new Error("FRED_API_KEY is not configured");
  }

  const params = {
    api_key: env.FRED_API_KEY,
    file_type: "json",
    series_id: seriesId,
    sort_order: "desc",
    limit: 1,
  };

  try {
    const { data } = await axios.get<IFREDResponse>(FRED_API_URL, { params });
    const observation = data.observations[0];

    return {
      date: observation.date,
      value: Number(observation.value),
    };
  } catch (error) {
    console.error("Error fetching FRED data:", error);
    throw new Error("Failed to fetch FRED data");
  }
}

/**
 * Fetches historical data from the FRED API
 */
export async function getHistoricalFREDData(
  seriesId: string,
  observationStart: string
): Promise<Array<{ date: string; value: number }>> {
  if (!env.FRED_API_KEY) {
    throw new Error("FRED_API_KEY is not configured");
  }

  const params = {
    api_key: env.FRED_API_KEY,
    file_type: "json",
    series_id: seriesId,
    observation_start: observationStart,
    frequency: "q",
  };

  try {
    const { data } = await axios.get<IFREDResponse>(FRED_API_URL, { params });

    return data.observations.map(({ date, value }) => ({
      date: new Date(date).toISOString(),
      value: Number(value),
    }));
  } catch (error) {
    console.error("Error fetching historical FRED data:", error);
    throw new Error("Failed to fetch historical FRED data");
  }
}
