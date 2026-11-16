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
import { ProtectedRoute, PublicOnlyRoute } from "./Components/ProtectedRoute";

export default function App() {
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

      {/* 2. Standalone Immersive Video Classrooms (Protected: Require Login) */}
      <Route
        path="/course/:id/learn"
        element={
          <ProtectedRoute>
            <CourseWatch />
          </ProtectedRoute>
        }
      />
      <Route
        path="/live/:roomId"
        element={
          <ProtectedRoute>
            <LiveClassRoom />
          </ProtectedRoute>
        }
      />
      <Route
        path="/live"
        element={
          <ProtectedRoute>
            <LiveClassRoom />
          </ProtectedRoute>
        }
      />

      {/* 3. Main LMS Workspace (Protected: Require Login) */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <div className="flex min-h-screen bg-slate-50 antialiased font-sans">
              <Sidebar />
              <div className="pl-64 flex-1 flex flex-col min-w-0">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/my-learning" element={<MyLearning />} />
                  <Route path="/courses" element={<CourseCatalog />} />
                  <Route path="/assignments" element={<Assignments />} />
                  <Route path="/settings" element={<Settings />} />
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
