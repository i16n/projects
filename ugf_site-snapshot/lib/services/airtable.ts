import Airtable from "airtable";
import { list } from "@vercel/blob";

const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
});

// Initialize a single base instance
const base = airtable.base(process.env.AIRTABLE_BASE_ID!);
const teamTableID = process.env.AIRTABLE_TEAM_TABLE_ID!;
const teamTableView = process.env.AIRTABLE_TEAM_TABLE_VIEW_ID!;
const dealsTableID = process.env.AIRTABLE_DEALS_TABLE_ID!;
const dealsTableView = process.env.AIRTABLE_DEALS_TABLE_VIEW_ID!;
const vcccTableID = process.env.AIRTABLE_VCCC_TABLE_ID!;
const vcccTableView = process.env.AIRTABLE_VCCC_TABLE_VIEW_ID!;
const AIRTABLE_API_BASE_URL = "https://api.airtable.com/v0";

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  school: string;
  degree: string;
  photo: string;
  bio: string;
  LinkedIn?: string;
  deals?: Deal[]; // Add deals property to TeamMember interface
  office: string;
}

export interface Deal {
  id: string;
  name: string;
  stage: string;
  logo: Array<{
    id: string;
    url: string;
  }>;
  stageInvested: string; // "Stage of Company (for website)"
  description: string; // "Description (for website)"
  website: string; // "Link to website"
  sector: string; // "Sector (for website)"
  status: "active" | "exited"; // implicit
  dealLeads: string[];
  jobs: string; // url to careers page of company
}

export interface AlumniMember {
  id: string;
  name: string;
  school: string;
  degree: string;
  LinkedIn?: string;
  firstJob?: string;
}

export interface VCCCData {
  ongoing: boolean;
  kickOffMeeting: string;
  kickOffVideoLink: string;
  sourcingTraining: string;
  sourcingTrainingVideoLink: string;
  dd1Training: string;
  dd1TrainingVideoLink: string;
  dd2Training: string;
  dd2TrainingVideoLink: string;
  regionalSemis: string;
  nationalFinals: string;
  teamRegDeadline: Date;
  threeCompSubDeadline: Date;
  pitchDeckDeadline: Date;
  semisTeamsAnnounced: Date; // no timestamp for this one
  semisPresentationDeadline: Date;
  finalsPresentationDeadline: Date;
  prize1: string;
  prize2: string;
  prize3: string;
  interestForm: string;
  registrationForm: string;
}

// Helper function to make Airtable API requests with automatic pagination
async function airtableFetch(endpoint: string, params?: URLSearchParams) {
  let allRecords: any[] = [];
  let offset: string | undefined;

  try {
    do {
      // Add offset to params if it exists
      const currentParams = new URLSearchParams(params);
      if (offset) {
        currentParams.set("offset", offset);
      }

      const url = `${AIRTABLE_API_BASE_URL}/${
        process.env.AIRTABLE_BASE_ID
      }/${endpoint}${currentParams.toString() ? `?${currentParams}` : ""}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error(
          "Airtable API error:",
          response.status,
          response.statusText
        );
        throw new Error(`Airtable API request failed: ${response.status}`);
      }

      const data = await response.json();

      allRecords = allRecords.concat(data.records);

      offset = data.offset; // This will be undefined when there are no more pages
    } while (offset); // do while loop to get all records

    // Return the data in the same format as the original single request
    return {
      records: allRecords,
    };
  } catch (error) {
    console.error("Error in airtableFetch:", error);
    return {
      records: [],
    };
  }
}

const getAllMembersPortcos = async (): Promise<Map<string, string[]>> => {
  // Get valid portfolio deals first
  const portfolioDeals = await getPortcoIDsandNames();

  const records = await base(teamTableID)
    .select({
      view: teamTableView,
      filterByFormula:
        "OR({Title} = 'Spring Interns', {Title} = 'Summer Interns', {Title} = 'Fall Interns', {Title} = 'Associates', {Title} = 'Sr Associates', {Title} = 'Analyst')",
    })
    .all();

  const portcoMap = new Map<string, string[]>();

  records.forEach((record) => {
    const memberId = record.id;
    const allPortcos = (record.get("Deals Participated On") as string[]) || [];
    // Filter to only include deals that exist in portfolioDeals
    const validPortcos = allPortcos.filter((dealId) =>
      portfolioDeals.has(dealId)
    );
    portcoMap.set(memberId, validPortcos);
  });

  return portcoMap;
};

const getPortcoIDsandNames = async (): Promise<Map<string, string>> => {
  const records = await base(dealsTableID)
    .select({
      view: dealsTableView,
      filterByFormula:
        "OR({Stage}='Portfolio - Fund I',{Stage}='Portfolio - Fund II',{Stage}='Exited')",
    })
    .all();

  const portcoMap = new Map<string, string>();

  records.forEach((record) => {
    const dealId = record.id;
    const dealName = cleanCompanyName(record.get("Name") as string);
    portcoMap.set(dealId, dealName);
  });

  return portcoMap;
};

export const getAllMembersDealsMapping = async (): Promise<
  Map<string, [string, string][]>
> => {
  // Get both data maps
  const membersPortcosMap = await getAllMembersPortcos(); // Map<memberId, dealIds[]>
  const portcoNamesMap = await getPortcoIDsandNames(); // Map<dealId, dealName>

  const membersDealsMapping = new Map<string, [string, string][]>();

  // Iterate through each member and their deal IDs
  membersPortcosMap.forEach((dealIds, memberId) => {
    const memberDeals: [string, string][] = [];

    dealIds.forEach((dealId) => {
      const portcoName = portcoNamesMap.get(dealId);
      if (portcoName) {
        memberDeals.push([dealId, portcoName]); // [portco id, portco name]
      }
    });

    membersDealsMapping.set(memberId, memberDeals);
  });

  return membersDealsMapping;
};

// used to populate portfolio page
export const fetchPortfolioCompanies = async (): Promise<Deal[]> => {
  try {
    console.log("Starting fetchPortfolioCompanies...");
    const portfolioJPGs = await getAllPortfolioJPGs();
    console.log("Portfolio JPGs fetched:", portfolioJPGs.size);

    // First fetch all team members (including alumni)
    const teamParams = new URLSearchParams({
      view: teamTableView,
    });

    const teamData = await airtableFetch(teamTableID, teamParams);
    console.log("Team data fetched:", teamData.records.length);

    // Create a map of team member IDs to their names
    const teamMemberMap = new Map<string, string>();
    teamData.records.forEach((record: any) => {
      teamMemberMap.set(record.id, record.fields.Name as string);
    });

    // Then fetch the deals using fetch
    const dealsParams = new URLSearchParams({
      view: dealsTableView,
      filterByFormula:
        "OR({Stage}='Portfolio - Fund I',{Stage}='Portfolio - Fund II',{Stage}='Exited')",
    });

    const dealsData = await airtableFetch(dealsTableID, dealsParams);
    console.log("Deals data fetched:", dealsData.records.length);

    const deals = dealsData.records.map((record: any) => {
      const dealLeadIds = Array.isArray(record.fields.Lead)
        ? (record.fields.Lead as string[])
        : [record.fields.Lead as string];

      const dealLeadNames = dealLeadIds
        .map((id) => teamMemberMap.get(id) || "Unknown Lead")
        .filter((name) => name !== "Unknown Lead");

      const photoUrl = portfolioJPGs.get(record.id);

      return {
        id: record.id,
        name: cleanCompanyName(record.fields.Name as string),
        stage: record.fields.Stage as string,
        logo: [
          {
            id: record.id,
            url: photoUrl || "/placeholder.svg",
          },
        ],
        stageInvested: record.fields[
          "Stage of Company (for website)"
        ] as string,
        description: record.fields["Description (for website)"] as string,
        website: record.fields["Link to Website"] as string,
        sector: record.fields["Sector (for website)"] as string,
        status: ((record.fields.Stage as string)?.includes("Exited")
          ? "exited"
          : "active") as "active" | "exited",
        dealLeads: dealLeadNames,
        jobs: record.fields["Jobs"] as string,
      };
    });

    console.log("Successfully processed deals:", deals.length);
    return deals;
  } catch (error) {
    console.error("Error in fetchPortfolioCompanies:", error);
    // Return empty array but log the error for debugging
    return [];
  }
};

// moved away from airtable fetch to base.select().all()
export const fetchActiveMembers = async (): Promise<TeamMember[]> => {
  try {
    const data = await base(teamTableID)
      .select({
        view: teamTableView,
        filterByFormula:
          "OR({Title} = 'Spring Interns', {Title} = 'Summer Interns', {Title} = 'Fall Interns', {Title} = 'Associates', {Title} = 'Sr Associates', {Title} = 'Analyst', {Title} = 'Management')",
      })
      .all();

    // Fetch all team photos once at the beginning
    const teamPhotosMap = await getAllTeamPhotos();

    const activeStudents: TeamMember[] = [];

    for (const record of data) {
      const rawTitle = record.fields.Title as string;
      const title = normalizeTitle(rawTitle);

      // Get photo from the pre-fetched photos map
      const photoUrl = teamPhotosMap.get(record.id);

      const teamMember: TeamMember = {
        id: record.id,
        name: record.get("Name") as string,
        title: title || "", // we can always expect a title due to filterByFormula... just avoiding an error here
        school: record.get("School") as string,
        degree: record.get("Degree") as string,
        photo: photoUrl || "/placeholder.svg", // if this is placeholder.svg either something went wrong with blob put service or the record really has no photo
        bio: record.get("Bio") as string,
        office: record.get("Office") as string,
      };

      if (record.get("LinkedIn")) {
        teamMember.LinkedIn = processLinkedInUrl(
          record.get("LinkedIn") as string
        );
      }
      activeStudents.push(teamMember);
    }

    return activeStudents;
  } catch (error) {
    return [];
  }
};

export const fetchAlumniMembers = async (): Promise<AlumniMember[]> => {
  try {
    const params = new URLSearchParams({
      view: process.env.AIRTABLE_TEAM_TABLE_VIEW_ID!,
      filterByFormula: "OR({Title} = 'Alumni', {Title} = 'Offboarding')",
    });

    const data = await airtableFetch(
      process.env.AIRTABLE_TEAM_TABLE_ID!,
      params
    );
    const alumniMembers: AlumniMember[] = [];

    for (const record of data.records) {
      const alumniMember: AlumniMember = {
        id: record.id,
        name: record.fields.Name as string,
        school: (record.fields.School as string) || "",
        degree: (record.fields.Degree as string) || "",
        firstJob: (record.fields["1st Job - Post Grad"] as string) || "-",
        LinkedIn: processLinkedInUrl(record.fields.LinkedIn as string) || "",
      };
      alumniMembers.push(alumniMember);
    }

    alumniMembers.sort((a, b) => a.name.localeCompare(b.name));
    return alumniMembers;
  } catch (error) {
    return [];
  }
};

export const fetchManagementTeam = async (): Promise<TeamMember[]> => {
  try {
    const params = new URLSearchParams({
      view: teamTableView,
      filterByFormula: "OR({Title} = 'Management')",
    });

    const data = await airtableFetch(teamTableID, params);

    // Fetch all team photos from blob storage (same as fetchActiveMembers)
    const teamPhotosMap = await getAllManagementPhotos();

    // we keep certain fields blank as we don't use them for management team members
    return data.records.map((record: any) => {
      // Get photo from blob storage instead of Airtable
      const photoUrl = teamPhotosMap.get(record.id);

      return {
        id: record.id,
        name: record.fields.Name as string,
        title: "",
        school: "",
        degree: "",
        photo: photoUrl || "/placeholder.svg",
        bio: record.fields.Bio as string,
        LinkedIn: processLinkedInUrl(record.fields.LinkedIn as string) || "",
        deals: [],
        office: "",
      };
    });
  } catch (error) {
    return [];
  }
};

// Fetches VCCC data
export const fetchVCCCData = async (office: string): Promise<VCCCData> => {
  try {
    const params = new URLSearchParams({
      view: vcccTableView,
      filterByFormula: `{Office} = '${office}'`,
    });

    const data = await airtableFetch(vcccTableID, params);

    // dates: teamRegDeadline, threeCompSubDeadline, pitchDeckDeadline, semisTeamsAnnounced, semisPresentationDeadline, finalsPresentationDeadline
    const vcccData = data.records.map((record: any) => {
      return {
        ongoing: record.fields.ongoing === "True",
        teamRegDeadline: new Date(record.fields.teamRegDeadline as string),
        kickOffMeeting: record.fields.kickOffMtg as string,
        kickOffVideoLink: record.fields.kickOffVideoLink as string,
        sourcingTraining: record.fields.sourcingTraining as string,
        sourcingTrainingVideoLink: record.fields
          .sourcingTrainingVideoLink as string,
        dd1Training: record.fields.dd1Training as string,
        dd1TrainingVideoLink: record.fields.dd1VideoLink as string,
        dd2Training: record.fields.dd2Training as string,
        dd2TrainingVideoLink: record.fields.dd2VideoLink as string,
        regionalSemis: record.fields.regionalSemis as string,
        nationalFinals: record.fields.nationalFinals as string,
        threeCompSubDeadline: new Date(
          record.fields.threeCompSubDeadline as string
        ),
        pitchDeckDeadline: new Date(record.fields.pitchDeckDeadline as string),
        semisTeamsAnnounced: new Date(
          record.fields.semisTeamsAnnounced as string
        ),
        semisPresentationDeadline: new Date(
          record.fields.semisPresentationDeadline as string
        ),
        finalsPresentationDeadline: new Date(
          record.fields.finalsPresentationDeadline as string
        ),
        prize1: record.fields.prize1 as string,
        prize2: record.fields.prize2 as string,
        prize3: record.fields.prize3 as string,
        interestForm: record.fields.interestForm as string,
        registrationForm: record.fields.registrationForm as string,
      };
    });
    return vcccData[0];
  } catch (error) {
    return {
      ongoing: false,
      teamRegDeadline: new Date(),
      kickOffMeeting: "",
      kickOffVideoLink: "",
      sourcingTraining: "",
      sourcingTrainingVideoLink: "",
      dd1Training: "",
      dd1TrainingVideoLink: "",
      dd2Training: "",
      dd2TrainingVideoLink: "",
      regionalSemis: "",
      nationalFinals: "",
      threeCompSubDeadline: new Date(),
      pitchDeckDeadline: new Date(),
      semisTeamsAnnounced: new Date(),
      semisPresentationDeadline: new Date(),
      finalsPresentationDeadline: new Date(),
      prize1: "",
      prize2: "",
      prize3: "",
      interestForm: "",
      registrationForm: "",
    };
  }
};

// ******* Helper Functions *******

// Function to fetch all team photos from Vercel Blob
async function getAllTeamPhotos(): Promise<Map<string, string>> {
  try {
    // List all files in the team folder
    const { blobs } = await list({
      prefix: "team/",
      limit: 1000, // Adjust as needed
    });

    const photosMap = new Map<string, string>();

    // Process each blob to create the mapping
    blobs.forEach((blob) => {
      // Extract the filename from the pathname (e.g., "team/ABC123.jpeg" -> "ABC123.jpeg")
      const filename = blob.pathname.split("/").pop()?.replace(".jpeg", "");
      // Add 'rec' prefix back to match Airtable record IDs... by way of historical accident, team member urls do NOT have the 'rec' prefix.
      photosMap.set(`rec${filename}`, blob.url);
    });

    return photosMap;
  } catch (error) {
    return new Map<string, string>();
  }
}

async function getAllManagementPhotos(): Promise<Map<string, string>> {
  try {
    // List all files in the management folder
    const { blobs } = await list({
      prefix: "management/",
      limit: 1000, // Adjust as needed
    });

    const photosMap = new Map<string, string>();

    // Process each blob to create the mapping
    blobs.forEach((blob) => {
      // Extract the filename from the pathname (e.g., "team/ABC123.jpeg" -> "ABC123.jpeg")
      const filename = blob.pathname.split("/").pop()?.replace(".jpeg", "");
      // Add 'rec' prefix back to match Airtable record IDs
      photosMap.set(`rec${filename}`, blob.url);
    });

    return photosMap;
  } catch (error) {
    return new Map<string, string>();
  }
}

// Function to fetch all portfolio photos from Vercel Blob
async function getAllPortfolioJPGs(): Promise<Map<string, string>> {
  try {
    console.log("Attempting to fetch portfolio photos from Vercel Blob...");

    // Check if blob storage environment is properly configured
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.warn("BLOB_READ_WRITE_TOKEN not found in environment variables");
      return new Map<string, string>();
    }

    // List all files in the portfolio folder
    const { blobs } = await list({
      prefix: "portfolio/",
      limit: 1000, // Adjust as needed
    });

    console.log("Blob storage response received:", blobs.length, "files found");
    const photosMap = new Map<string, string>();

    // Process each blob to create the mapping
    blobs.forEach((blob) => {
      // Extract the filename from the pathname (e.g., "portfolio/ABC123.jpeg" -> "ABC123.jpeg")
      const filename = blob.pathname.split("/").pop()?.replace(".jpeg", "");
      // By way of historical accident, portfolio urls have the rec prefix but team urls do not.
      photosMap.set(`${filename}`, blob.url);
    });

    console.log("Portfolio photos mapped:", photosMap.size);
    return photosMap;
  } catch (error) {
    console.error("Error fetching portfolio photos from Vercel Blob:", error);
    // Return empty map but continue with placeholder images
    return new Map<string, string>();
  }
}

// Normalizes team member titles
function normalizeTitle(title: string): string | null {
  switch (title) {
    case "Spring Interns":
    case "Summer Interns":
    case "Fall Interns":
      return "Intern";
    case "Associates":
      return "Associate";
    case "Sr Associates":
      return "Senior Associate";
    case "Analyst":
      return "Analyst";
    case "Alumni":
    case "Offboarding":
    case "Away on Internship":
      return null;
    default:
      return title;
  }
}

// Cleans company names by removing year numbers at the end (e.g., "OpenAI 2024" -> "OpenAI")
// But preserves numbers that are part of the name (e.g., "Nurses 24/7" remains unchanged)
export function cleanCompanyName(name: string): string {
  // Check if the name ends with a space followed by a number
  const match = name.match(/^(.*)\s+(\d+)$/);

  // If there's a match and the second group is just digits (no slashes, etc.)
  if (match && /^\d+$/.test(match[2])) {
    return match[1].trim();
  }

  // Otherwise return the original name
  return name;
}

// Processes LinkedIn URLs to ensure they have https:// prefix
function processLinkedInUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;

  // If it already starts with http:// or https://, return as is
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // If it starts with www., add https://
  if (url.startsWith("www.")) {
    return `https://${url}`;
  }

  return undefined; // no LinkedIn provided
}
