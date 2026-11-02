import { Worker } from "bullmq";
import ffmpeg from "fluent-ffmpeg";
import { redisConnection } from "../config/queue.js";
import Lesson from "../models/Lesson.js";

// BullMQ Worker to process uploaded lesson videos
const videoWorker = new Worker(
  "video-processing-queue",
  async (job) => {
    const { lessonId, filePath, filename } = job.data;
    console.log(`🎬 [BullMQ Worker] Processing video for Lesson ID: ${lessonId}...`);

    // Probe video metadata (duration, codec) using FFmpeg
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, async (err, metadata) => {
        if (err) {
          console.error(`❌ [BullMQ Worker] FFprobe error for ${filename}:`, err);
          return reject(err);
        }

        const durationInSeconds = Math.round(metadata?.format?.duration || 0);

        try {
          // Update Lesson document in MongoDB
          const updatedLesson = await Lesson.findByIdAndUpdate(
            lessonId,
            {
              videoUrl: `/uploads/videos/${filename}`,
              videoDuration: durationInSeconds,
            },
            { new: true }
          );

          console.log(
            `✅ [BullMQ Worker] Lesson ${lessonId} updated! Duration: ${durationInSeconds}s`
          );
          resolve(updatedLesson);
        } catch (dbError) {
          console.error(`❌ [BullMQ Worker] DB update error:`, dbError);
          reject(dbError);
        }
      });
    });
  },
  { connection: redisConnection }
);

videoWorker.on("completed", (job) => {
  console.log(`🎉 [BullMQ Worker] Job ${job.id} completed successfully!`);
});

videoWorker.on("failed", (job, err) => {
  console.error(`💥 [BullMQ Worker] Job ${job?.id} failed:`, err.message);
});

export default videoWorker;
