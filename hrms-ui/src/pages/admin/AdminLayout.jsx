import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useMemo } from "react";
import {
  FaSignOutAlt,
  FaBars,
  FaUserShield,
  FaBell,
} from "react-icons/fa";
import AdminSidebar from "../../components/AdminSidebar";

/* ================= PAGE TITLE ================= */

const getPageTitle = (pathname) => {
  if (pathname.includes("dashboard")) return "Dashboard";
  if (pathname.includes("users")) return "User Management";
  if (pathname.includes("courses")) return "Course Management";
  if (pathname.includes("batches")) return "Batch Management";
  if (pathname.includes("attendance")) return "Attendance";
  if (pathname.includes("assessments")) return "Assessments";
  if (pathname.includes("payments")) return "Payments";
  if (pathname.includes("finance")) return "Finance";
  if (pathname.includes("security")) return "Security & Audit";
  if (pathname.includes("support")) return "Help & Support";
  if (pathname.includes("settings")) return "Settings";
  return "Admin Panel";
};

/* ================= LAYOUT ================= */

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  }, []);

  const role = user?.role || "Admin";
  const pageTitle = getPageTitle(location.pathname);

  /* ================= ACTIONS ================= */

  const logout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  /** 🔥 FIX: Mobile sidebar trigger */
  const openSidebar = () => {
    window.dispatchEvent(new CustomEvent("OPEN_ADMIN_SIDEBAR"));
  };

  /* ================= UX FIXES ================= */

  // Lock body scroll when sidebar is open (mobile)
  useEffect(() => {
    const lockScroll = () => {
      document.body.style.overflow = "hidden";
    };
    const unlockScroll = () => {
      document.body.style.overflow = "";
    };

    window.addEventListener("LOCK_SCROLL", lockScroll);
    window.addEventListener("UNLOCK_SCROLL", unlockScroll);

    return () => {
      window.removeEventListener("LOCK_SCROLL", lockScroll);
      window.removeEventListener("UNLOCK_SCROLL", unlockScroll);
    };
  }, []);

  /* ================= UI ================= */

  return (
    <div className="flex h-screen overflow-hidden relative bg-gradient-to-br from-purple-200 via-pink-100 to-indigo-200">
      {/* Ambient Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-400/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-pink-400/30 rounded-full blur-3xl pointer-events-none" />

      {/* SIDEBAR */}
      <AdminSidebar />

      {/* MAIN WRAPPER */}
      <div className="flex flex-col flex-1 relative z-10 overflow-hidden">
        {/* HEADER */}
        <header
          className="
            shrink-0 flex items-center justify-between
            px-4 md:px-8 py-4
            bg-white/60 backdrop-blur-2xl
            border-b border-white/40
            shadow-[0_30px_90px_rgba(0,0,0,0.2)]
          "
        >
          {/* LEFT */}
          <div className="flex items-center gap-4">
            {/* MOBILE MENU BUTTON */}
            <button
              onClick={openSidebar}
              className="
                md:hidden p-2 rounded-full
                bg-white/70 backdrop-blur
                border border-white/50
                hover:bg-purple-100 transition
              "
              aria-label="Open sidebar"
            >
              <FaBars className="text-purple-700" />
            </button>

            <div>
              <h1 className="text-lg sm:text-xl font-semibold text-slate-800">
                {pageTitle}
              </h1>
              <p className="text-xs text-slate-500">
                Admin Control Panel
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Notifications */}
            <button
              className="
                relative p-2 rounded-full
                bg-white/70 backdrop-blur
                border border-white/50
                hover:bg-purple-100 transition
              "
              title="Notifications"
            >
              <FaBell className="text-purple-700" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
            </button>

            {/* Role */}
            <div className="
              hidden sm:flex items-center gap-2
              bg-white/70 px-3 py-1.5 rounded-full
              border border-white/50
            ">
              <FaUserShield className="text-purple-700" />
              <span className="text-sm font-medium text-slate-800">
                {role}
              </span>
            </div>

            {/* User */}
            <div className="
              hidden md:flex items-center gap-2
              bg-white/70 px-3 py-1.5 rounded-full
              border border-white/50
            ">
              <img
                src="https://i.pravatar.cc/40?img=12"
                className="w-8 h-8 rounded-full"
                alt="profile"
              />
              <span className="text-sm font-medium text-slate-800">
                {user?.name || "Administrator"}
              </span>
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              className="
                flex items-center gap-2
                px-4 py-2 rounded-full
                bg-gradient-to-r from-red-500 to-pink-500
                hover:from-red-600 hover:to-pink-600
                text-white text-sm font-semibold
                shadow-lg transition
              "
            >
              <FaSignOutAlt />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="min-h-full p-4 md:p-6 animate-fadeIn">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
