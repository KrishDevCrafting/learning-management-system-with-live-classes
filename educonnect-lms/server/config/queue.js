import { Queue } from "bullmq";
import Redis from "ioredis";

// Shared Redis connection for BullMQ
export const redisConnection = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: null, // Required by BullMQ
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
