import axios, { isAxiosError } from "axios";

import {
  getCurrentTimestampStr,
  loadPrivateKeyFromEnv,
  signPssText,
} from "./kalshiAuth";

// need to check response format from Kalshi API
interface IKalshiEvent {
  market: {
    title: string;
    yes_sub_title: string;
    last_price: number;
  };
}

/**
 * Fetches the market data from the Kalshi API. Going to attempt to fetch all markets
 * @param market - the market to fetch
 * @returns {Promise<IKalshiEvent>} - the market data
 */
export const fetchKalshiMarket = async (
  market: string
): Promise<IKalshiEvent> => {
  // consists of base url and path
  const API_URL = "https://api.elections.kalshi.com/";

  const API_KEY = process.env.KALSHI_ACCESS_KEY;

  const timestampStr = getCurrentTimestampStr();
  const privateKey = loadPrivateKeyFromEnv(); // creates a crypto.KeyObject

  const method = "GET";
  const path = `trade-api/v2/markets/${market}`;
  const msgString = timestampStr + method + path;
  const fullURL = API_URL + path;

  const sig = signPssText(privateKey, msgString);

  const options = {
    method: "GET",
    headers: {
      "KALSHI-ACCESS-KEY": API_KEY,
      "KALSHI-ACCESS-SIGNATURE": sig,
      "KALSHI-ACCESS-TIMESTAMP": timestampStr,
      "Content-type": "application/json",
    },
    params: {
      limit: "1",
    },
  };

  try {
    const { data } = await axios.get<IKalshiEvent>(fullURL, options);

    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
    } else {
      console.error("Error fetching data from Kalshi API:", error);
    }

    return { market: { last_price: 0, yes_sub_title: "N/A", title: "N/A" } }; // Return valid IKalshiEvent object
  }
};
