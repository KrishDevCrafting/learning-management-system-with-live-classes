import React, { createContext, useContext, useState, useEffect } from "react";

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [collapsed, setCollapsed] = useState(() => {
    // If mobile viewport, default to collapsed
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      return true;
    }
    return localStorage.getItem("sidebar_collapsed") === "true";
  });

  const toggleSidebar = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("sidebar_collapsed", String(next));
      return next;
    });
  };

  const closeMobileSidebar = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setCollapsed(true);
    }
  };

  return (
    <SidebarContext.Provider
      value={{ collapsed, setCollapsed, toggleSidebar, closeMobileSidebar }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const ctx = useContext(SidebarContext);
  return (
    ctx || {
      collapsed: false,
      setCollapsed: () => {},
      toggleSidebar: () => {},
      closeMobileSidebar: () => {},
    }
  );
};

