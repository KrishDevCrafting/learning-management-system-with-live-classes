import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./Components/Sidebar";
import Dashboard from "./Components/Dashboard";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import CourseWatch from "./Pages/CourseWatch";

export default function App() {
  return (
    <Routes>
      {/* 1. Auth Pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 2. Standalone Classroom Video Stage (No Sidebar clutter) */}
      <Route path="/course/:id/learn" element={<CourseWatch />} />

      {/* 3. Main LMS Workspace (With Left Sidebar Navigation) */}
      <Route
        path="/*"
        element={
          <div className="flex min-h-screen bg-slate-50 antialiased font-sans">
            <Sidebar />
            <div className="pl-64 flex-1 flex flex-col min-w-0">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/my-learning" element={<Dashboard />} />
                <Route path="/courses" element={<Dashboard />} />
                <Route path="/live" element={<Dashboard />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </div>
        }
      />
    </Routes>
  );
}
