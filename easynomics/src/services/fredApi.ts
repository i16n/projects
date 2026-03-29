import axios from "axios";

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

/**
 * Fetches the FRED API key from the environment variables
 * @returns {string} - the FRED API key
 */
const getFredApiKey = (): string => {
  if (!process.env.FRED_API_KEY) {
    throw new Error(
      "NEXT_PUBLIC_FRED_API_KEY is not set in the environment variables."
    );
  }

  return process.env.FRED_API_KEY;
};

/**
 * Fetches one data point, the latest data from the FRED API
 * @param seriesId - the series ID to fetch
 * @returns {Promise<IFREDObservation[]>} - the latest data
 */
export const fetchLatestFRED = async (seriesId: string) => {
  const API_URL = "https://api.stlouisfed.org/fred/series/observations";
  const API_KEY = getFredApiKey();

  const params = {
    api_key: API_KEY,
    file_type: "json",
    series_id: seriesId,
    sort_order: "desc",
    limit: 1,
  };

  const { data } = await axios.get<IFREDResponse>(API_URL, { params });

  return data.observations[0];
};

/**
 * Fetches one data point, the latest data from the FRED API
 * @param seriesId - the series ID to fetch
 * @returns {Promise<IFREDObservation[]>} - the latest data
 */
export const fetchLatestFREDPctChg = async (seriesId: string) => {
  const API_URL = "https://api.stlouisfed.org/fred/series/observations";
  const API_KEY = getFredApiKey();

  const params = {
    api_key: API_KEY,
    file_type: "json",
    series_id: seriesId,
    sort_order: "desc",
    limit: 1,
    units: "pc1",
  };

  const { data } = await axios.get<IFREDResponse>(API_URL, { params });

  return data.observations[0];
};

/**
 * Fetches historical data from the FRED API via a parameter
 * @param seriesId - the series ID to fetch
 * @param observationStart - the start date to fetch
 * @returns {Promise<IFREDObservation[]>} - the historical data
 */
export const fetchHistoricalFRED = async (
  seriesId: string,
  observationStart: string
) => {
  const API_URL = "https://api.stlouisfed.org/fred/series/observations";
  const API_KEY = getFredApiKey();

  const params = {
    api_key: API_KEY,
    file_type: "json",
    series_id: seriesId,
    observation_start: observationStart,
    frequency: "q",
  };

  const { data } = await axios.get<IFREDResponse>(API_URL, { params });

  return data.observations.map(({ date, value }) => ({
    date: new Date(date).toISOString(),
    value: +value,
  }));
};

/**
 * Fetches one data point from the FRED API for a specific date
 * @param seriesId - the series ID to fetch
 * @param date - the specific date to fetch (YYYY-MM-DD format)
 * @returns {Promise<IFREDObservation | undefined>} - the data for the specified date
 */
export const fetchFREDByDate = async (seriesId: string, date: string) => {
  const API_URL = "https://api.stlouisfed.org/fred/series/observations";
  const API_KEY = getFredApiKey();

  const params = {
    api_key: API_KEY,
    file_type: "json",
    series_id: seriesId,
    observation_start: date,
    observation_end: date,
  };

  const { data } = await axios.get<IFREDResponse>(API_URL, { params });

  return data.observations[0];
};
