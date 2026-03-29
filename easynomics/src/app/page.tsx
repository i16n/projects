import { isAxiosError } from "axios";

import { fetchKalshiMarket } from "@/services/kalshiApi";

import HomePage from "../components/HomePage"; // Assuming you'll move HomePage to components
import {
  fetchFREDByDate,
  fetchHistoricalFRED,
  fetchLatestFRED,
  fetchLatestFREDPctChg,
} from "../services/fredApi";

/**
 * Helper function to get a formatted date from X months ago, always returning the first day of the month
 */
function getFormattedDateFromMonthsAgo(monthsAgo: number): string {
  const date = new Date();

  date.setMonth(date.getMonth() - monthsAgo);
  date.setDate(1); // Set to first day of the month

  return date.toISOString().split("T")[0];
}

/**
 * Server Component that fetches data and renders the HomePage
 */
export default async function Home() {
  try {
    const unempRate = await fetchLatestFRED("UNRATE");
    const { date: unempdate, value: unempvalue } = unempRate;

    const formattedDate10y = getFormattedDateFromMonthsAgo(120); // 10 years * 12 months

    const histYieldCurve = await fetchHistoricalFRED(
      "T10Y2Y",
      formattedDate10y
    );
    const histHHDSR = await fetchHistoricalFRED("TDSP", formattedDate10y);

    const { date: HHDSRDate, value: HHDSRValue } =
      await fetchLatestFRED("TDSP");
    const { date: zhviDate, value: zhviValue } = await fetchLatestFRED(
      "USAUCSFRCONDOSMSAMID"
    );
    const { date: mrateDate, value: mrateValue } =
      await fetchLatestFRED("MORTGAGE30US");
    const { date: hhincomeDate, value: hhincomeValue } =
      await fetchLatestFRED("MEHOINUSA646N");
    const { date: latestYCDate, value: latestYCValue } =
      await fetchLatestFRED("T10Y2Y");
    const { date: consumerSentimentDate, value: consumerSentimentValue } =
      await fetchLatestFRED("UMCSENT");
    const { date: interestRateDate, value: interestRateValue } =
      await fetchLatestFREDPctChg("CPIAUCSL");
    const { value: fedfundsValue } = await fetchLatestFRED("FEDFUNDS");

    // 7 months back hardcoded for now because FRED doesn't have data for 1/2025 yet
    const sixMonthEmpDate = getFormattedDateFromMonthsAgo(7);
    const { value: sixMonthEmp } = await fetchFREDByDate(
      "UNRATE",
      sixMonthEmpDate
    );

    // 2 months back hardcoded for now because FRED doesn't have data for 1/2025 yet
    const oneMonthEmpDate = getFormattedDateFromMonthsAgo(2);
    const { value: oneMonthEmp } = await fetchFREDByDate(
      "UNRATE",
      oneMonthEmpDate
    );

    const {
      market: { last_price, title },
    } = await fetchKalshiMarket("KXFEDDECISION-25MAR-H0");
    const props = {
      fedfunds: { value: fedfundsValue },
      sixMonthEmp: { value: sixMonthEmp },
      oneMonthEmp: { value: oneMonthEmp },
      unemploymentRate: { date: unempdate, value: unempvalue },
      householdDSR: { date: HHDSRDate, value: HHDSRValue },
      zhvi: { date: zhviDate, value: zhviValue },
      mRate: { date: mrateDate, value: mrateValue },
      hhincome: { date: hhincomeDate, value: hhincomeValue },
      latestYC: { date: latestYCDate, value: latestYCValue },
      consumerSentiment: {
        date: consumerSentimentDate,
        value: consumerSentimentValue,
      },
      interestRate: { date: interestRateDate, value: interestRateValue },
      histYieldCurve: histYieldCurve,
      histHHDSR: histHHDSR,
      HHDSR: { HHDSRDate, HHDSRValue },
      KXFEDDECISIONData: { last_price: last_price, title: title },
      // ... other commented props can be added back similarly
    };

    return <HomePage {...props} />;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
    } else {
      console.error("Error fetching data from FRED or Kalshi API:", error);
    }

    // Return error state props
    return (
      <HomePage
        unemploymentRate={{ date: "N/A", value: 0 }}
        histYieldCurve={[{ date: "N/A", value: 0 }]}
        fedfunds={{ value: 0 }}
        householdDSR={{ date: "N/A", value: 0 }}
        zhvi={{ date: "N/A", value: 0 }}
        mRate={{ date: "N/A", value: 0 }}
        hhincome={{ date: "N/A", value: 0 }}
        latestYC={{ date: "N/A", value: 0 }}
        consumerSentiment={{ date: "N/A", value: 0 }}
        interestRate={{ date: "N/A", value: 0 }}
        histHHDSR={[{ date: "N/A", value: 0 }]}
        HHDSR={{ HHDSRDate: "N/A", HHDSRValue: 0 }}
        sixMonthEmp={{ value: 0 }}
        oneMonthEmp={{ value: 0 }}
        KXFEDDECISIONData={{ last_price: 0, title: "N/A" }}
        // ... other error state props
      />
    );
  }
}
