import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { GraduationCap, LogOut, BookOpen, Video, User } from "lucide-react";

export default function Navbar() {
  const { user, isAuthenticated, isInstructor, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <nav className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:px-8 h-16 flex item-center justify-between">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-sky-400"
          >
            <GraduationCap className="w-7 h-7" />
            <span>
              EduConnect<spna className="text-white"></spna>LMS
            </span>
          </Link>

          {/* Navigation Links */}

          <div className="flex item-cener gap-6 text-sm font-medim text-slae-300 hover:text-shite transition">
            <Link
              to="/courses"
              className="flex item-center gap-1.5 text-slate-300 hover:text-white transition"
            >
              <BookOpen className="w-4 h-4" />
              <span>Courses</span>
            </Link>

            {/* Conditional: If User is Logged In */}
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                {isInstructor ? (
                  <Link
                    to="/instructor/dashboard"
                    className="bg-sky-600 hover:bg-sky-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                  >
                    Instructor Studio
                  </Link>
                ) : (
                  <Link
                    to="/my-learning"
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                  >
                    My Learning
                  </Link>
                )}
                {/* User Profile Badge */}
                <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
                  <User className="w-4 h-4 text-sky-400" />
                  <span className="text-xs font-semibold text-slate-200">
                    {user?.name || "User"}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider bg-slate-700 px-1.5 py-0.5 rounded text-slate-300">
                    {user?.role}
                  </span>
                </div>
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-red-400 hover:text-red-300 text-sm font-medium transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              /* If User is NOT Logged In */
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-slate-300 hover:text-white px-3 py-1.5 text-sm font-medium transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold px-4 py-1.5 rounded-lg text-sm transition"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
