import { Queue } from "bullmq";
import Redis from "ioredis";

// Shared Redis connection for BullMQ
export const redisConnection = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: null, // Required by BullMQ
  enableOfflineQueue: false,
  retryStrategy: (times) => {
    // Retry up to 3 times, then back off gracefully
    if (times > 3) return null;
    return Math.min(times * 1000, 3000);
  },
});

// Suppress unhandled Redis error crashes when Redis is offline
redisConnection.on("error", (err) => {
  // Silent warning for optional worker queue
});

// BullMQ Queue for Video Processing
export const videoQueue = new Queue("video-processing-queue", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3, // Retry up to 3 times on failure
    backoff: {
      type: "exponential",
      delay: 5000, // 5 seconds wait before retry
    },
    removeOnComplete: true, // Auto cleanup completed jobs
    removeOnFail: false, // Keep failed jobs for debugging
  },
});
