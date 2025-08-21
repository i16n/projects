import { createClient } from "redis";

// In development, Node.js can clear the require cache on every change,
// so we use a global variable to preserve the client across hot-reloads.
declare const global: {
  redisClient?: ReturnType<typeof createClient>;
};

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error("REDIS_URL is not defined in the environment variables.");
}

let redis: ReturnType<typeof createClient>;

if (process.env.NODE_ENV === "production") {
  redis = createClient({ url: redisUrl });
  console.log("redis client created in production");
} else {
  if (!global.redisClient) {
    global.redisClient = createClient({ url: redisUrl });
  }
  redis = global.redisClient;
}

redis.on("error", (err) => {
  console.error("Redis Client Error", err);
});

// Lazy connection helper
export const ensureRedisConnection = async () => {
  if (!redis.isOpen) {
    await redis.connect();
  }
  return redis;
};

// Immediate disconnect strategy - connection is closed after each operation

// Wrapper function for Redis operations that handles connection lifecycle
export const withRedis = async <T>(
  operation: (client: typeof redis) => Promise<T>
): Promise<T> => {
  const client = await ensureRedisConnection();
  try {
    const result = await operation(client);
    return result;
  } finally {
    // Close connection immediately after operation
    if (redis.isOpen) {
      await redis.quit();
    }
  }
};

export default redis;
