import { fetchVCCCData } from "@/lib/services/airtable";
import VCCCPage from "../components/VCCCPage";
import { redirect } from "next/navigation";

export const revalidate = 60; // 1 minute in seconds

export default async function SanDiegoVCCCPage() {
  const vcccData = await fetchVCCCData("SanDiego");
  if (!vcccData.ongoing) {
    redirect(`/vccc/tbd?city=San Diego&interestForm=${vcccData.interestForm}`);
  }

  return (
    <VCCCPage
      vcccData={vcccData}
      city="San Diego"
      image="/officeImages/sd.webp"
    />
  );
}
