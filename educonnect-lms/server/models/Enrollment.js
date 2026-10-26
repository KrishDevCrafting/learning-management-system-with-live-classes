import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },
    completedLessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson"
      }
    ],
    progressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    isCompleted: {
      type: Boolean,
      default: false
    },
    certificateUrl: {
      type: String,
      default: ""
    },
    certificateIssuedAt: {
      type: Date
    },
    paymentStatus: {
      type: String,
      enum: ["free", "pending", "completed", "refunded"],
      default: "free"
    },
    paymentDetails: {
      transactionId: String,
      amount: Number,
      currency: { type: String, default: "INR" },
      paymentDate: Date
    }
  },
  {
    timestamps: true
  }
);

// Prevent duplicate enrollment of same student in same course
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

export default mongoose.model("Enrollment", enrollmentSchema);
