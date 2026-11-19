import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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

export default function App() {
  const { collapsed } = useSidebar();

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
            <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased font-sans transition-colors duration-200">
              <Sidebar />
              <div
                className={`${
                  collapsed ? "pl-0" : "pl-64"
                } flex-1 flex flex-col min-w-0 transition-all duration-300`}
              >
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
