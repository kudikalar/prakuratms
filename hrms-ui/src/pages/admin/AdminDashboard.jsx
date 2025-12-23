import AdminSidebar from "../../components/AdminSidebar";
import DashboardHome from "./DashboardHome";
import { FaSignOutAlt } from "react-icons/fa";

export default function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="
      flex min-h-screen relative overflow-hidden
      bg-gradient-to-br from-purple-200 via-pink-100 to-indigo-200
    ">
      {/* Ambient Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-400/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-pink-400/30 rounded-full blur-3xl" />

      <AdminSidebar />

      <div className="flex-1 flex flex-col relative z-10">
        {/* HEADER */}
        <header className="
          flex items-center justify-between
          px-8 py-5
          bg-white/40 backdrop-blur-[24px]
          border-b border-white/40
          shadow-[0_30px_90px_rgba(0,0,0,0.2)]
        ">
          <h1 className="text-gray-800 text-xl font-semibold">
            Admin Control Panel
          </h1>

          <div className="flex items-center gap-4">
            {/* PROFILE */}
            <div className="
              flex items-center gap-2
              bg-white/60 px-3 py-1.5 rounded-full
              border border-white/50
            ">
              <img
                src="https://i.pravatar.cc/40?img=12"
                className="w-8 h-8 rounded-full"
                alt="profile"
              />
              <span className="text-gray-800 text-sm font-medium">
                {user?.name || "Administrator"}
              </span>
            </div>

            {/* LOGOUT */}
            <button
              onClick={logout}
              className="
                flex items-center gap-2
                px-4 py-2 rounded-full
                bg-red-500/80 hover:bg-red-600
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
          <DashboardHome />
        </main>
      </div>
    </div>
  );
}
