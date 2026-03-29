"use client";

/**
 * @file Client component for displaying economic indicators
 * @author Isaac Huntsman <isaacjhuntsman@gmail.com>
 */

import styles from "./HomePage.module.css";
import YieldCurveChart from "./yieldCurveChart";

interface IHomePageProps {
  unemploymentRate: {
    date: string;
    value: number;
  };
  histYieldCurve: { date: string; value: number }[];
  householdDSR: { date: string; value: number };
  zhvi: { date: string; value: number };
  mRate: { date: string; value: number };
  hhincome: { date: string; value: number };
  latestYC: { date: string; value: number };
  consumerSentiment: { date: string; value: number };
  interestRate: { date: string; value: number };
  histHHDSR: { date: string; value: number }[];
  HHDSR: { HHDSRDate: string; HHDSRValue: number };
  sixMonthEmp: { value: number };
  oneMonthEmp: { value: number };
  KXFEDDECISIONData: { last_price: number; title: string };
  fedfunds: { value: number };
}

/**
 * Renders the home page with various economic indicators, metrics, and a yield curve chart
 */
export default function HomePage({
  unemploymentRate,
  histYieldCurve,
  HHDSR,
  histHHDSR,
  mRate,
  hhincome,
  latestYC,
  consumerSentiment,
  interestRate,
  fedfunds,
  sixMonthEmp,
  oneMonthEmp,
  KXFEDDECISIONData,
}: IHomePageProps) {
  const { HHDSRValue } = HHDSR;
  // const { date: zhviDate, value: zhviValue } = zhvi;
  const { value: mrateValue } = mRate;
  const { date: hhincomeDate, value: hhincomeValue } = hhincome;
  const { value: latestYCValue } = latestYC;
  const { date: umcsDate, value: umcsValue } = consumerSentiment;
  const { value: rateValue } = interestRate;
  const { value: unempvalue } = unemploymentRate;
  const { value: sixMonthEmpValue } = sixMonthEmp;
  const { value: fedfundsValue } = fedfunds;
  const { value: oneMonthEmpValue } = oneMonthEmp;
  const { last_price: KXFEDDECISIONLastPriceValue, title: KXFEDDECISIONTitle } =
    KXFEDDECISIONData;

  const formattedInterestRate = Number(rateValue).toFixed(2);

  const oneMonthUnempChg = unempvalue - oneMonthEmpValue;
  const oneMonthFormattedUnempChg = Number(oneMonthUnempChg.toFixed(2));

  const sixMonthUnempChg = unempvalue - sixMonthEmpValue;
  const sixMonthFormattedUnempChg = Number(sixMonthUnempChg.toFixed(2));
  const formattedHHDSR = Number(HHDSRValue).toFixed(2);

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>US economy snapshot</h1>
      <h2>
        The fed responds to unemployment and inflation (hiking rates cools down
        economy and combats inflation). It targets a 2% inflation rate.
        Inflation is currently at{" "}
        <span className={styles.value}>{formattedInterestRate}%</span>
      </h2>
      <h2>
        The fed generally optimizes for &quot;maximum employment&quot;; when
        unemployment is around 4%. Unemployment is currently at{" "}
        <span className={styles.value}>{unempvalue}%</span>, an incremental
        change of{" "}
        <span className={styles.value}>{oneMonthFormattedUnempChg}%</span> from
        1 month ago, and{" "}
        <span className={styles.value}>{sixMonthFormattedUnempChg}%</span> from
        6 months ago.
      </h2>
      <h2>
        Due to the factors above, Kalshi puts the probability of &quot;
        <span className={styles.value}>{KXFEDDECISIONTitle}</span>&quot; at{" "}
        <span className={styles.value}>{KXFEDDECISIONLastPriceValue}%</span>.
        The current effective fed funds rate is{" "}
        <span className={styles.value}>{fedfundsValue}%</span>. (Avg. Nat&apos;l
        Mortgage Rate @ <span className={styles.value}>{mrateValue}%</span>).
      </h2>
      <div>
        <h2>
          Latest Yield Curve is at{" "}
          <span className={styles.value}>{latestYCValue}</span> (10 yr - 2 yr),
          signaling that investors have{" "}
          <span className={styles.value}>
            expectations of moderate economic growth
          </span>{" "}
          in the near term. Based on trailing 2 year data, this can be seen as{" "}
          <span className={styles.value}>
            recovering from inversion or stabilizing
          </span>
          . Compared to last 10 years:
        </h2>
        <YieldCurveChart data={histYieldCurve} />
        <h2>
          Consumer Sentiment is at{" "}
          <span className={styles.value}>{umcsValue}</span> (as of{" "}
          <span className={styles.date}>{umcsDate}</span>), implying that
          consumers are{" "}
          <span className={styles.value}>cautious or uncertain (70-90) </span>{" "}
          on the future of the US economy.
        </h2>
        <h2>
          Household Debt Service Ratio is at{" "}
          <span className={styles.value}>{formattedHHDSR}%</span>. This includes
          credit card and mortgage debt; it&apos;s a measure of how levered US
          households are. Compared to the last 10 years:
        </h2>
        <YieldCurveChart data={histHHDSR} />
        {/* <h1>
          ZHVI is at <span className={styles.value}>{zhviValue}</span> (as of{" "}
          <span className={styles.date}>{zhviDate}</span>)
        </h1> */}
        <h2>
          HH Income is at <span className={styles.value}>{hhincomeValue}</span>{" "}
          (as of <span className={styles.date}>{hhincomeDate}</span>)
        </h2>
        {/* Render additional datasets here if needed */}
      </div>
    </main>
  );
}
