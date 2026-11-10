import LiveClass from "../models/LiveClass.js";

export const createLiveClass = async (req, res) => {
  try {
    const { title, course, scheduledAt } = req.body;

    if (!title || !course || !scheduledAt) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const roomId = crypto.randomUUID();

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
