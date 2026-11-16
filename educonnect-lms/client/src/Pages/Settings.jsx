import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import ThemeToggle from "../Components/ThemeToggle";
import {
  Settings as SettingsIcon,
  User,
  Mail,
  Shield,
  Bell,
  Lock,
  CheckCircle2,
  Save,
  Laptop,
  Moon,
  Sun,
} from "lucide-react";

export default function Settings() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "Krish Singh");
  const [email] = useState(user?.email || "krish@developer.io");
  const [role] = useState(user?.role || "student");
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex-1 min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans pb-16 transition-colors duration-200">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-8 py-10 transition-colors duration-200">
        <div className="max-w-4xl mx-auto flex flex-col gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold w-fit">
            <SettingsIcon className="w-4 h-4 text-slate-500" />
            <span>Preferences & Account</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Account Settings
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage your personal profile, visual theme, role permissions, and learning preferences.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 mt-8 flex flex-col gap-8">
        {/* Profile Card */}
        <form
          onSubmit={handleSave}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs flex flex-col gap-6 transition-colors duration-200"
        >
          <div className="flex items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-md shadow-blue-500/20">
              {name.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{name}</h2>
              <span className="text-xs text-slate-400 dark:text-slate-500">{email}</span>
              <span className="mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 w-fit">
                {role}
              </span>
            </div>
          </div>

          {saved && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Settings updated successfully!</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-5 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>

        {/* Visual Appearance & Theme Switcher */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs flex flex-col gap-4 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Interface Color Scheme
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose between Light, Dark, or automatically match your operating system theme.
              </p>
            </div>
            <ThemeToggle variant="segmented" />
          </div>
        </div>

        {/* Security & System Info */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs flex flex-col gap-4 transition-colors duration-200">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              System Environment & Security
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700">
              <span className="text-slate-400 dark:text-slate-500 block mb-1">Authentication</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                JWT (Signed 7 Days)
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700">
              <span className="text-slate-400 dark:text-slate-500 block mb-1">Database Cluster</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                MongoDB Atlas (Cluster0)
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700">
              <span className="text-slate-400 dark:text-slate-500 block mb-1">Real-Time Engine</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                Socket.io WebSocket
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
