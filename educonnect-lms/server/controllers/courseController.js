import Course from "../models/Course.js";
import User from "../models/User.js";

export const createCourse = async (req, res) => {
  try {
    const { title, subtitle, description, category, level, price, thumbnail } =
      req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: "Please provide course title, description and category",
      });
    }

    const course = await Course.create({
      title,
      subtitle,
      description,
      category,
      level: level || "All Levels",
      price: price || 0,
      thumbnail:
        thumbnail ||
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop",
      instructor: req.user.id,
    });

    await User.findByIdAndUpdate(req.user.id, {
      $push: { createdCourses: course._id },
    });

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "server error creating course.",
    });
  }
};

// Get all the course with category and seatch filters

export const getAllcourses = async (req, res) => {
  try {
    const { category, level, search } = req.query;
    let query = {};

    // filter by category

    if (category) query.category = category;

    // filter by level

    if (level) query.level = level;

    // Search by title or description

    if (search) {
      query.$or = [
        {
          title: { $regex: search, $options: "i" },
        },
        {
          description: { $regex: search, $options: "i" },
        },
      ];
    }

    const courses = await Course.find(query)
      .populate("instructor", "name avatar bio")
      .select("-lessons")
      .sort("-createdAt");
    return res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error fetching courses.",
    });
  }
};

// Update course
// route PUT/apicourses/:id
// private (course owner/Admin only)

export const updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "course not found.",
      });
    }

    if (
      course.instructor.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this course.",
      });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error updating course.",
    });
  }
};

// @desc    Get single course by ID (with lessons & instructor info)
// @route   GET /api/courses/:id
// @access  Public
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("instructor", "name avatar bio")
      .populate("lessons");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    return res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error fetching course details.",
    });
  }
};
