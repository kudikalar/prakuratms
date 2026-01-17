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
    // 🔐 Clear ONLY auth-related keys
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    // ✅ HARD redirect (HashRouter SAFE – PRODUCTION)
    window.location.href = window.location.origin + "/#/";
  };

  /* ================= MOBILE SIDEBAR ================= */

  const openSidebar = () => {
    window.dispatchEvent(new CustomEvent("OPEN_ADMIN_SIDEBAR"));
  };

  /* ================= UX FIXES ================= */

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
    <div className="flex h-screen overflow-hidden relative bg-gradient-to-br from-orange-100 via-amber-50 to-pink-100">
      {/* AMBIENT GLOW */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-orange-400/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-amber-400/30 rounded-full blur-3xl pointer-events-none" />

      {/* SIDEBAR */}
      <AdminSidebar />

      {/* MAIN */}
      <div className="flex flex-col flex-1 relative z-10 overflow-hidden">
        {/* HEADER */}
        <header
          className="
            shrink-0 flex items-center justify-between
            px-4 md:px-8 py-4
            bg-white/75 backdrop-blur-2xl
            border-b border-white/60
            shadow-[0_25px_70px_rgba(0,0,0,0.18)]
          "
        >
          {/* LEFT */}
          <div className="flex items-center gap-4">
            <button
              onClick={openSidebar}
              className="
                md:hidden p-2 rounded-full
                bg-white/80 backdrop-blur
                border border-white/60
                hover:bg-orange-100 transition
              "
              aria-label="Open sidebar"
            >
              <FaBars className="text-orange-700" />
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
            {/* NOTIFICATIONS */}
            <button
              className="
                relative p-2 rounded-full
                bg-white/80 backdrop-blur
                border border-white/60
                hover:bg-orange-100 transition
              "
              title="Notifications"
            >
              <FaBell className="text-orange-700" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
            </button>

            {/* ROLE */}
            <div
              className="
                hidden sm:flex items-center gap-2
                bg-white/80 px-3 py-1.5 rounded-full
                border border-white/60
              "
            >
              <FaUserShield className="text-orange-700" />
              <span className="text-sm font-medium text-slate-800">
                {role}
              </span>
            </div>

            {/* USER */}
            <div
              className="
                hidden md:flex items-center gap-2
                bg-white/80 px-3 py-1.5 rounded-full
                border border-white/60
              "
            >
              <img
                src="https://i.pravatar.cc/40?img=12"
                className="w-8 h-8 rounded-full"
                alt="profile"
              />
              <span className="text-sm font-medium text-slate-800">
                {user?.name || "Administrator"}
              </span>
            </div>

            {/* LOGOUT */}
            <button
              onClick={logout}
              className="
                flex items-center gap-2
                px-4 py-2 rounded-full
                bg-gradient-to-r from-orange-500 to-pink-500
                hover:from-orange-600 hover:to-pink-600
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
