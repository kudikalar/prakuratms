import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useMemo, useCallback, useEffect, useState } from "react";
import {
  FaSignOutAlt,
  FaBars,
  FaHome,
  FaBookOpen,
  FaClipboardList,
  FaUser,
} from "react-icons/fa";
import AdminSidebar from "../../components/AdminSidebar";

/* ================= STUDENT LAYOUT ================= */

export default function StudentLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [hideHeader, setHideHeader] = useState(false);

  /* ================= USER ================= */
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  }, []);

  /* ================= ACTIONS ================= */

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("loginRole");
  navigate("/login");
};


  const openSidebar = useCallback(() => {
    window.dispatchEvent(
      new CustomEvent("OPEN_ADMIN_SIDEBAR", { bubbles: true })
    );
  }, []);

  /* ================= PAGE TITLE ================= */

  const getTitle = useMemo(() => {
    const path = location.pathname;

    if (path.includes("/dashboard")) return "Dashboard";
    if (path.includes("/courses")) return "My Courses";
    if (path.includes("/attendance")) return "Attendance";
    if (path.includes("/assessments")) return "Assessments";
    if (path.includes("/projects")) return "Projects";
    if (path.includes("/daily-tasks")) return "Daily Tasks";
    if (path.includes("/weekly-goals")) return "Weekly Goals";
    if (path.includes("/skill-gap")) return "Skill Gap Analyzer";
    if (path.includes("/placement")) return "Placement Tracker";
    if (path.includes("/mock")) return "Mock Interviews";
    if (path.includes("/resume")) return "Resume Builder";
    if (path.includes("/documents")) return "Documents";
    if (path.includes("/payments")) return "Payments";
    if (path.includes("/notifications")) return "Notifications";
    if (path.includes("/profile")) return "My Profile";
    if (path.includes("/report")) return "Overall Report";

    return "Student Portal";
  }, [location.pathname]);

  /* ================= MOBILE HEADER AUTO HIDE ================= */

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
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-indigo-50 via-violet-50 to-slate-100">

      {/* SIDEBAR – UNCHANGED */}
      <AdminSidebar />

      {/* MAIN */}
      <div className="flex flex-col flex-1 overflow-hidden relative">

        {/* HEADER */}
        <header
          className={`
            shrink-0 flex items-center justify-between
            px-3 py-3 md:px-8 md:py-4
            bg-white/95 backdrop-blur-xl
            border-b border-slate-200
            shadow-sm z-30
            transition-transform duration-300 ease-out
            ${hideHeader ? "-translate-y-full md:translate-y-0" : ""}
          `}
        >
          {/* LEFT */}
          <div className="flex items-center gap-3">
            <button
              onClick={openSidebar}
              className="
                md:hidden p-2 rounded-lg
                bg-slate-100 hover:bg-indigo-100
                active:scale-95 transition
              "
              aria-label="Open sidebar"
            >
              <FaBars className="text-indigo-600 text-lg" />
            </button>

            <div className="leading-tight">
              <h1 className="text-base md:text-lg font-semibold text-slate-800">
                {getTitle}
              </h1>
              <p className="text-[11px] md:text-xs text-slate-500">
                Student Portal
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <button
            onClick={logout}
            className="
              md:hidden flex items-center gap-1
              px-3 py-1.5 rounded-full
              bg-red-500 hover:bg-red-600
              text-white text-xs font-semibold
              shadow-md active:scale-95 transition
            "
            aria-label="Logout"
          >
            <FaSignOutAlt />
          </button>

          {/* DESKTOP LOGOUT */}
          <button
            onClick={logout}
            className="
              hidden md:flex items-center gap-2
              px-4 py-2 rounded-full
              bg-gradient-to-r from-red-500 to-pink-500
              hover:from-red-600 hover:to-pink-600
              text-white text-sm font-semibold
              shadow-lg hover:shadow-xl transition
            "
          >
            <FaSignOutAlt />
            Logout
          </button>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          <div className="min-h-full p-3 md:p-6 animate-fadeIn">
            <Outlet />
          </div>
        </main>

        {/* MOBILE BOTTOM NAV */}
        <nav
          className="
            md:hidden fixed bottom-0 inset-x-0 z-40
            bg-white/95 backdrop-blur-xl
            border-t border-slate-200
            flex justify-around items-center
            h-14 shadow-lg
          "
        >
          <BottomItem
            icon={<FaHome />}
            label="Home"
            active={location.pathname.includes("/dashboard")}
            onClick={() => navigate("/student/dashboard")}
          />
          <BottomItem
            icon={<FaBookOpen />}
            label="Courses"
            active={location.pathname.includes("/courses")}
            onClick={() => navigate("/student/courses")}
          />
          <BottomItem
            icon={<FaClipboardList />}
            label="Tasks"
            active={location.pathname.includes("/daily-tasks")}
            onClick={() => navigate("/student/daily-tasks")}
          />
          <BottomItem
            icon={<FaUser />}
            label="Profile"
            active={location.pathname.includes("/profile")}
            onClick={() => navigate("/student/profile")}
          />
        </nav>

      </div>
    </div>
  );
}

/* ================= MOBILE BOTTOM ITEM ================= */

const BottomItem = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`
      flex flex-col items-center justify-center
      w-full h-full
      text-[11px] transition-all duration-200
      ${active ? "text-indigo-600 font-semibold" : "text-slate-500"}
    `}
  >
    <span className={`text-xl mb-0.5 ${active ? "scale-110" : ""}`}>
      {icon}
    </span>
    {label}
  </button>
);
