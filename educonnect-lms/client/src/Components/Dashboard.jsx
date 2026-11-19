import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../axios";
import ThemeToggle from "./ThemeToggle";
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
  Loader2,
  X,
  CheckCheck,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  PanelLeft,
} from "lucide-react";
import { useAuth } from "../Context/AuthContext";
import { useSidebar } from "../Context/SidebarContext";

export default function Dashboard() {
  const { user } = useAuth();
  const { collapsed, toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const notificationRef = useRef(null);

  const [courses, setCourses] = useState([]);
  const [liveClasses, setLiveClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search Bar State
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Notification State
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const [notifications, setNotifications] = useState([
    {
      id: "notif-1",
      title: "🔴 Live Stream Active",
      message: "Real-Time WebSockets & Node.js System Architecture is streaming now.",
      time: "10 mins ago",
      link: "/live/LC-WEBSOCKET-2026",
      read: false,
      tag: "Live Class",
    },
    {
      id: "notif-2",
      title: "✅ Assignment Review Complete",
      message: "Your submission for 'Microservices with Docker' was scored 98/100.",
      time: "2 hours ago",
      link: "/assignments",
      read: false,
      tag: "Graded",
    },
    {
      id: "notif-3",
      title: "🚀 Database Cluster Connected",
      message: "MongoDB Atlas Cluster0 connection validated with low latency.",
      time: "1 day ago",
      link: "/settings",
      read: false,
      tag: "System",
    },
    {
      id: "notif-4",
      title: "🎓 Cohort Milestone",
      message: "Term 02 Advanced Distributed Track syllabus ready for review.",
      time: "2 days ago",
      link: "/courses",
      read: true,
      tag: "Cohort",
    },
  ]);

  const defaultCourses = [
    {
      _id: "default-1",
      title: "Real-Time WebSockets & Node.js System Architecture",
      category: "BACKEND SYSTEMS",
      nextLesson: "Handling Partition Splits & Consensus",
      progress: 65,
      lessonCount: "Lesson 8 of 12",
      rating: 4.9,
      instructor: "Krish Singh",
      initials: "KS",
      lastActive: "Active today",
      thumbnail:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop",
    },
    {
      _id: "default-2",
      title: "PostgreSQL Mastery: Schema Design & Index Tuning",
      category: "DATABASE SYSTEMS",
      nextLesson: "Relational Modeling & Integrity",
      progress: 42,
      lessonCount: "Lesson 5 of 12",
      rating: 4.8,
      instructor: "Krish Singh",
      initials: "KS",
      lastActive: "Yesterday",
      thumbnail:
        "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, liveRes] = await Promise.all([
          API.get("/course").catch(() => null),
          API.get("/live-class").catch(() => null),
        ]);

        if (courseRes?.data?.success && courseRes.data.courses?.length > 0) {
          const mapped = courseRes.data.courses.map((c) => ({
            _id: c._id,
            id: c._id,
            title: c.title,
            category: c.category || "ENGINEERING",
            nextLesson: c.subtitle || "Continue Learning",
            progress: 50,
            lessonCount: "Modules Ready",
            rating: c.averageRating || 4.9,
            instructor: c.instructor?.name || "Krish Singh",
            initials: (c.instructor?.name || "KS").substring(0, 2).toUpperCase(),
            lastActive: "Live Now",
            thumbnail: c.thumbnail,
          }));
          setCourses(mapped);
        } else {
          setCourses(defaultCourses);
        }

        if (liveRes?.data?.success && liveRes.data.liveClasses?.length > 0) {
          setLiveClasses(liveRes.data.liveClasses);
        }
      } catch (err) {
        console.error("Dashboard fetch error, using fallback:", err);
        setCourses(defaultCourses);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter courses based on search input
  const filteredCourses = courses.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.title?.toLowerCase().includes(q) ||
      c.category?.toLowerCase().includes(q) ||
      c.nextLesson?.toLowerCase().includes(q) ||
      c.instructor?.toLowerCase().includes(q)
    );
  });

  // Keyboard shortcut (Cmd+K / Ctrl+K) and outside-click handlers
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === "Escape") {
        setShowSearchDropdown(false);
        setShowNotifications(false);
      }
    };
    const handleClickOutside = (e) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      ) {
        setShowNotifications(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex-1 min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* 1. Header Toolbar */}
      <header className="sticky top-0 z-40 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-8 flex items-center justify-between shadow-xs transition-colors duration-200">
        {/* Breadcrumb & Sidebar Toggle */}
        <div className="flex items-center gap-3">
          {collapsed && (
            <button
              type="button"
              onClick={toggleSidebar}
              title="Show Navigation Sidebar"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition cursor-pointer"
            >
              <PanelLeft className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </button>
          )}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span>EduConnect</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-blue-600 dark:text-blue-400 font-semibold">
                Dashboard
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold mt-0.5">
              Student Overview
            </span>
          </div>
        </div>

        {/* Search, Theme Toggle, Notifications & Action */}
        <div className="flex items-center gap-3">
          {/* Interactive Search Bar */}
          <div className="relative w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => {
                if (searchQuery.trim()) setShowSearchDropdown(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery.trim()) {
                  setShowSearchDropdown(false);
                  navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
                }
              }}
              placeholder="Search courses, sessions, or lessons... (⌘K)"
              className="w-full h-9.5 pl-9 pr-12 rounded-xl bg-slate-100/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:bg-white dark:focus:bg-slate-900 transition"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setShowSearchDropdown(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                ⌘K
              </kbd>
            )}

            {/* Quick Search Results Dropdown */}
            {showSearchDropdown && searchQuery.trim() && (
              <div className="absolute left-0 right-0 top-11 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                <div className="p-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-800/80 px-3 flex items-center justify-between">
                  <span>Matching Results ({filteredCourses.length})</span>
                  <span className="text-[10px] font-normal text-slate-400">Press ↵ to view all</span>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {filteredCourses.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500">
                      No courses found matching "{searchQuery}"
                    </div>
                  ) : (
                    filteredCourses.map((c) => (
                      <Link
                        key={c.id || c._id}
                        to={`/course/${c.id || c._id}/learn`}
                        onClick={() => setShowSearchDropdown(false)}
                        className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center justify-between transition gap-2 group"
                      >
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {c.title}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {c.category} • {c.nextLesson}
                          </span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition shrink-0" />
                      </Link>
                    ))
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowSearchDropdown(false);
                    navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
                  }}
                  className="w-full block p-2 text-center text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/30 hover:bg-blue-100/50 transition cursor-pointer"
                >
                  View full search results in catalog →
                </button>
              </div>
            )}
          </div>

          <ThemeToggle />

          {/* Interactive Notifications Popover */}
          <div className="relative" ref={notificationRef}>
            <button
              type="button"
              onClick={() => setShowNotifications((prev) => !prev)}
              aria-label="Toggle notifications"
              className={`relative w-9.5 h-9.5 rounded-xl border shadow-xs flex items-center justify-center transition cursor-pointer ${
                showNotifications
                  ? "bg-blue-50 dark:bg-blue-950/60 border-blue-400 text-blue-600 dark:text-blue-400"
                  : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-750"
              }`}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900 animate-pulse"></span>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                <div className="p-3.5 px-4 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
                        setUnreadCount(0);
                      }}
                      className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Mark all as read</span>
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                  {notifications.map((item) => (
                    <Link
                      key={item.id}
                      to={item.link}
                      onClick={() => {
                        if (!item.read) {
                          setNotifications((prev) =>
                            prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
                          );
                          setUnreadCount((prev) => Math.max(0, prev - 1));
                        }
                        setShowNotifications(false);
                      }}
                      className={`p-3.5 flex items-start gap-3 transition hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                        !item.read ? "bg-blue-50/30 dark:bg-blue-950/20" : ""
                      }`}
                    >
                      <div className="mt-1 shrink-0">
                        {!item.read ? (
                          <span className="w-2 h-2 rounded-full bg-blue-600 block"></span>
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-transparent block"></span>
                        )}
                      </div>
                      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {item.title}
                          </span>
                          <span className="text-[10px] text-slate-400 shrink-0">{item.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                          {item.message}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="p-2.5 px-4 bg-slate-50 dark:bg-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">EduConnect LMS</span>
                  <Link
                    to="/assignments"
                    onClick={() => setShowNotifications(false)}
                    className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                  >
                    View All Activity →
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link
            to="/courses"
            className="h-9.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Explore Courses</span>
          </Link>
        </div>
      </header>

      {/* 2. Main Content Container */}
      <main className="p-8 max-w-7xl mx-auto flex flex-col gap-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Dashboard
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Overview of your active courses, scheduled live lectures, and progress.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/courses"
              className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 text-xs font-bold transition shadow-xs"
            >
              Browse Catalog
            </Link>
            <Link
              to="/live"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Join Live Classroom</span>
            </Link>
          </div>
        </div>

        {/* Metrics Overview Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Stat 1 */}
          <div className="flex items-center gap-3.5 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold truncate">
                Active Courses
              </span>
              <span className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight">
                {courses.length} Available
              </span>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="flex items-center gap-3.5 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <PieChart className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold truncate">
                Avg. Completion
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight">
                  84%
                </span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                  ↑ 4%
                </span>
              </div>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="flex items-center gap-3.5 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold truncate">
                Study Hours
              </span>
              <span className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight">
                38 hrs
              </span>
            </div>
          </div>

          {/* Stat 4 */}
          <div className="flex items-center gap-3.5 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold truncate">
                Pending Tasks
              </span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight">
                  2
                </span>
                <span className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 text-[10px] font-bold">
                  In Review
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Active In-Progress Courses Section */}
        <section className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {searchQuery.trim() ? `Search Results for "${searchQuery}"` : "Active In-Progress Courses"}
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {filteredCourses.length} {filteredCourses.length === 1 ? "Course" : "Courses"}
              </span>
            </div>
            {searchQuery.trim() ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-xs font-bold text-red-500 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset Search</span>
              </button>
            ) : (
              <Link
                to="/courses"
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition flex items-center gap-1 group"
              >
                <span>View All Catalog ({courses.length})</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            )}
          </div>

          {/* Course Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.length === 0 ? (
              <div className="col-span-full py-12 flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <Search className="w-10 h-10 text-slate-400 mb-3" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  No courses found matching "{searchQuery}"
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-4">
                  Try searching with different keywords, technology names like WebSockets, PostgreSQL, or browse all courses in the catalog.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                  >
                    Clear Filter
                  </button>
                  <Link
                    to="/courses"
                    className="px-4 py-2 rounded-xl bg-blue-600 text-xs font-bold text-white hover:bg-blue-700 transition"
                  >
                    Explore Catalog
                  </Link>
                </div>
              </div>
            ) : (
              filteredCourses.map((course) => (
              <div
                key={course.id || course._id}
                className="flex flex-col justify-between rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden group hover:-translate-y-0.5"
              >
                {/* Thumbnail Container */}
                <div className="relative w-full h-44 overflow-hidden bg-slate-900">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20"></div>

                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-900 dark:text-white text-[10px] font-extrabold tracking-wider uppercase">
                    {course.category}
                  </span>

                  <span className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-900 dark:text-white text-[11px] font-bold">
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
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 truncate">
                      <Play className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                      <span className="truncate">Next: {course.nextLesson}</span>
                    </p>
                  </div>

                  {/* Linear Progress Bar */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                      <span>{course.lessonCount}</span>
                      <span className="text-blue-600 dark:text-blue-400 font-bold">
                        {course.progress}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Instructor & Resume CTA */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-[11px]">
                        {course.initials}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {course.instructor}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">
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
            ))
            )}
          </div>
        </section>

        {/* 4. Upcoming Live Sessions Schedule */}
        <section className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-red-500" />
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Upcoming Live Sessions
              </h2>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            </div>

            <div className="flex items-center gap-3">
              <div className="inline-flex rounded-xl bg-slate-200/60 dark:bg-slate-800 p-0.5 text-xs font-bold">
                <button className="px-3 py-1 rounded-lg bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs">
                  Today
                </button>
                <button className="px-3 py-1 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition">
                  This Week
                </button>
                <button className="px-3 py-1 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition">
                  All Upcoming
                </button>
              </div>

              <button className="h-8 px-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 shadow-xs flex items-center gap-1.5 transition">
                <Calendar className="w-3.5 h-3.5" />
                <span>Sync Calendar</span>
              </button>
            </div>
          </div>

          {/* Live Session Cards */}
          {liveClasses && liveClasses.length > 0 ? (
            liveClasses.map((live) => (
              <div
                key={live._id}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 border border-red-200 dark:border-red-900/50">
                    <Radio className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 text-[10px] font-extrabold tracking-wider uppercase border border-red-200 dark:border-red-900/50">
                        {live.status === "ongoing" ? "🔴 LIVE NOW" : "SCHEDULED"}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
                        Room: #{live.roomId}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                      {live.title}
                    </h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Instructor: {live.instructor?.name || "Krish Singh"} •
                      Course:{" "}
                      {live.course?.title || "Full-Stack WebSockets Mastery"}
                    </span>
                  </div>
                </div>

                <Link
                  to={`/live/${live.roomId}`}
                  className="h-10 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 shadow-md shadow-red-500/20 transition active:scale-[0.98]"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Join Stream Console</span>
                </Link>
              </div>
            ))
          ) : (
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 border border-red-200 dark:border-red-900/50">
                  <Radio className="w-6 h-6 animate-pulse" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 text-[10px] font-extrabold tracking-wider uppercase border border-red-200 dark:border-red-900/50">
                      STARTS IN 45 MINS
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
                      Room: #LC-LIVE-892
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                    Real-Time WebSockets & Node.js System Architecture with Krish
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Instructor: Krish Singh • Course: Full-Stack WebSockets
                    Mastery
                  </span>
                </div>
              </div>

              <Link
                to="/live/LC-WEBSOCKET-2026"
                className="h-10 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 shadow-md shadow-red-500/20 transition active:scale-[0.98]"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Join Stream Console</span>
              </Link>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
