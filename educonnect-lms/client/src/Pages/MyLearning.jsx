import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../axios";
import { useAuth } from "../Context/AuthContext";
import {
  Terminal,
  Play,
  ArrowRight,
  Award,
  CheckCircle2,
  Clock,
  BookOpen,
  Sparkles,
  TrendingUp,
} from "lucide-react";

export default function MyLearning() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const defaultEnrolled = [
    {
      _id: "c1",
      title: "Real-Time WebSockets & Node.js System Architecture",
      category: "BACKEND SYSTEMS",
      nextLesson: "Lesson 2: Socket.io Handshake & Rooms",
      progress: 50,
      totalLessons: 4,
      completedLessons: 2,
      lastActive: "Today",
      thumbnail:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop",
    },
    {
      _id: "c2",
      title: "PostgreSQL Mastery: Schema Design & Index Tuning",
      category: "DATABASE SYSTEMS",
      nextLesson: "Lesson 1: Relational Modeling & Constraints",
      progress: 25,
      totalLessons: 4,
      completedLessons: 1,
      lastActive: "Yesterday",
      thumbnail:
        "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop",
    },
  ];

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const res = await API.get("/course");
        if (res.data?.success && res.data.courses?.length > 0) {
          const mapped = res.data.courses.map((c, i) => ({
            _id: c._id,
            title: c.title,
            category: c.category || "ENGINEERING",
            nextLesson: c.subtitle || "Continue Module",
            progress: i === 0 ? 50 : 25,
            totalLessons: c.lessons?.length || 4,
            completedLessons: i === 0 ? 2 : 1,
            lastActive: "Active today",
            thumbnail: c.thumbnail,
          }));
          setCourses(mapped);
        } else {
          setCourses(defaultEnrolled);
        }
      } catch (err) {
        console.error("My Learning fetch error:", err);
        setCourses(defaultEnrolled);
      } finally {
        setLoading(false);
      }
    };
    fetchMyCourses();
  }, []);

  return (
    <div className="flex-1 min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans pb-16 transition-colors duration-200">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 md:px-8 py-6 sm:py-10 transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-xs font-bold w-fit">
              <TrendingUp className="w-4 h-4" />
              <span>Student Progress Headquarters</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              My Learning
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl">
              Track your active courses, completed video lessons, and system architecture milestones.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-750 flex flex-col">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                Courses In Progress
              </span>
              <span className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {courses.length}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-750 flex flex-col">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                Lessons Completed
              </span>
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">3</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-750 flex flex-col">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                Total Study Time
              </span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                14.5 hrs
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-750 flex flex-col">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                Certificates Earned
              </span>
              <span className="text-2xl font-black text-amber-500 mt-1">1</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Enrolled Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6 sm:mt-8 flex flex-col gap-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Enrolled Tracks & Active Progress
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 flex flex-col justify-between gap-5 shadow-xs hover:shadow-md transition"
            >
              <div className="flex gap-4">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-24 h-24 rounded-xl object-cover shrink-0 bg-slate-900"
                />
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    {course.category}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate flex items-center gap-1.5 mt-1">
                    <Play className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span>{course.nextLesson}</span>
                  </p>
                </div>
              </div>

              {/* Progress Engine */}
              <div className="flex flex-col gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-slate-500 dark:text-slate-400">
                    {course.completedLessons} of {course.totalLessons} Lessons Done
                  </span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold">{course.progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                  Last active: {course.lastActive}
                </span>
                <Link
                  to={`/course/${course._id}/learn`}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Resume Learning</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
