import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Lesson title is required"],
      trim: true,
      maxlength: [120, "Lesson title cannot exceed 120 characters"]
    },
    description: {
      type: String,
      default: ""
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course reference is required"]
    },
    order: {
      type: Number,
      required: true,
      default: 1
    },
    videoUrl: {
      type: String,
      default: ""
    },
    videoDuration: {
      type: Number,
      default: 0 // Duration in seconds
    },
    isFreePreview: {
      type: Boolean,
      default: false
    },
    resources: [
      {
        title: String,
        fileUrl: String
      }
    ]
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Lesson", lessonSchema);
