import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import {
  LayoutDashboard,
  Terminal,
  BookOpen,
  Radio,
  FileText,
  Settings,
  GraduationCap,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const { user, logout, isInstructor } = useAuth();
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", path: "/", icon: LayoutDashboard },
    { label: "My Learning", path: "/my-learning", icon: Terminal },
    { label: "Course Catalog", path: "/courses", icon: BookOpen },
    {
      label: "Live Classrooms",
      path: "/live",
      icon: Radio,
      badge: "LIVE",
      badgeColor: "bg-red-500/10 text-red-500 border border-red-500/20",
    },
    { label: "Assignments", path: "/assignments", icon: FileText, count: 3 },
    { label: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between z-50 shadow-sm font-sans">
      {/* Brand Header */}
      <div className="flex flex-col">
        <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-slate-900 leading-none">
              EduConnect
            </span>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mt-1">
              Engineering LMS
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1 px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? "bg-blue-50 text-blue-600 shadow-xs"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-blue-600" : "text-slate-400"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {/* Optional Badges */}
                {item.badge && (
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider animate-pulse bg-red-50 text-red-600 border border-red-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    {item.badge}
                  </span>
                )}
                {item.count && (
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile Footer Card */}
      <div className="p-3 m-3 rounded-2xl bg-slate-50 border border-slate-200/60 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0 font-bold text-xs shadow-sm">
            {user?.name ? user.name.substring(0, 2).toUpperCase() : "KS"}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-bold text-slate-900 truncate">
              {user?.name || "Krish Singh"}
            </span>
            <span className="text-[11px] text-slate-400 truncate">
              {user?.email || "krish@engineer.io"}
            </span>
          </div>
          <button
            onClick={logout}
            title="Logout"
            className="text-slate-400 hover:text-red-500 transition p-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Role Switch Pill */}
        <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between">
          <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">
            Mode
          </span>
          <div className="inline-flex items-center rounded-lg bg-slate-200/60 p-0.5">
            <button
              type="button"
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                !isInstructor
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Student
            </button>
            <button
              type="button"
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                isInstructor
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Instructor
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
