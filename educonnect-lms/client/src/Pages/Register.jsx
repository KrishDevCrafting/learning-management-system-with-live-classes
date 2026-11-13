import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../axios";
import { useAuth } from "../Context/AuthContext";
import {
  GraduationCap,
  User,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Loader2,
  BookOpen,
  Video,
} from "lucide-react";
export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/auth/register", {
        name,
        email,
        password,
        role,
      });
      if (res.data.success) {
        // Auto-login with received token and user object
        login(res.data.user, res.data.token);
        navigate("/");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please check your details.",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Brand Logo */}
        <div className="inline-flex w-12 h-12 rounded-2xl bg-blue-600 items-center justify-center text-white shadow-lg shadow-blue-500/20 mb-3">
          <GraduationCap className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Create your EduConnect Account
        </h2>
        <p className="mt-1 text-xs text-slate-500 font-medium">
          Join thousands of engineers and mentors learning in real time
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-xs border border-slate-200/80 rounded-2xl sm:px-10">
          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* 1. Role Selection Cards */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                I want to join as:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`p-3 rounded-xl border text-left transition flex flex-col gap-1 ${
                    role === "student"
                      ? "border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <BookOpen
                      className={`w-4 h-4 ${role === "student" ? "text-blue-600" : "text-slate-400"}`}
                    />
                    <span
                      className={`w-2 h-2 rounded-full ${role === "student" ? "bg-blue-600" : "bg-slate-300"}`}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-900 mt-1">
                    Student
                  </span>
                  <span className="text-[10px] text-slate-500">
                    I want to learn
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("instructor")}
                  className={`p-3 rounded-xl border text-left transition flex flex-col gap-1 ${
                    role === "instructor"
                      ? "border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Video
                      className={`w-4 h-4 ${role === "instructor" ? "text-blue-600" : "text-slate-400"}`}
                    />
                    <span
                      className={`w-2 h-2 rounded-full ${role === "instructor" ? "bg-blue-600" : "bg-slate-300"}`}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-900 mt-1">
                    Instructor
                  </span>
                  <span className="text-[10px] text-slate-500">
                    I want to teach
                  </span>
                </button>
              </div>
            </div>
            {/* 2. Full Name Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Krish Singh"
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition"
                />
              </div>
            </div>
            {/* 3. Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="krish@engineer.io"
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition"
                />
              </div>
            </div>
            {/* 4. Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  minLength={6}
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition"
                />
              </div>
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 mt-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Complete Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
          {/* Footer Link to Login */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500 font-medium">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-blue-600 hover:text-blue-700 transition"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
