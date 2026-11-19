import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../axios";
import { useAuth } from "../Context/AuthContext";
import {
  Plus,
  BookOpen,
  Radio,
  Users,
  Star,
  ArrowRight,
  Clock,
  Loader2,
  ChevronRight,
  Play,
  Eye,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  Video,
  Calendar,
  BarChart3,
  Layers,
  PenLine,
} from "lucide-react";

export default function InstructorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [liveClasses, setLiveClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create Course Modal
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [courseForm, setCourseForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    category: "Backend Development",
    level: "Intermediate",
    price: 0,
    thumbnail: "",
  });
  const [courseSubmitting, setCourseSubmitting] = useState(false);
  const [courseMessage, setCourseMessage] = useState({ type: "", text: "" });

  // Create Live Class Modal
  const [showCreateLive, setShowCreateLive] = useState(false);
  const [liveForm, setLiveForm] = useState({
    title: "",
    course: "",
    scheduledAt: "",
  });
  const [liveSubmitting, setLiveSubmitting] = useState(false);
  const [liveMessage, setLiveMessage] = useState({ type: "", text: "" });

  const categories = [
    "Backend Development",
    "Database Systems",
    "Full-Stack",
    "System Design",
    "Frontend Development",
    "DevOps & Cloud",
  ];

  const levels = ["Beginner", "Intermediate", "Advanced", "All Levels"];

  const thumbnails = [
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&auto=format&fit=crop",
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [courseRes, liveRes] = await Promise.all([
        API.get("/course").catch(() => null),
        API.get("/live-class").catch(() => null),
      ]);

      if (courseRes?.data?.success) {
        setCourses(courseRes.data.courses || []);
      }
      if (liveRes?.data?.success) {
        setLiveClasses(liveRes.data.liveClasses || []);
      }
    } catch (err) {
      console.error("Instructor dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Create Course Handler
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!courseForm.title.trim() || !courseForm.description.trim()) {
      setCourseMessage({ type: "error", text: "Title and description are required." });
      return;
    }
    setCourseSubmitting(true);
    setCourseMessage({ type: "", text: "" });

    try {
      const payload = {
        ...courseForm,
        thumbnail:
          courseForm.thumbnail ||
          thumbnails[Math.floor(Math.random() * thumbnails.length)],
      };
      const res = await API.post("/course", payload);
      if (res.data?.success) {
        setCourseMessage({ type: "success", text: `Course "${res.data.course.title}" created successfully!` });
        setCourseForm({
          title: "",
          subtitle: "",
          description: "",
          category: "Backend Development",
          level: "Intermediate",
          price: 0,
          thumbnail: "",
        });
        fetchData();
        setTimeout(() => {
          setShowCreateCourse(false);
          setCourseMessage({ type: "", text: "" });
        }, 1500);
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || "Failed to create course. Please try again.";
      setCourseMessage({ type: "error", text: msg });
    } finally {
      setCourseSubmitting(false);
    }
  };

  // Create Live Class Handler
  const handleCreateLive = async (e) => {
    e.preventDefault();
    if (!liveForm.title.trim() || !liveForm.course || !liveForm.scheduledAt) {
      setLiveMessage({ type: "error", text: "All fields are required." });
      return;
    }
    setLiveSubmitting(true);
    setLiveMessage({ type: "", text: "" });

    try {
      const res = await API.post("/live-class", liveForm);
      if (res.data?.success) {
        setLiveMessage({
          type: "success",
          text: `Live class "${res.data.liveClass.title}" created! Room: ${res.data.liveClass.roomId}`,
        });
        setLiveForm({ title: "", course: "", scheduledAt: "" });
        fetchData();
        setTimeout(() => {
          setShowCreateLive(false);
          setLiveMessage({ type: "", text: "" });
        }, 2000);
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || "Failed to create live class. Please try again.";
      setLiveMessage({ type: "error", text: msg });
    } finally {
      setLiveSubmitting(false);
    }
  };

  // Stats
  const myCourses = courses.filter(
    (c) =>
      c.instructor?._id === user?.id ||
      c.instructor?._id === user?._id ||
      c.instructor === user?.id ||
      c.instructor === user?._id
  );
  const totalStudents = myCourses.reduce(
    (acc, c) => acc + (c.enrolledStudentsCount || 0),
    0
  );
  const myLiveClasses = liveClasses.filter(
    (lc) =>
      lc.instructor?._id === user?.id ||
      lc.instructor?._id === user?._id ||
      lc.instructor === user?.id ||
      lc.instructor === user?._id
  );

  if (loading) {
    return (
      <div className="flex-1 min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans pb-16 transition-colors duration-200">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-8 py-8 transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span>EduConnect</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-blue-600 dark:text-blue-400 font-semibold">
                Instructor Studio
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Instructor Studio
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl">
              Create courses, schedule live sessions, and manage your teaching content from one unified studio.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowCreateCourse(true)}
              className="h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-500/20 transition active:scale-[0.98] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Course</span>
            </button>
            <button
              type="button"
              onClick={() => setShowCreateLive(true)}
              className="h-10 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-red-500/20 transition active:scale-[0.98] cursor-pointer"
            >
              <Radio className="w-4 h-4" />
              <span>Schedule Live Class</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 mt-8 flex flex-col gap-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold">
                My Courses
              </span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                {myCourses.length}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold">
                Students
              </span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                {totalStudents}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="w-11 h-11 rounded-xl bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
              <Radio className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold">
                Live Sessions
              </span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                {myLiveClasses.length}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="w-11 h-11 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold">
                Avg Rating
              </span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                {myCourses.length > 0
                  ? (
                      myCourses.reduce((s, c) => s + (c.averageRating || 0), 0) /
                      myCourses.length
                    ).toFixed(1)
                  : "—"}
              </span>
            </div>
          </div>
        </div>

        {/* My Courses Section */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                My Created Courses
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                {myCourses.length}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowCreateCourse(true)}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New</span>
            </button>
          </div>

          {myCourses.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-10 flex flex-col items-center text-center shadow-xs">
              <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                No courses created yet
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 max-w-sm">
                Start by creating your first course. Add a title, description, category, and begin building modules for your students.
              </p>
              <button
                type="button"
                onClick={() => setShowCreateCourse(true)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Your First Course</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myCourses.map((course) => (
                <div
                  key={course._id}
                  className="flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all overflow-hidden group hover:-translate-y-0.5"
                >
                  <div className="relative w-full h-40 overflow-hidden bg-slate-900">
                    <img
                      src={
                        course.thumbnail ||
                        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop"
                      }
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-[10px] font-extrabold tracking-wider uppercase text-slate-900 dark:text-white">
                      {course.category}
                    </span>
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-blue-600/90 text-[10px] font-bold text-white">
                      {course.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                  <div className="p-5 flex flex-col flex-1 justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {course.title}
                      </h3>
                      {course.subtitle && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                          {course.subtitle}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {course.enrolledStudentsCount || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-500" />
                          {course.averageRating || "N/A"}
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5" />
                          {course.lessons?.length || 0} Lessons
                        </span>
                      </div>
                      <Link
                        to={`/course/${course._id}/learn`}
                        className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* All Courses on Platform */}
        {courses.length > myCourses.length && (
          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                All Platform Courses
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {courses.length} Total
              </span>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
              {courses.map((c) => (
                <div
                  key={c._id}
                  className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={
                        c.thumbnail ||
                        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&auto=format&fit=crop"
                      }
                      alt={c.title}
                      className="w-10 h-10 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {c.title}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {c.category} • {c.level} •{" "}
                        {c.instructor?.name || "Unknown"}
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/course/${c._id}/learn`}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline shrink-0"
                  >
                    View →
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Live Classes Section */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-red-500" />
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Scheduled Live Sessions
              </h2>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            </div>
            <button
              type="button"
              onClick={() => setShowCreateLive(true)}
              className="text-xs font-bold text-red-500 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Schedule New</span>
            </button>
          </div>

          {liveClasses.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-10 flex flex-col items-center text-center shadow-xs">
              <Video className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                No live sessions scheduled
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 max-w-sm">
                Schedule your first live class. Students will be able to join the stream room in real-time.
              </p>
              <button
                type="button"
                onClick={() => setShowCreateLive(true)}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer"
              >
                <Radio className="w-4 h-4" />
                <span>Schedule First Live Class</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {liveClasses.map((live) => (
                <div
                  key={live._id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 border border-red-200 dark:border-red-900/50">
                      <Radio className="w-6 h-6 animate-pulse" />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 text-[10px] font-extrabold tracking-wider uppercase border border-red-200 dark:border-red-900/50">
                          {live.status === "ongoing" ? "🔴 LIVE NOW" : live.status?.toUpperCase() || "SCHEDULED"}
                        </span>
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
                          Room: #{live.roomId}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                        {live.title}
                      </h3>
                      <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {live.course?.title || "—"} •{" "}
                        {live.scheduledAt
                          ? new Date(live.scheduledAt).toLocaleString()
                          : "TBD"}
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/live/${live.roomId}`}
                    className="h-10 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 shadow-md shadow-red-500/20 transition active:scale-[0.98]"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Join Stream</span>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ==================== CREATE COURSE MODAL ==================== */}
      {showCreateCourse && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Create New Course
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Fill in the details below to publish a new course.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowCreateCourse(false);
                  setCourseMessage({ type: "", text: "" });
                }}
                className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="p-6 flex flex-col gap-4">
              {courseMessage.text && (
                <div
                  className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    courseMessage.type === "success"
                      ? "bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400"
                      : "bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400"
                  }`}
                >
                  {courseMessage.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{courseMessage.text}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Course Title *
                </label>
                <input
                  type="text"
                  required
                  value={courseForm.title}
                  onChange={(e) =>
                    setCourseForm({ ...courseForm, title: e.target.value })
                  }
                  placeholder="e.g. Real-Time WebSockets & Node.js Architecture"
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={courseForm.subtitle}
                  onChange={(e) =>
                    setCourseForm({ ...courseForm, subtitle: e.target.value })
                  }
                  placeholder="Short tagline for the course"
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={courseForm.description}
                  onChange={(e) =>
                    setCourseForm({ ...courseForm, description: e.target.value })
                  }
                  placeholder="Describe what students will learn..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500 transition resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Category *
                  </label>
                  <select
                    value={courseForm.category}
                    onChange={(e) =>
                      setCourseForm({ ...courseForm, category: e.target.value })
                    }
                    className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500 transition"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Level
                  </label>
                  <select
                    value={courseForm.level}
                    onChange={(e) =>
                      setCourseForm({ ...courseForm, level: e.target.value })
                    }
                    className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500 transition"
                  >
                    {levels.map((lv) => (
                      <option key={lv} value={lv}>
                        {lv}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Price (USD)
                </label>
                <input
                  type="number"
                  min="0"
                  value={courseForm.price}
                  onChange={(e) =>
                    setCourseForm({
                      ...courseForm,
                      price: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500 transition"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateCourse(false);
                    setCourseMessage({ type: "", text: "" });
                  }}
                  className="px-5 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={courseSubmitting}
                  className="px-5 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer"
                >
                  {courseSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Create Course</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== CREATE LIVE CLASS MODAL ==================== */}
      {showCreateLive && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Schedule Live Class
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Create a live stream room for your students.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowCreateLive(false);
                  setLiveMessage({ type: "", text: "" });
                }}
                className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateLive} className="p-6 flex flex-col gap-4">
              {liveMessage.text && (
                <div
                  className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    liveMessage.type === "success"
                      ? "bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400"
                      : "bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400"
                  }`}
                >
                  {liveMessage.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{liveMessage.text}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Session Title *
                </label>
                <input
                  type="text"
                  required
                  value={liveForm.title}
                  onChange={(e) =>
                    setLiveForm({ ...liveForm, title: e.target.value })
                  }
                  placeholder="e.g. Live: Advanced WebSocket Patterns"
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Course *
                </label>
                {courses.length === 0 ? (
                  <p className="text-xs text-red-500 font-semibold">
                    You need to create a course first before scheduling a live
                    class.
                  </p>
                ) : (
                  <select
                    required
                    value={liveForm.course}
                    onChange={(e) =>
                      setLiveForm({ ...liveForm, course: e.target.value })
                    }
                    className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500 transition"
                  >
                    <option value="">Select a course...</option>
                    {courses.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Scheduled Date & Time *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={liveForm.scheduledAt}
                  onChange={(e) =>
                    setLiveForm({ ...liveForm, scheduledAt: e.target.value })
                  }
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500 transition"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateLive(false);
                    setLiveMessage({ type: "", text: "" });
                  }}
                  className="px-5 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={liveSubmitting || courses.length === 0}
                  className="px-5 h-10 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer"
                >
                  {liveSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Radio className="w-4 h-4" />
                      <span>Schedule Live Class</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

