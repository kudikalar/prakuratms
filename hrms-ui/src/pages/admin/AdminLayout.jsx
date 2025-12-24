import { Outlet, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { FaSignOutAlt, FaBars } from "react-icons/fa";
import AdminSidebar from "../../components/AdminSidebar";

export default function AdminLayout() {
  const navigate = useNavigate();

  const user = useMemo(
    () => JSON.parse(localStorage.getItem("user") || "{}"),
    []
  );

  const logout = () => {
    localStorage.clear();
    // ✅ FIXED: HashRouter-safe redirect
    navigate("/login", { replace: true });
  };

  return (
    <div
      className="
        flex min-h-screen relative overflow-hidden
        bg-gradient-to-br from-purple-200 via-pink-100 to-indigo-200
      "
    >
      {/* Ambient Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-400/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-pink-400/30 rounded-full blur-3xl" />

      {/* SIDEBAR */}
      <AdminSidebar />

      <div className="flex-1 flex flex-col relative z-10">
        {/* HEADER */}
        <header
          className="
            flex items-center justify-between
            px-4 md:px-8 py-5
            bg-white/50 backdrop-blur-2xl
            border-b border-white/40
            shadow-[0_30px_90px_rgba(0,0,0,0.2)]
          "
        >
          {/* LEFT SECTION */}
          <div className="flex items-center gap-4">
            {/* MOBILE HAMBURGER */}
            <button
              className="md:hidden p-2 rounded-full
                bg-white/60 backdrop-blur
                border border-white/50
                hover:bg-purple-100 transition"
              onClick={() =>
                window.dispatchEvent(new Event("OPEN_ADMIN_SIDEBAR"))
              }
            >
              <FaBars className="text-purple-600" />
            </button>

            <h1 className="text-xl font-semibold text-slate-800">
              Admin Control Panel
            </h1>
          </div>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-4">
            {/* PROFILE */}
            <div
              className="
                hidden sm:flex
                items-center gap-2
                bg-white/60 px-3 py-1.5 rounded-full
                border border-white/50
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
                bg-gradient-to-r from-red-500 to-pink-500
                hover:from-red-600 hover:to-pink-600
                text-white text-sm font-semibold
                shadow-lg transition
              "
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
