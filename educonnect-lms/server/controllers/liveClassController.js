import LiveClass from "../models/LiveClass.js";
import crypto from "crypto";

// @desc    Create a new live class
// @route   POST /api/live-class
// @access  Private (Instructor/Admin)
export const createLiveClass = async (req, res) => {
  try {
    const { title, course, scheduledAt } = req.body;

    if (!title || !course || !scheduledAt) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const roomId = `ROOM-${Date.now().toString(36).toUpperCase()}-${Math.floor(
      1000 + Math.random() * 9000,
    )}`;

    const liveClass = await LiveClass.create({
      title,
      course,
      scheduledAt,
      instructor: req.user.id,
      roomId,
    });

    res
      .status(201)
      .json({ success: true, message: "Live class created", liveClass });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all upcoming/active live classes
// @route   GET /api/live-class
// @access  Public / Protected
export const getAllLiveClasses = async (req, res) => {
  try {
    const liveClasses = await LiveClass.find()
      .populate("instructor", "name avatar")
      .populate("course", "title category thumbnail")
      .sort({ scheduledAt: 1 });

    res.status(200).json({
      success: true,
      count: liveClasses.length,
      liveClasses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single live class details by roomId
// @route   GET /api/live-class/:roomId
// @access  Public / Protected
export const getLiveClassByRoomId = async (req, res) => {
  try {
    const { roomId } = req.params;
    const liveClass = await LiveClass.findOne({ roomId })
      .populate("instructor", "name avatar")
      .populate("course", "title category");

    if (!liveClass) {
      return res.status(404).json({
        success: false,
        message: "Live class room not found",
      });
    }

    res.status(200).json({
      success: true,
      liveClass,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
