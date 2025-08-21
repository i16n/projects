import { fetchVCCCData } from "@/lib/services/airtable";
import VCCCPage from "../components/VCCCPage";
import { redirect } from "next/navigation";

export const revalidate = 60; // 1 minute in seconds

export default async function UtahVCCCPage() {
  const vcccData = await fetchVCCCData("SaltLake");

  if (!vcccData.ongoing) {
    redirect(`/vccc/tbd?city=Salt Lake&interestForm=${vcccData.interestForm}`);
  }

  return (
    <VCCCPage
      vcccData={vcccData}
      city="Salt Lake"
      image="/officeImages/slc.webp"
    />
  );
}
