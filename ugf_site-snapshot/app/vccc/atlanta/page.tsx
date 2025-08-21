import { fetchVCCCData } from "@/lib/services/airtable";
import VCCCPage from "../components/VCCCPage";
import { redirect } from "next/navigation";

export const revalidate = 60; // 1 minute in seconds

export default async function AtlantaVCCCPage() {
  const vcccData = await fetchVCCCData("Atlanta");
  if (!vcccData.ongoing) {
    redirect(`/vccc/tbd?city=Atlanta&interestForm=${vcccData.interestForm}`);
  }

  return (
    <VCCCPage
      vcccData={vcccData}
      city="Atlanta"
      image="/officeImages/atl.webp"
    />
  );
}
