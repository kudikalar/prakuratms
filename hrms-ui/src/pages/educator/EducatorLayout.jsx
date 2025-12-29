import { Outlet, useLocation } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FaBars,
  FaSignOutAlt,
  FaChalkboardTeacher,
  FaChevronRight,
  FaHome,
  FaExclamationTriangle,
} from "react-icons/fa";

import EducatorSidebar from "../../components/EducatorSidebar";

/* =====================================================
   EDUCATOR LAYOUT – FINAL PRODUCTION READY (NO GAP)
===================================================== */

const SESSION_TIMEOUT = 30 * 60 * 1000;
const WARNING_BEFORE = 2 * 60 * 1000;

export default function EducatorLayout() {
  const location = useLocation();

  const [hideHeader, setHideHeader] = useState(false);
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  /* ================= USER ================= */

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  }, []);

  /* ================= LOGOUT ================= */

  const logout = useCallback(() => {
    localStorage.clear();
    window.location.replace("/#/login");
  }, []);

  /* ================= MOBILE SIDEBAR OPEN ================= */

  const openSidebar = useCallback(() => {
    window.dispatchEvent(new CustomEvent("OPEN_EDUCATOR_SIDEBAR"));
  }, []);

  /* ================= PAGE TITLE ================= */

  const pageTitle = useMemo(() => {
    const path = location.pathname;
    if (path.includes("/dashboard")) return "Dashboard";
    if (path.includes("/assigned-courses")) return "Assigned Courses";
    if (path.includes("/course-content")) return "Course Content";
    if (path.includes("/lesson-planner")) return "Lesson Planner";
    if (path.includes("/my-batches")) return "My Batches";
    if (path.includes("/students")) return "Students";
    if (path.includes("/schedule")) return "Schedule";
    if (path.includes("/attendance")) return "Attendance";
    if (path.includes("/performance")) return "Performance";
    if (path.includes("/batch-analytics")) return "Batch Analytics";
    return "Educator Panel";
  }, [location.pathname]);

  /* ================= BREADCRUMBS ================= */

  const breadcrumbs = useMemo(() => {
    const parts = location.pathname
      .replace("/educator", "")
      .split("/")
      .filter(Boolean);

    let path = "/educator";
    return parts.map((p) => {
      path += `/${p}`;
      return { label: p.replace(/-/g, " ").toUpperCase(), path };
    });
  }, [location.pathname]);

  /* ================= SESSION TIMEOUT ================= */

  useEffect(() => {
    let lastActivity = Date.now();

    const resetTimer = () => {
      lastActivity = Date.now();
      setShowTimeoutWarning(false);
    };

    const checkSession = () => {
      const elapsed = Date.now() - lastActivity;
      const remaining = SESSION_TIMEOUT - elapsed;

      if (remaining <= WARNING_BEFORE && remaining > 0) {
        setRemainingTime(Math.ceil(remaining / 1000));
        setShowTimeoutWarning(true);
      }
      if (remaining <= 0) logout();
    };

    const interval = setInterval(checkSession, 1000);
    ["click", "mousemove", "keydown", "scroll"].forEach((e) =>
      window.addEventListener(e, resetTimer)
    );

    return () => {
      clearInterval(interval);
      ["click", "mousemove", "keydown", "scroll"].forEach((e) =>
        window.removeEventListener(e, resetTimer)
      );
    };
  }, [logout]);

  /* ================= HEADER AUTO HIDE ================= */

  useEffect(() => {
    let lastScroll = 0;
    const onScroll = () => {
      const current = window.scrollY;
      setHideHeader(current > lastScroll && current > 80);
      lastScroll = current;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ================= UI ================= */

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-50">

      {/* SIDEBAR (FIXED, OVERLAY STYLE) */}
      <EducatorSidebar />

      {/* MAIN CONTENT (NO LEFT MARGIN – NO GAP) */}
      <div className="flex flex-col flex-1 overflow-hidden relative transition-all duration-300">

        {/* HEADER */}
        <header
          className={`bg-white/80 backdrop-blur-2xl border-b shadow
          transition-transform duration-300 z-30
          ${hideHeader ? "-translate-y-full md:translate-y-0" : ""}`}
        >
          <div className="flex items-center justify-between px-4 md:px-8 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={openSidebar}
                className="md:hidden p-2 rounded-full bg-white border shadow"
              >
                <FaBars className="text-indigo-700" />
              </button>

              <div>
                <h1 className="text-lg font-semibold text-slate-800">
                  {pageTitle}
                </h1>
                <span
                  className="inline-flex items-center gap-2 text-xs font-semibold
                  px-3 py-0.5 rounded-full bg-blue-100 text-blue-700 mt-1"
                >
                  <FaChalkboardTeacher /> EDUCATOR
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 rounded-full
              bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>

          {/* BREADCRUMBS */}
          <div className="px-4 md:px-8 py-2 flex items-center gap-2 text-xs text-slate-600">
            <FaHome />
            <span>EDUCATOR</span>
            {breadcrumbs.map((c, i) => (
              <span key={c.path} className="flex items-center gap-2">
                <FaChevronRight />
                <span
                  className={
                    i === breadcrumbs.length - 1
                      ? "text-indigo-600 font-semibold"
                      : ""
                  }
                >
                  {c.label}
                </span>
              </span>
            ))}
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto">
          <div className="min-h-full p-4 md:p-6 animate-fadeIn">
            <Outlet />
          </div>
        </main>
      </div>

      {/* SESSION WARNING */}
      {showTimeoutWarning && (
        <div className="fixed bottom-4 right-4 z-50 bg-red-50 border rounded-xl p-4 shadow">
          <div className="flex gap-3">
            <FaExclamationTriangle className="text-red-600 mt-1" />
            <div>
              <p className="font-semibold text-red-700">Session Expiring</p>
              <p className="text-xs text-red-600">
                Logging out in {remainingTime}s
              </p>
              <button
                onClick={() => setShowTimeoutWarning(false)}
                className="mt-2 text-xs text-indigo-600 font-semibold"
              >
                Continue Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
