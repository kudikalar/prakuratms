import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaBook,
  FaMoneyBillWave,
  FaChartLine,
} from "react-icons/fa";

const MENU = [
  { label: "Dashboard", to: "/admin/dashboard", icon: <FaHome /> },
  { label: "Users", to: "/admin/users/students", icon: <FaUsers /> },
  { label: "Courses", to: "/admin/courses", icon: <FaBook /> },
  { label: "Payments", to: "/admin/payments", icon: <FaMoneyBillWave /> },
  { label: "Finance", to: "/admin/finance/analytics", icon: <FaChartLine /> },
];

export default function AppleGlassSidebar() {
  return (
    <aside className="glass-sidebar w-64 h-screen fixed left-0 top-0 p-4">
      {/* LOGO */}
      <div className="mb-8 px-3">
        <h2 className="text-xl font-semibold text-indigo-700">
          Prakura
        </h2>
        <p className="text-xs text-slate-500">Admin Control Panel</p>
      </div>

      {/* MENU */}
      <nav className="space-y-2">
        {MENU.map((m) => (
          <NavLink
            key={m.to}
            to={m.to}
            className={({ isActive }) =>
              `glass-sidebar-item flex items-center gap-3 ${
                isActive ? "active" : ""
              }`
            }
          >
            <span className="text-sm">{m.icon}</span>
            <span className="text-sm">{m.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
