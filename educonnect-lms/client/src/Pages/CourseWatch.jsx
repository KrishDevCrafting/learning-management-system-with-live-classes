import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../axios";
import { useAuth } from "../Context/AuthContext";
import {
  ArrowLeft,
  PlayCircle,
  CheckCircle2,
  Circle,
  Clock,
  BookOpen,
  Award,
  Video,
  ChevronRight,
  Loader2,
} from "lucide-react";

export default function CourseWatch() {
  const { id: courseId } = useParams();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // 1. Fetch Course details and Student's Enrollment progress
  useEffect(() => {
    const fetchCourseAndProgress = async () => {
      setLoading(true);
      try {
        // Fetch course with lessons populated
        const courseRes = await API.get(`/course/${courseId}`);
        if (courseRes.data.success) {
          const courseData = courseRes.data.course;
          setCourse(courseData);

          // Default to first lesson
          if (courseData.lessons && courseData.lessons.length > 0) {
            setActiveLesson(courseData.lessons[0]);
          }
        }

        // Fetch enrollment progress for logged in student
        try {
          const progressRes = await API.get(`/enrollment/${courseId}/progress`);
          if (progressRes.data.success) {
            setProgress(progressRes.data.data.progressPercentage || 0);
            const completedIds = (
              progressRes.data.data.completedLessons || []
            ).map((l) => (typeof l === "object" ? l._id : l));
            setCompletedLessons(completedIds);
          }
        } catch {
          // If not enrolled yet, progress is 0
          setProgress(0);
          setCompletedLessons([]);
        }
      } catch (err) {
        console.error("Failed to load course details", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndProgress();
  }, [courseId]);

  // 2. Mark current lesson as completed
  const handleMarkComplete = async () => {
    if (!activeLesson) return;
    setUpdating(true);

    try {
      const res = await API.put(
        `/enrollment/${courseId}/complete-lesson/${activeLesson._id}`,
      );
      if (res.data.success) {
        setProgress(res.data.data.progressPercentage);
        if (!completedLessons.includes(activeLesson._id)) {
          setCompletedLessons([...completedLessons, activeLesson._id]);
        }
      }
    } catch (err) {
      console.error("Error marking lesson complete", err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          <span className="text-sm font-semibold">Loading Classroom...</span>
        </div>
      </div>
    );
  }

  const isCurrentCompleted = completedLessons.includes(activeLesson?._id);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* 1. Classroom Top Navigation Header */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition px-2.5 py-1.5 rounded-lg hover:bg-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
          <div className="h-4 w-px bg-slate-800 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-wider bg-blue-500/10 text-blue-400 px-2.5 py-0.5 rounded-md border border-blue-500/20">
              {course?.category || "Course"}
            </span>
            <h1 className="text-sm sm:text-base font-bold text-white truncate max-w-md">
              {course?.title || "Course Classroom"}
            </h1>
          </div>
        </div>

        {/* Course Progress Strip */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end gap-1">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="text-slate-400">Progress:</span>
              <span className="text-blue-400 font-bold">{progress}%</span>
            </div>
            <div className="w-32 h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {progress === 100 && (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
              <Award className="w-4 h-4" />
              <span>Completed!</span>
            </span>
          )}
        </div>
      </header>

      {/* 2. Main Classroom Stage: 70% Video Player | 30% Curriculum Sidebar */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Left Stage: Video Player & Lesson Details */}
        <main className="flex-1 flex flex-col p-6 lg:p-8 overflow-y-auto max-w-5xl mx-auto w-full">
          {/* HTML5 Video Stage */}
          <div className="relative aspect-video w-full rounded-2xl bg-black overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center group">
            {activeLesson?.videoUrl ? (
              <video
                key={activeLesson.videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
                src={
                  activeLesson.videoUrl.startsWith("http")
                    ? activeLesson.videoUrl
                    : `http://localhost:5000${activeLesson.videoUrl}`
                }
              />
            ) : (
              /* Fallback if video is still transcoding or demo */
              <div className="flex flex-col items-center gap-3 text-center p-6">
                <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-lg">
                  <PlayCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {activeLesson?.title || "Lesson Video Stream"}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm">
                    Interactive video lesson stream with BullMQ & FFmpeg video
                    pipeline.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Lesson Header & Complete Action Button */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-2 text-xs text-blue-400 font-bold mb-1">
                <span>Lesson {activeLesson?.order || 1}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-400 font-normal">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {activeLesson?.videoDuration
                      ? `${Math.round(activeLesson.videoDuration / 60)} mins`
                      : "15 mins"}
                  </span>
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                {activeLesson?.title || "Select a lesson from curriculum"}
              </h2>
            </div>

            {/* Mark as Completed CTA */}
            <button
              onClick={handleMarkComplete}
              disabled={updating || isCurrentCompleted}
              className={`h-11 px-5 rounded-xl text-xs font-bold flex items-center gap-2 transition active:scale-[0.98] ${
                isCurrentCompleted
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20"
              }`}
            >
              {updating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isCurrentCompleted ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Lesson Completed</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark as Completed</span>
                </>
              )}
            </button>
          </div>

          {/* Lesson Description & Resources */}
          <div className="mt-6 flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              About This Lesson
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {activeLesson?.description ||
                "In this lesson, you will master the core architectural concepts, handle edge cases, and run hands-on exercises."}
            </p>
          </div>
        </main>

        {/* Right Stage: Curriculum Syllabus Sidebar (380px) */}
        <aside className="w-full lg:w-96 bg-slate-900 border-l border-slate-800 flex flex-col shrink-0">
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold text-white">
                Course Curriculum
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-semibold">
              {completedLessons.length} / {course?.lessons?.length || 0} Done
            </span>
          </div>

          {/* Lesson List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
            {course?.lessons && course.lessons.length > 0 ? (
              course.lessons.map((lesson, index) => {
                const isActive = activeLesson?._id === lesson._id;
                const isDone = completedLessons.includes(lesson._id);

                return (
                  <button
                    key={lesson._id || index}
                    onClick={() => setActiveLesson(lesson)}
                    className={`w-full p-4 flex items-start gap-3.5 text-left transition ${
                      isActive
                        ? "bg-blue-600/10 border-l-4 border-blue-500"
                        : "hover:bg-slate-800/50"
                    }`}
                  >
                    {/* Status Pip */}
                    <div className="mt-0.5 shrink-0">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : isActive ? (
                        <PlayCircle className="w-4 h-4 text-blue-400 animate-pulse" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-600" />
                      )}
                    </div>

                    {/* Lesson Meta */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-slate-500">
                          Lesson {index + 1}
                        </span>
                        {lesson.isFreePreview && (
                          <span className="text-[10px] font-bold text-emerald-400 uppercase bg-emerald-500/10 px-1.5 py-0.2 rounded">
                            Preview
                          </span>
                        )}
                      </div>
                      <h4
                        className={`text-xs font-bold mt-0.5 truncate ${
                          isActive ? "text-blue-400" : "text-slate-200"
                        }`}
                      >
                        {lesson.title}
                      </h4>
                      <span className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>
                          {lesson.videoDuration
                            ? `${Math.round(lesson.videoDuration / 60)}m`
                            : "15m"}
                        </span>
                      </span>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-slate-500">
                No lessons uploaded for this course yet.
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
