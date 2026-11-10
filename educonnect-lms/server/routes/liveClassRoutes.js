import express from "express";
import { createLiveClass } from "../controllers/liveClassController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("instructor", "admin"), createLiveClass);

export default router;
