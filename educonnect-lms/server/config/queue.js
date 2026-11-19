import { Queue } from "bullmq";
import Redis from "ioredis";

// Optional Cloud / Local Redis Connection for BullMQ
let redisConnection = null;
let videoQueue = null;

const hasRedisConfig = Boolean(process.env.REDIS_URL || process.env.REDIS_HOST);

if (hasRedisConfig) {
  try {
    const redisConfig = process.env.REDIS_URL || {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      maxRetriesPerRequest: null,
      enableOfflineQueue: false,
      retryStrategy: (times) => {
        if (times > 3) return null;
        return 2000;
      },
    };

    redisConnection = new Redis(redisConfig);
    redisConnection.on("error", (err) => {
      console.warn("⚠️ Redis Queue Connection Notice:", err.message);
    });

    videoQueue = new Queue("video-processing-queue", {
      connection: redisConnection,
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: "exponential", delay: 5000 },
        removeOnComplete: true,
      },
    });
  } catch (err) {
    console.warn("⚠️ BullMQ initialization skipped:", err.message);
  }
} else {
  // Graceful fallback mock for environments without a Redis instance (e.g. Render Free Tier)
  videoQueue = {
    add: async (jobName, data) => {
      console.log(`ℹ️ [Queue Notice] Background job '${jobName}' scheduled (Redis offline):`, data.lessonId);
      return { id: `mock-${Date.now()}`, data };
    },
  };
}

export { redisConnection, videoQueue };
