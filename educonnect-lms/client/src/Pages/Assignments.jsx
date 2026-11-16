import React, { useState } from "react";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Upload,
  Calendar,
  Code2,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

export default function Assignments() {
  const [filter, setFilter] = useState("all");

  const assignments = [
    {
      id: "ASG-101",
      title: "Real-Time Chat Broker with Redis Pub/Sub",
      course: "Real-Time WebSockets & Node.js System Architecture",
      dueDate: "Tomorrow @ 11:59 PM",
      status: "pending",
      points: "100 pts",
      description:
        "Implement a horizontal Redis adapter for Socket.io that broadcasts events across 3 load-balanced Node instances.",
      tag: "SYSTEM DESIGN",
    },
    {
      id: "ASG-102",
      title: "PostgreSQL B-Tree Index Optimization Challenge",
      course: "PostgreSQL Mastery: Schema Design & Index Tuning",
      dueDate: "Nov 20, 2026",
      status: "pending",
      points: "80 pts",
      description:
        "Analyze EXPLAIN ANALYZE queries on a 1,000,000 row orders table and reduce execution time below 25ms using partial indexes.",
      tag: "DATABASE",
    },
    {
      id: "ASG-103",
      title: "JWT Authentication & Session Revocation Architecture",
      course: "Full-Stack Security & Enterprise Auth",
      dueDate: "Nov 12, 2026",
      status: "submitted",
      grade: "98/100",
      feedback: "Exceptional error handling and secure HTTP-only cookie implementation!",
      points: "100 pts",
      description:
        "Build dual token system (Access Token + Refresh Token rotation with Redis blacklist).",
      tag: "SECURITY",
    },
  ];

  const filtered = assignments.filter((a) => {
    if (filter === "pending") return a.status === "pending";
    if (filter === "submitted") return a.status === "submitted";
    return true;
  });

  return (
    <div className="flex-1 min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans pb-16 transition-colors duration-200">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-8 py-10 transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-bold w-fit">
              <Code2 className="w-4 h-4" />
              <span>Engineering Deliverables</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Assignments & Project Tasks
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl">
              Hands-on lab challenges reviewed by senior software architects.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-bold">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg transition ${
                filter === "all"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              All ({assignments.length})
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-4 py-2 rounded-lg transition ${
                filter === "pending"
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Pending (2)
            </button>
            <button
              onClick={() => setFilter("submitted")}
              className={`px-4 py-2 rounded-lg transition ${
                filter === "submitted"
                  ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Completed (1)
            </button>
          </div>
        </div>
      </div>

      {/* Assignments List */}
      <div className="max-w-7xl mx-auto px-8 mt-8 flex flex-col gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                  item.status === "submitted"
                    ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                    : "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                }`}
              >
                <FileText className="w-6 h-6" />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    {item.tag}
                  </span>
                  <span className="text-slate-300 dark:text-slate-600">•</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-mono font-bold">
                    {item.id}
                  </span>
                  <span className="text-slate-300 dark:text-slate-600">•</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{item.course}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
                  {item.description}
                </p>

                {item.feedback && (
                  <div className="mt-2 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <span>
                      <strong>Instructor Feedback:</strong> {item.feedback}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Meta & CTA */}
            <div className="flex items-center gap-4 shrink-0 self-end md:self-center">
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Due {item.dueDate}</span>
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">
                  {item.grade ? `Graded: ${item.grade}` : item.points}
                </span>
              </div>

              {item.status === "pending" ? (
                <button
                  onClick={() => alert(`Ready to upload solution for ${item.id}!`)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition active:scale-95"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Submit Work</span>
                </button>
              ) : (
                <span className="px-3 py-1.5 rounded-xl bg-emerald-100/80 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center gap-1 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Submitted</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
