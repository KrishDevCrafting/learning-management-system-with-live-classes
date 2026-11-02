import express from "express";
import { uploadVideo } from "../middleware/uploadMiddleware.js";
import {
  addLesson,
  getLessonsByCourse,
  getLessonById,
  updateLesson,
  deleteLesson,
  uploadLessonVideo,
} from "../controllers/lessonController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes to view lessons
router.get("/course/:courseId", getLessonsByCourse);
router.get("/:id", getLessonById);

// Protected routes (Only logged in Instructor or Admin)
router.post("/:courseId", protect, authorize("instructor", "admin"), addLesson);
router.put("/:id", protect, authorize("instructor", "admin"), updateLesson);
router.delete("/:id", protect, authorize("instructor", "admin"), deleteLesson);
router.post(
  "/:id/upload-video",
  protect,
  authorize("instructor", "admin"),
  uploadLessonVideo,
);
export default router;
