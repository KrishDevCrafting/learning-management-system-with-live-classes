import express from "express";

import {
  createCourse,
  getAllcourses,
  updateCourse,
  getCourseById,
} from "../controllers/courseController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/", getAllcourses);
router.get("/:id", getCourseById);

router.post("/", protect, authorize("instructor", "admin"), createCourse);

router.put("/:id", protect, authorize("instructor", "admin"), updateCourse);

export default router;
