import Lesson from "../models/Lesson.js";
import Course from "../models/Course.js";

// @desc    Add a lesson to a course
// @route   POST /api/lessons/:courseId
// @access  Private (Instructor, Admin)
export const addLesson = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, order, isFreePreview } = req.body;

    // 1. Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // 2. Ownership verification: Only course instructor or admin can add lessons
    if (
      course.instructor.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to add lessons to this course",
      });
    }

    // 3. Auto-calculate lesson order if not provided
    const lessonOrder = order || course.lessons.length + 1;

    // 4. Create Lesson
    const lesson = await Lesson.create({
      title,
      description,
      course: courseId,
      order: lessonOrder,
      isFreePreview: isFreePreview || false,
    });

    // 5. Link lesson into course's lessons array
    course.lessons.push(lesson._id);
    await course.save();

    res.status(201).json({
      success: true,
      message: "Lesson created and linked to course successfully",
      lesson,
    });
  } catch (error) {
    console.error("Error in addLesson:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

// @desc    Get all lessons for a specific course (sorted by order)
// @route   GET /api/lessons/course/:courseId
// @access  Public
export const getLessonsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const lessons = await Lesson.find({ course: courseId }).sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: lessons.length,
      lessons,
    });
  } catch (error) {
    console.error("Error in getLessonsByCourse:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

// @desc    Get single lesson by ID
// @route   GET /api/lessons/:id
// @access  Public
export const getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    res.status(200).json({
      success: true,
      lesson,
    });
  } catch (error) {
    console.error("Error in getLessonById:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

// @desc    Update a lesson
// @route   PUT /api/lessons/:id
// @access  Private (Instructor, Admin)
export const updateLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate("course");

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    // Ownership check
    if (
      lesson.course.instructor.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this lesson",
      });
    }

    const { title, description, order, isFreePreview } = req.body;

    if (title) lesson.title = title;
    if (description !== undefined) lesson.description = description;
    if (order !== undefined) lesson.order = order;
    if (isFreePreview !== undefined) lesson.isFreePreview = isFreePreview;

    await lesson.save();

    res.status(200).json({
      success: true,
      message: "Lesson updated successfully",
      lesson,
    });
  } catch (error) {
    console.error("Error in updateLesson:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

// @desc    Delete a lesson
// @route   DELETE /api/lessons/:id
// @access  Private (Instructor, Admin)
export const deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate("course");

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    // Ownership check
    if (
      lesson.course.instructor.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this lesson",
      });
    }

    // Delete the lesson
    await Lesson.findByIdAndDelete(req.params.id);

    // Remove the lesson ID from parent course's lessons array
    await Course.findByIdAndUpdate(lesson.course._id, {
      $pull: { lessons: lesson._id },
    });

    res.status(200).json({
      success: true,
      message: "Lesson deleted successfully and unlinked from course",
    });
  } catch (error) {
    console.error("Error in deleteLesson:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};
