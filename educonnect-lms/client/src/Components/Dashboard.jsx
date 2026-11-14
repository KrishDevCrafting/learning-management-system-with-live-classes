import React from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Bell,
  Plus,
  PlayCircle,
  Layers,
  PieChart,
  Clock,
  AlertCircle,
  Star,
  ArrowRight,
  Radio,
  Calendar,
  ChevronRight,
  Play,
} from "lucide-react";
import { useAuth } from "../Context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  const courses = [
    {
      id: 1,
      title: "Distributed Systems & Event-Driven Architecture with Kafka & Go",
      category: "BACKEND SYSTEMS",
      nextLesson: "Handling Partition Splits & Consensus",
      progress: 65,
      lessonCount: "Lesson 8 of 12",
      rating: 4.9,
      instructor: "Marcus Vance",
      initials: "MV",
      lastActive: "2h ago",
      thumbnail:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop",
    },
    {
      id: 2,
      title: "Production Full-Stack Next.js 15, Turborepo & Micro-Frontends",
      category: "FULL-STACK",
      nextLesson: "Edge Middleware & Session Invalidation",
      progress: 42,
      lessonCount: "Lesson 5 of 12",
      rating: 4.8,
      instructor: "Elena Rostova",
      initials: "ER",
      lastActive: "Yesterday",
      thumbnail:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop",
    },
    {
      id: 3,
      title: "Applied LLM Engineering: Fine-Tuning & Multi-Agent LangGraph",
      category: "AI SYSTEMS",
      nextLesson: "Final Capstone Evaluation",
      progress: 88,
      lessonCount: "Lesson 11 of 12",
      rating: 5.0,
      instructor: "Siddharth Mehta",
      initials: "SM",
      lastActive: "3d ago",
      thumbnail:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop",
    },
  ];

  return (
    <div className="flex-1 min-h-screen bg-slate-50 font-sans">
      {/* 1. Header Toolbar */}
      <header className="sticky top-0 z-40 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-8 flex items-center justify-between shadow-xs">
        {/* Breadcrumb & Track */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <span>App</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span>Dashboard</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-blue-600 font-semibold">Overview</span>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mt-0.5">
            TERM 02 • ADVANCED DISTRIBUTED TRACK
          </span>
        </div>

        {/* Search, Notifications & Create Action */}
        <div className="flex items-center gap-3">
          <div className="relative w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search courses, sessions, or lessons... (⌘K)"
              className="w-full h-9.5 pl-9 pr-12 rounded-xl bg-slate-100/70 border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition"
            />
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200/70 text-slate-500">
              ⌘K
            </kbd>
          </div>

          <button className="relative w-9.5 h-9.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition">
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>

          <button className="h-9.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition active:scale-[0.98]">
            <Plus className="w-4 h-4" />
            <span>Create Course</span>
          </button>
        </div>
      </header>

      {/* 2. Main Content Container */}
      <main className="p-8 max-w-7xl mx-auto flex flex-col gap-8">
        {/* Welcome Hero Banner with Integrated Metrics Strip */}
        <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-xs p-8">
          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex flex-col gap-1 max-w-2xl">
                <div className="inline-flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold tracking-wide flex items-center gap-1.5 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    ACTIVE COHORT SESSION
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold">
                    Q2 MILESTONE ENGINE
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Welcome back, {user?.name || "Krish"} 👋
                </h1>
                <p className="text-sm text-slate-500">
                  You have{" "}
                  <span className="font-semibold text-blue-600">
                    1 live class
                  </span>{" "}
                  scheduled today at{" "}
                  <strong className="text-slate-800">8:00 PM (IST)</strong> •
                  148 students registered and prepared.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition">
                  Filter View
                </button>
                <button className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5">
                  <PlayCircle className="w-4 h-4" />
                  <span>Start Stream Console</span>
                </button>
              </div>
            </div>

            {/* Metric Strip Component */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
              {/* Stat 1 */}
              <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold truncate">
                    Active Courses
                  </span>
                  <span className="text-lg font-extrabold text-slate-900 leading-tight">
                    4 Enrolled
                  </span>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <PieChart className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold truncate">
                    Avg. Completion
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-extrabold text-slate-900 leading-tight">
                      84%
                    </span>
                    <span className="text-[11px] text-emerald-600 font-bold">
                      ↑ 4.2%
                    </span>
                  </div>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold truncate">
                    Teaching Hours
                  </span>
                  <span className="text-lg font-extrabold text-slate-900 leading-tight">
                    38 hrs
                  </span>
                </div>
              </div>

              {/* Stat 4 */}
              <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold truncate">
                    Pending Tasks
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-extrabold text-slate-900 leading-tight">
                      6
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-700 text-[10px] font-bold">
                      Urgent
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Active In-Progress Courses Bento Section */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Active In-Progress Courses
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-200/70 text-slate-600">
                Cohort 2026
              </span>
            </div>
            <a
              href="/courses"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 transition flex items-center gap-1 group"
            >
              <span>View All (4)</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          {/* 3 Sleek Course Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="flex flex-col justify-between rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden group hover:-translate-y-0.5"
              >
                {/* Thumbnail Container */}
                <div className="relative w-full h-44 overflow-hidden bg-slate-900">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20"></div>

                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-extrabold tracking-wider uppercase">
                    {course.category}
                  </span>

                  <span className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-slate-900 text-[11px] font-bold">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>{course.rating}</span>
                  </span>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px] font-medium">
                    <span className="opacity-90">12 Modules total</span>
                    <span className="font-bold bg-blue-600/90 backdrop-blur-md px-2 py-0.5 rounded text-[10px]">
                      {course.progress}% DONE
                    </span>
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 truncate">
                      <Play className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate">
                        Next: {course.nextLesson}
                      </span>
                    </p>
                  </div>

                  {/* Linear Progress Bar */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-[11px] text-slate-500 font-semibold">
                      <span>{course.lessonCount}</span>
                      <span className="text-blue-600 font-bold">
                        {course.progress}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Instructor & Resume CTA */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-[11px]">
                        {course.initials}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {course.instructor}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {course.lastActive}
                        </span>
                      </div>
                    </div>
                    
                    <Link
                      to={`/course/${course.id || course._id}/learn`}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition"
                    >
                      <span>Resume</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Upcoming Live Sessions Schedule */}
        <section className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-red-500" />
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Upcoming Live Sessions
              </h2>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            </div>

            <div className="flex items-center gap-3">
              <div className="inline-flex rounded-xl bg-slate-200/60 p-0.5 text-xs font-bold">
                <button className="px-3 py-1 rounded-lg bg-white text-blue-600 shadow-xs">
                  Today
                </button>
                <button className="px-3 py-1 rounded-lg text-slate-600 hover:text-slate-900 transition">
                  This Week
                </button>
                <button className="px-3 py-1 rounded-lg text-slate-600 hover:text-slate-900 transition">
                  All Upcoming
                </button>
              </div>

              <button className="h-8 px-3 rounded-lg bg-white border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 shadow-xs flex items-center gap-1.5 transition">
                <Calendar className="w-3.5 h-3.5" />
                <span>Sync Calendar</span>
              </button>
            </div>
          </div>

          {/* Live Session Card */}
          <div className="rounded-2xl bg-white border border-slate-200/80 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-200">
                <Radio className="w-6 h-6 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-[10px] font-extrabold tracking-wider uppercase border border-red-200">
                    STARTS IN 45 MINS
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">
                    Room: #LC-LIVE-892
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  Real-Time WebSockets & Node.js System Architecture with Krish
                </h3>
                <span className="text-xs text-slate-500 mt-0.5">
                  Instructor: Krish Singh • Course: Full-Stack WebSockets
                  Mastery
                </span>
              </div>
            </div>

            <button className="h-10 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 shadow-md shadow-red-500/20 transition active:scale-[0.98]">
              <Play className="w-4 h-4 fill-white" />
              <span>Join Stream Console</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
