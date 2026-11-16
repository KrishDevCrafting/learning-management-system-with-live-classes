import express from "express";
import {
  createLiveClass,
  getAllLiveClasses,
  getLiveClassByRoomId,
} from "../controllers/liveClassController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllLiveClasses);
router.get("/:roomId", getLiveClassByRoomId);
router.post("/", protect, authorize("instructor", "admin"), createLiveClass);

export default router;
