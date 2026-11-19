import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { useSidebar } from "../Context/SidebarContext";
import {
  LayoutDashboard,
  Terminal,
  BookOpen,
  Radio,
  FileText,
  Settings,
  GraduationCap,
  LogOut,
  PenLine,
  PanelLeftClose,
} from "lucide-react";

export default function Sidebar() {
  const { user, logout, isInstructor } = useAuth();
  const { collapsed, toggleSidebar } = useSidebar();
  const location = useLocation();

  const studentItems = [
    { label: "Dashboard", path: "/", icon: LayoutDashboard },
    { label: "My Learning", path: "/my-learning", icon: Terminal },
    { label: "Course Catalog", path: "/courses", icon: BookOpen },
    {
      label: "Live Classrooms",
      path: "/live",
      icon: Radio,
      badge: "LIVE",
      badgeColor:
        "bg-red-500/10 dark:bg-red-500/20 text-red-500 border border-red-500/20",
    },
    { label: "Assignments", path: "/assignments", icon: FileText, count: 3 },
    { label: "Settings", path: "/settings", icon: Settings },
  ];

  const instructorItems = [
    {
      label: "Instructor Studio",
      path: "/instructor/dashboard",
      icon: PenLine,
      badge: "PRO",
      badgeColor:
        "bg-blue-500/10 dark:bg-blue-500/20 text-blue-500 border border-blue-500/20",
    },
    { label: "Dashboard", path: "/", icon: LayoutDashboard },
    { label: "Course Catalog", path: "/courses", icon: BookOpen },
    {
      label: "Live Classrooms",
      path: "/live",
      icon: Radio,
      badge: "LIVE",
      badgeColor:
        "bg-red-500/10 dark:bg-red-500/20 text-red-500 border border-red-500/20",
    },
    { label: "My Learning", path: "/my-learning", icon: Terminal },
    { label: "Assignments", path: "/assignments", icon: FileText },
    { label: "Settings", path: "/settings", icon: Settings },
  ];

  const navItems = isInstructor ? instructorItems : studentItems;

  return (
    <aside
      className={`fixed left-0 top-0 h-screen w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col justify-between z-50 shadow-xs font-sans transition-all duration-300 ${
        collapsed ? "-translate-x-full" : "translate-x-0"
      }`}
    >
      {/* Brand Header with Custom Logo */}
      <div className="flex flex-col">
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <Link to="/" className="flex items-center gap-2 group min-w-0">
            {/* Custom Modern SVG Logo */}
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-all duration-200 shrink-0">
              <svg
                className="w-5 h-5 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5" />
              </svg>
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-slate-900"></span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-[15px] tracking-tight text-slate-900 dark:text-white leading-none">
                  EduConnect
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 leading-none">
                  LMS
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold mt-1 truncate">
                Engineering Platform
              </span>
            </div>
          </Link>
          <button
            type="button"
            onClick={toggleSidebar}
            title="Collapse Sidebar"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
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
                    ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-slate-400 dark:text-slate-500"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 text-[9px] font-extrabold rounded-md tracking-wider ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}

                {item.count && (
                  <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold flex items-center justify-center">
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile Section */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
          <div className="w-9 h-9 rounded-lg bg-blue-600 text-white font-extrabold flex items-center justify-center text-xs shadow-xs">
            {(user?.name || "Krish").substring(0, 2).toUpperCase()}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {user?.name || "Krish Singh"}
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
              {user?.email || "krish@engineer.io"}
            </span>
          </div>
          <button
            onClick={logout}
            title="Logout"
            className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition p-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Role Switch Pill */}
        <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[10px] uppercase text-slate-400 dark:text-slate-500 font-bold tracking-wider">
            Mode
          </span>
          <div className="inline-flex items-center rounded-lg bg-slate-200/60 dark:bg-slate-800 p-0.5">
            <Link
              to="/"
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                location.pathname !== "/instructor/dashboard"
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Student
            </Link>
            <Link
              to="/instructor/dashboard"
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                location.pathname === "/instructor/dashboard"
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Instructor
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
