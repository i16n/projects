let userConfig = undefined;
try {
  userConfig = await import("./v0-user-next.config");
} catch (e) {
  // ignore error
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      "v5.airtableusercontent.com",
      "i.ytimg.com",
      "i.scdn.co",
      "mosaic.scdn.co",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
    minimumCacheTTL: 604800, // 7 days
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  env: {
    SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
    SPOTIFY_VENTURE_CAPITAL_SHOW_ID:
      process.env.SPOTIFY_VENTURE_CAPITAL_SHOW_ID,
    AIRTABLE_BASE_ID: process.env.AIRTABLE_BASE_ID,
    AIRTABLE_TEAM_TABLE_ID: process.env.AIRTABLE_TEAM_TABLE_ID,
    AIRTABLE_TEAM_TABLE_VIEW_ID: process.env.AIRTABLE_TEAM_TABLE_VIEW_ID,
    AIRTABLE_DEALS_TABLE_ID: process.env.AIRTABLE_DEALS_TABLE_ID,
    AIRTABLE_DEALS_TABLE_VIEW_ID: process.env.AIRTABLE_DEALS_TABLE_VIEW_ID,
    AIRTABLE_VCCC_TABLE_ID: process.env.AIRTABLE_VCCC_TABLE_ID,
    AIRTABLE_VCCC_TABLE_VIEW_ID: process.env.AIRTABLE_VCCC_TABLE_VIEW_ID,
  },
};

mergeConfig(nextConfig, userConfig);

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) {
    return;
  }

  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === "object" &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      };
    } else {
      nextConfig[key] = userConfig[key];
    }
  }
}

export default nextConfig;
