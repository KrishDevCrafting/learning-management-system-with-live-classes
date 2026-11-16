import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Theme state: "light" | "dark" | "system"
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem("theme") || "system";
  });

  const [resolvedTheme, setResolvedTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") return "dark";
    if (saved === "light") return "light";
    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  const applyTheme = (targetTheme) => {
    const isDark =
      targetTheme === "dark" ||
      (targetTheme === "system" &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Keep meta[name="color-scheme"] in sync
    const meta = document.querySelector('meta[name="color-scheme"]');
    if (meta) {
      meta.content = targetTheme === "system" ? "light dark" : targetTheme;
    }

    setResolvedTheme(isDark ? "dark" : "light");
  };

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    if (newTheme === "system") {
      localStorage.removeItem("theme");
    } else {
      localStorage.setItem("theme", newTheme);
    }
    applyTheme(newTheme);
  };

  const toggleTheme = () => {
    const next = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(next);
  };

  // Sync with system preferences and storage events
  useEffect(() => {
    applyTheme(theme);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = () => {
      if (theme === "system") {
        applyTheme("system");
      }
    };

    const handleStorageChange = (e) => {
      if (e.key === "theme") {
        const extTheme = e.newValue || "system";
        setThemeState(extTheme);
        applyTheme(extTheme);
      }
    };

    mediaQuery.addEventListener("change", handleSystemChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        isDark: resolvedTheme === "dark",
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export default ThemeContext;

