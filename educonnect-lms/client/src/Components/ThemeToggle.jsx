import React from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "../Context/ThemeContext";

export default function ThemeToggle({ variant = "icon" }) {
  const { theme, resolvedTheme, isDark, setTheme, toggleTheme } = useTheme();

  if (variant === "segmented") {
    return (
      <div className="inline-flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
        <button
          type="button"
          onClick={() => setTheme("light")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            theme === "light"
              ? "bg-white text-slate-900 shadow-xs"
              : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          }`}
        >
          <Sun className="w-3.5 h-3.5 text-amber-500" />
          <span>Light</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme("dark")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            theme === "dark"
              ? "bg-slate-900 text-white shadow-xs dark:bg-blue-600"
              : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          }`}
        >
          <Moon className="w-3.5 h-3.5 text-blue-400" />
          <span>Dark</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme("system")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            theme === "system"
              ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
              : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>System ({resolvedTheme})</span>
        </button>
      </div>
    );
  }

  // Default compact icon button
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center transition active:scale-95 shadow-xs"
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-blue-600 transition-transform duration-300 rotate-0 hover:-rotate-12" />
      )}
    </button>
  );
}
