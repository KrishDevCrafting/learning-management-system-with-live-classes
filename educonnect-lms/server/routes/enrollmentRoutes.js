import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  enrollInCourse,
  getMyEnrolledCourses,
  completeLesson,
  getCourseProgress,
  checkEnrollment,
  getCourseEnrollments,
} from "../controllers/enrollmentController.js";

const router = express.Router();

// ─────────────────────────────────────────────────────────
// Student Routes
// ─────────────────────────────────────────────────────────

// GET  /api/enrollment/my-courses         → All enrolled courses for logged-in student
router.get(
  "/my-courses",
  protect,
  authorize("student", "admin"),
  getMyEnrolledCourses
);

// POST /api/enrollment/:courseId          → Enroll in a course
router.post(
  "/:courseId",
  protect,
  authorize("student", "admin"),
  enrollInCourse
);

// GET  /api/enrollment/:courseId/check    → Check if enrolled in a course
router.get("/:courseId/check", protect, checkEnrollment);

// GET  /api/enrollment/:courseId/progress → Get lesson progress for a course
router.get(
  "/:courseId/progress",
  protect,
  authorize("student", "admin"),
  getCourseProgress
);

// PUT  /api/enrollment/:courseId/complete-lesson/:lessonId → Mark lesson complete
router.put(
  "/:courseId/complete-lesson/:lessonId",
  protect,
  authorize("student", "admin"),
  completeLesson
);

// ─────────────────────────────────────────────────────────
// Instructor / Admin Routes
// ─────────────────────────────────────────────────────────

// GET  /api/enrollment/course/:courseId/students → View all students enrolled
router.get(
  "/course/:courseId/students",
  protect,
  authorize("instructor", "admin"),
  getCourseEnrollments
);

export default router;

