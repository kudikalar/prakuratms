import { Outlet, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { FaSignOutAlt, FaBell } from "react-icons/fa";
import AdminSidebar from "../../components/AdminSidebar";

export default function AdminLayout() {
  const navigate = useNavigate();
  const user = useMemo(
    () => JSON.parse(localStorage.getItem("user") || "{}"),
    []
  );

  const logout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  /* 🔔 MOCK NOTIFICATIONS (API READY) */
  const notifications = [
    { id: 1, text: "New student enrolled", time: "2 min ago" },
    { id: 2, text: "Payment received successfully", time: "10 min ago" },
    { id: 3, text: "Assessment submitted for review", time: "1 hr ago" },
  ];

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

      <AdminSidebar />

      <div className="flex-1 flex flex-col relative z-10">
        {/* HEADER */}
        <header
          className="
            flex items-center justify-between
            px-8 py-5
            bg-white/50 backdrop-blur-2xl
            border-b border-white/40
            shadow-[0_30px_90px_rgba(0,0,0,0.2)]
          "
        >
          <h1 className="text-xl font-semibold text-slate-800">
            Admin Control Panel
          </h1>

          <div className="flex items-center gap-4">
            {/* 🔔 NOTIFICATIONS */}
            <div className="relative group">
              <button
                className="
                  relative p-2 rounded-full
                  bg-white/60 backdrop-blur
                  border border-white/50
                  hover:bg-purple-100 transition
                "
              >
                <FaBell className="text-purple-600" />

                {/* BADGE */}
                {notifications.length > 0 && (
                  <span
                    className="
                      absolute -top-1 -right-1
                      w-5 h-5 rounded-full
                      bg-red-500 text-white text-[11px]
                      flex items-center justify-center
                      font-semibold
                    "
                  >
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* DROPDOWN */}
              <div
                className="
                  absolute right-0 mt-3 w-72
                  bg-white/80 backdrop-blur-xl
                  border border-white/40
                  rounded-2xl shadow-xl
                  opacity-0 scale-95
                  group-hover:opacity-100 group-hover:scale-100
                  transition-all origin-top-right z-50
                "
              >
                <div className="px-4 py-3 border-b border-slate-200">
                  <h4 className="font-semibold text-slate-800">
                    Notifications
                  </h4>
                </div>

                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="px-4 py-3 text-sm hover:bg-purple-50 transition"
                    >
                      <p className="text-slate-800">{n.text}</p>
                      <span className="text-xs text-slate-500">
                        {n.time}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="px-4 py-2 text-center text-sm text-purple-600 hover:underline cursor-pointer">
                  View all notifications
                </div>
              </div>
            </div>

            {/* PROFILE */}
            <div
              className="
                flex items-center gap-2
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
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
