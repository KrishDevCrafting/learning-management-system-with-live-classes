import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"]
    },
    subtitle: {
      type: String,
      trim: true,
      maxlength: [200, "Subtitle cannot exceed 200 characters"]
    },
    description: {
      type: String,
      required: [true, "Description is required"]
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Instructor reference is required"]
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "All Levels"],
      default: "All Levels"
    },
    price: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Price cannot be negative"]
    },
    thumbnail: {
      type: String,
      default: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop"
    },
    lessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson"
      }
    ],
    isPublished: {
      type: Boolean,
      default: false
    },
    enrolledStudentsCount: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Course", courseSchema);
