import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      console.error(
        "❌ CRITICAL: MONGO_URI is not set in environment variables! Please add MONGO_URI in Render dashboard."
      );
    }
    const conn = await mongoose.connect(uri || "mongodb://127.0.0.1:27017/educonnect_lms", {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // In local dev, exit; in production, keep server alive so health check reports status
    if (process.env.NODE_ENV !== "production") {
      process.exit(1);
    }
  }
};
