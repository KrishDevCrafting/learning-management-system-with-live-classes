import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";
import Lesson from "../models/Lesson.js";

// ─────────────────────────────────────────────────────────
// @desc    Enroll current student into a course
// @route   POST /api/enrollment/:courseId
// @access  Private (Student only)
// ─────────────────────────────────────────────────────────
export const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    // 1. Check if course exists and is published
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    if (!course.isPublished) {
      return res.status(400).json({
        success: false,
        message: "This course is not yet published",
      });
    }

    // 2. Check if student is already enrolled (unique index will also catch this)
    const existingEnrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId,
    });
    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: "You are already enrolled in this course",
      });
    }

    // 3. Create new enrollment record
    const enrollment = await Enrollment.create({
      student: req.user.id,
      course: courseId,
      paymentStatus: course.price === 0 ? "free" : "pending",
    });

    // 4. Increment course enrolled students count
    await Course.findByIdAndUpdate(courseId, {
      $inc: { enrolledStudentsCount: 1 },
    });

    res.status(201).json({
      success: true,
      message: "Successfully enrolled in the course!",
      data: enrollment,
    });
  } catch (error) {
    // Handle duplicate key error from MongoDB unique index
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You are already enrolled in this course",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error during enrollment",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Get all courses the current student is enrolled in
// @route   GET /api/enrollment/my-courses
// @access  Private (Student)
// ─────────────────────────────────────────────────────────
export const getMyEnrolledCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id })
      .populate({
        path: "course",
        select: "title subtitle thumbnail instructor category level price lessons enrolledStudentsCount",
        populate: {
          path: "instructor",
          select: "name email",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching enrolled courses",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Mark a lesson as completed & update progress %
// @route   PUT /api/enrollment/:courseId/complete-lesson/:lessonId
// @access  Private (Student)
// ─────────────────────────────────────────────────────────
export const completeLesson = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;

    // 1. Find enrollment
    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId,
    });
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

    // 2. Check if lesson actually belongs to this course
    const lesson = await Lesson.findOne({ _id: lessonId, course: courseId });
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found in this course",
      });
    }

    // 3. Add lesson to completedLessons if not already marked
    const alreadyCompleted = enrollment.completedLessons
      .map((id) => id.toString())
      .includes(lessonId);

    if (!alreadyCompleted) {
      enrollment.completedLessons.push(lessonId);
    }

    // 4. Recalculate progress percentage
    const course = await Course.findById(courseId).select("lessons");
    const totalLessons = course.lessons.length;

    if (totalLessons > 0) {
      enrollment.progressPercentage = Math.round(
        (enrollment.completedLessons.length / totalLessons) * 100
      );
    }

    // 5. Mark course as fully completed if 100%
    if (enrollment.progressPercentage === 100) {
      enrollment.isCompleted = true;
    }

    await enrollment.save();

    res.status(200).json({
      success: true,
      message: alreadyCompleted
        ? "Lesson was already marked as completed"
        : "Lesson marked as completed!",
      data: {
        progressPercentage: enrollment.progressPercentage,
        completedLessons: enrollment.completedLessons.length,
        totalLessons,
        isCompleted: enrollment.isCompleted,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error updating lesson progress",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Get enrollment details & progress for one course
// @route   GET /api/enrollment/:courseId/progress
// @access  Private (Student)
// ─────────────────────────────────────────────────────────
export const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;

    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId,
    }).populate("completedLessons", "title order");

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

    const course = await Course.findById(courseId)
      .select("title lessons")
      .populate("lessons", "title order videoDuration isFreePreview");

    res.status(200).json({
      success: true,
      data: {
        courseTitle: course.title,
        progressPercentage: enrollment.progressPercentage,
        isCompleted: enrollment.isCompleted,
        completedLessons: enrollment.completedLessons,
        allLessons: course.lessons,
        totalLessons: course.lessons.length,
        completedCount: enrollment.completedLessons.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching course progress",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Check if current user is enrolled in a course
// @route   GET /api/enrollment/:courseId/check
// @access  Private
// ─────────────────────────────────────────────────────────
export const checkEnrollment = async (req, res) => {
  try {
    const { courseId } = req.params;

    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId,
    });

    res.status(200).json({
      success: true,
      isEnrolled: !!enrollment,
      data: enrollment || null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error checking enrollment",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Get all enrollments for a course (Instructor/Admin view)
// @route   GET /api/enrollment/course/:courseId/students
// @access  Private (Instructor, Admin)
// ─────────────────────────────────────────────────────────
export const getCourseEnrollments = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Verify course belongs to this instructor
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    if (
      course.instructor.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this course's enrollments",
      });
    }

    const enrollments = await Enrollment.find({ course: courseId })
      .populate("student", "name email createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching course enrollments",
      error: error.message,
    });
  }
};

