import React from "react";
import Sidebar from "./Components/Sidebar";
import Dashboard from "./Components/Dashboard";

export default function App() {
  return (
    <div className="flex min-h-screen bg-slate-50 antialiased font-sans">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar />

      {/* 2. Main Dashboard Content (Offset by Sidebar width) */}
      <div className="pl-64 flex-1 flex flex-col min-w-0">
        <Dashboard />
      </div>
    </div>
  );
}
