import React from "react";
import { Routes, Route, Navigate, useLocation, Link } from "react-router-dom";
import Sidebar from "./Components/Sidebar";
import Dashboard from "./Components/Dashboard";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import CourseWatch from "./Pages/CourseWatch";
import LiveClassRoom from "./Pages/LiveClassRoom";
import CourseCatalog from "./Pages/CourseCatalog";
import MyLearning from "./Pages/MyLearning";
import Assignments from "./Pages/Assignments";
import Settings from "./Pages/Settings";
import InstructorDashboard from "./Pages/InstructorDashboard";
import { ProtectedRoute, PublicOnlyRoute } from "./Components/ProtectedRoute";
import { useSidebar } from "./Context/SidebarContext";
import ThemeToggle from "./Components/ThemeToggle";
import { Menu } from "lucide-react";

export default function App() {
  const { collapsed, toggleSidebar } = useSidebar();
  const location = useLocation();
  const isLivePage = location.pathname.startsWith("/live");

  return (
    <Routes>
      {/* 1. Auth Pages (Public Only: If logged in, redirect to Dashboard) */}
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <Register />
          </PublicOnlyRoute>
        }
      />

      {/* 2. Standalone Immersive Course Player (Protected: Require Login) */}
      <Route
        path="/course/:id/learn"
        element={
          <ProtectedRoute>
            <CourseWatch />
          </ProtectedRoute>
        }
      />

      {/* 3. Main LMS Workspace with Sidebar (Protected: Require Login) */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased font-sans transition-colors duration-200 relative overflow-x-hidden">
              <Sidebar />

              {/* Mobile Drawer Backdrop Overlay */}
              {!collapsed && (
                <div
                  onClick={toggleSidebar}
                  className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 md:hidden transition-opacity"
                  aria-hidden="true"
                />
              )}

              <div
                className={`${
                  collapsed ? "pl-0" : "pl-0 md:pl-64"
                } flex-1 flex flex-col min-w-0 w-full transition-all duration-300`}
              >
                {/* Mobile Top App Bar (Shown on mobile for non-live pages) */}
                {!isLivePage && (
                  <header className="md:hidden sticky top-0 z-30 h-14 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={toggleSidebar}
                        aria-label="Toggle navigation menu"
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition cursor-pointer"
                      >
                        <Menu className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </button>
                      <Link to="/" className="flex items-center gap-1.5 font-bold text-sm tracking-tight">
                        <span className="text-slate-900 dark:text-white">EduConnect</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-extrabold bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60">
                          LMS
                        </span>
                      </Link>
                    </div>
                    <div className="flex items-center gap-2">
                      <ThemeToggle />
                    </div>
                  </header>
                )}

                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route
                    path="/instructor/dashboard"
                    element={<InstructorDashboard />}
                  />
                  <Route path="/my-learning" element={<MyLearning />} />
                  <Route path="/courses" element={<CourseCatalog />} />
                  <Route path="/assignments" element={<Assignments />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/live" element={<LiveClassRoom />} />
                  <Route path="/live/:roomId" element={<LiveClassRoom />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
