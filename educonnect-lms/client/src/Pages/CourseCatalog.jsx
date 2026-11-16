import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../axios";
import {
  Search,
  Filter,
  Star,
  Clock,
  BookOpen,
  ArrowRight,
  Sparkles,
  Users,
  CheckCircle2,
  GraduationCap,
} from "lucide-react";

export default function CourseCatalog() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");

  const categories = [
    "All",
    "Backend Development",
    "Database Systems",
    "Full-Stack",
    "System Design",
  ];

  const levels = ["All", "Beginner", "Intermediate", "Advanced"];

  const defaultCatalog = [
    {
      _id: "c1",
      title: "Real-Time WebSockets & Node.js System Architecture",
      subtitle:
        "Build high-scale bidirectional real-time event systems with Socket.io & Redis",
      category: "Backend Development",
      level: "Intermediate",
      price: 49,
      rating: 4.9,
      enrolledStudentsCount: 38,
      instructor: { name: "Krish Singh", avatar: "" },
      thumbnail:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop",
    },
    {
      _id: "c2",
      title: "PostgreSQL Mastery: Schema Design & Index Tuning",
      subtitle:
        "From relational normalization to B-Tree indexes, JSONB & query optimization",
      category: "Database Systems",
      level: "Advanced",
      price: 59,
      rating: 4.8,
      enrolledStudentsCount: 24,
      instructor: { name: "Krish Singh", avatar: "" },
      thumbnail:
        "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop",
    },
    {
      _id: "c3",
      title: "Cloud-Native Microservices with Docker & Kubernetes",
      subtitle:
        "Containerization, service discovery, ingress, and horizontal pod autoscaling",
      category: "Backend Development",
      level: "Intermediate",
      price: 69,
      rating: 4.9,
      enrolledStudentsCount: 52,
      instructor: { name: "Sarah Jenkins", avatar: "" },
      thumbnail:
        "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=800&auto=format&fit=crop",
    },
    {
      _id: "c4",
      title: "Applied LLM Engineering & Autonomous Agent Architectures",
      subtitle:
        "Function calling, tool integration, multi-agent swarms, and RAG pipelines",
      category: "Full-Stack",
      level: "Advanced",
      price: 89,
      rating: 5.0,
      enrolledStudentsCount: 45,
      instructor: { name: "Alex Chen", avatar: "" },
      thumbnail:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop",
    },
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await API.get("/course");
        if (res.data?.success && res.data.courses?.length > 0) {
          setCourses(res.data.courses);
        } else {
          setCourses(defaultCatalog);
        }
      } catch (err) {
        console.error("Catalog fetch error:", err);
        setCourses(defaultCatalog);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.subtitle?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" ||
      c.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesLevel =
      selectedLevel === "All" ||
      c.level?.toLowerCase() === selectedLevel.toLowerCase();
    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="flex-1 min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans pb-16 transition-colors duration-200">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-8 py-10 transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-bold w-fit">
              <GraduationCap className="w-4 h-4" />
              <span>Curated Engineering Syllabus</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Course Catalog
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl">
              Production-grade curriculum built for software engineers, backend
              architects, and systems builders.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by topic, keyword, or stack..."
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 mt-8 flex flex-col gap-6">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Level Filter Dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              Level:
            </span>
            <div className="inline-flex rounded-lg bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 p-0.5 text-xs">
              {levels.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition ${
                    selectedLevel === lvl
                      ? "bg-slate-900 dark:bg-blue-600 text-white"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>
            Showing{" "}
            <strong className="text-slate-800 dark:text-white">
              {filteredCourses.length}
            </strong>{" "}
            courses
          </span>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course._id || course.id}
              className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Card Media Stage */}
              <div>
                <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  {/* Level Badge */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/10">
                    {course.level || "Intermediate"}
                  </span>

                  {/* Rating Badge */}
                  <span className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/95 dark:bg-slate-900/90 backdrop-blur-md text-slate-900 dark:text-white text-[11px] font-bold">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>{course.averageRating || course.rating || 4.9}</span>
                  </span>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px] font-medium">
                    <span className="flex items-center gap-1.5 opacity-90">
                      <Users className="w-3.5 h-3.5" />
                      <span>{course.enrolledStudentsCount || 34} Engineers</span>
                    </span>
                    <span className="font-extrabold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                      {course.price ? `$${course.price}` : "Free"}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex flex-col gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    {course.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {course.subtitle || course.description}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-[11px]">
                    {(course.instructor?.name || "Krish")
                      .substring(0, 2)
                      .toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {course.instructor?.name || "Krish Singh"}
                  </span>
                </div>

                <Link
                  to={`/course/${course._id || course.id}/learn`}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition"
                >
                  <span>Start Learning</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
