import { useState, useMemo, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaBookOpen,
  FaUserGraduate,
  FaCalendarCheck,
  FaChartPie,
  FaClipboardList,
  FaMoneyBill,
  FaBell,
  FaChartBar,
  FaCog,
  FaShieldAlt,
  FaChevronDown,
  FaBars,
  FaSearch,
  FaTimes,
  FaLifeRing,
} from "react-icons/fa";

import PrakuraLogo from "../assets/prakura-logo.png";

/* ================= ROLE ACCESS ================= */

const ROLE_ACCESS = {
  Admin: [
    "Dashboard",
    "User Management",
    "Course Management",
    "Batch Management",
    "Attendance",
    "Attendance Analytics",
    "Assessments",
    "Payments",
    "Finance",
    "Notifications",
    "Reports",
    "Settings",
    "Security & Audit",
    "Help & Support",
  ],
  Finance: ["Dashboard", "Payments", "Finance", "Reports", "Help & Support"],
  Counsellor: ["Dashboard", "Payments", "Help & Support"],
  Educator: ["Dashboard", "Assessments", "Attendance", "Help & Support"],
  Student: ["Dashboard", "Assessments", "Payments", "Help & Support"],
};

/* ================= MENU ================= */

const MENU = [
  {
    title: "Dashboard",
    icon: <FaTachometerAlt />,
    items: [{ label: "Overview", path: "dashboard" }],
  },
  {
    title: "User Management",
    icon: <FaUsers />,
    items: [
      { label: "Admins", path: "users/admins" },
      { label: "Educators", path: "users/educators" },
      { label: "Students", path: "users/students" },
    ],
  },
  {
    title: "Course Management",
    icon: <FaBookOpen />,
    items: [
      { label: "All Courses", path: "courses" },
      { label: "Add Course", path: "courses/add" },
      { label: "Course Categories", path: "course-categories" },
      { label: "Syllabus & Content", path: "course-content" },
    ],
  },
  {
    title: "Batch Management",
    icon: <FaUserGraduate />,
    items: [
      { label: "Batches", path: "batches" },
      { label: "Create Batch", path: "batches/create" },
      { label: "Batch Allocation", path: "batches/allocation" },
      { label: "Timetable", path: "batches/timetable" },
    ],
  },
  {
    title: "Attendance",
    icon: <FaCalendarCheck />,
    items: [{ label: "Attendance Dashboard", path: "attendance" }],
  },
  {
    title: "Attendance Analytics",
    icon: <FaChartPie />,
    items: [{ label: "Summary", path: "attendance/analytics" }],
  },
  {
    title: "Assessments",
    icon: <FaClipboardList />,
    items: [
      { label: "Dashboard", path: "assessments" },
      { label: "Create", path: "assessments/create" },
      { label: "Question Bank", path: "assessments/questions" },
      { label: "Evaluation", path: "assessments/evaluation" },
      { label: "Results", path: "assessments/results" },
    ],
  },
  {
    title: "Payments",
    icon: <FaMoneyBill />,
    items: [{ label: "Payments Overview", path: "payments" }],
  },
  {
    title: "Finance",
    icon: <FaChartBar />,
    items: [
      { label: "Analytics", path: "finance/analytics" },
      { label: "Overdue Alerts", path: "finance/alerts" },
    ],
  },
  {
    title: "Notifications",
    icon: <FaBell />,
    items: [{ label: "Announcements", path: "notifications/announcements" }],
  },
  {
    title: "Security & Audit",
    icon: <FaShieldAlt />,
    items: [
      { label: "Activity Logs", path: "security/activity-logs" },
      { label: "Security Audit", path: "security/audit" },
    ],
  },
  {
    title: "Help & Support",
    icon: <FaLifeRing />,
    items: [
      { label: "FAQs", path: "support/faqs" },
      { label: "Support Tickets", path: "support/tickets" },
      { label: "Contact Admin", path: "support/contact" },
    ],
  },
];

/* ================= SIDEBAR ================= */

export default function AdminSidebar() {
  const location = useLocation();

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  }, []);

  const role = user?.role || "Admin";
  const allowedMenus = ROLE_ACCESS[role] || [];

  const [openMenu, setOpenMenu] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  /* ===== 🔥 FIX: GLOBAL EVENT LISTENER ===== */
  useEffect(() => {
    const handler = () => {
      setMobileOpen(true);
      document.body.style.overflow = "hidden";
    };

    window.addEventListener("OPEN_ADMIN_SIDEBAR", handler);
    return () => window.removeEventListener("OPEN_ADMIN_SIDEBAR", handler);
  }, []);

  /* ===== AUTO CLOSE ON ROUTE CHANGE ===== */
  useEffect(() => {
    setMobileOpen(false);
    document.body.style.overflow = "";
  }, [location.pathname]);

  /* ===== ACTIVE MENU ===== */
  useEffect(() => {
    const active = MENU.find((m) =>
      m.items.some((i) => location.pathname.includes(i.path))
    );
    if (active) setOpenMenu(active.title);
  }, [location.pathname]);

  const filteredMenu = MENU.filter((m) =>
    allowedMenus.includes(m.title)
  ).map((m) => {
    const items = m.items.filter(
      (i) =>
        i.label.toLowerCase().includes(search.toLowerCase()) ||
        m.title.toLowerCase().includes(search.toLowerCase())
    );
    return { ...m, items };
  });

  return (
    <>
      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => {
            setMobileOpen(false);
            document.body.style.overflow = "";
          }}
        />
      )}

      <aside
        className={`
          fixed md:static z-50
          h-full md:h-screen
          bg-gradient-to-br from-blue-800 via-blue-900 to-indigo-900
          border-r border-white/20
          transition-transform duration-300
          ${collapsed ? "w-20" : "w-72"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* HEADER */}
        <div className="px-4 py-4 flex justify-between items-center border-b border-white/20">
          <div className="flex items-center gap-3">
            <img src={PrakuraLogo} className="w-8 h-8" />
            {!collapsed && (
              <span className="text-white font-semibold">PRAKURA TMS</span>
            )}
          </div>

          <div className="flex gap-2 text-white">
            <button
              className="md:hidden"
              onClick={() => {
                setMobileOpen(false);
                document.body.style.overflow = "";
              }}
            >
              <FaTimes />
            </button>
            <button
              className="hidden md:block"
              onClick={() => setCollapsed((p) => !p)}
            >
              <FaBars />
            </button>
          </div>
        </div>

        {/* SEARCH */}
        {!collapsed && (
          <div className="p-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/60"
            />
          </div>
        )}

        {/* MENU */}
        <nav className="px-2 space-y-1 text-white text-sm overflow-y-auto">
          {filteredMenu.map((menu) => (
            <div key={menu.title}>
              <div
                className="flex justify-between items-center px-3 py-2 rounded-lg cursor-pointer hover:bg-white/10"
                onClick={() =>
                  !collapsed &&
                  setOpenMenu(openMenu === menu.title ? null : menu.title)
                }
              >
                <div className="flex items-center gap-3">
                  {menu.icon}
                  {!collapsed && menu.title}
                </div>
                {!collapsed && menu.items.length > 1 && (
                  <FaChevronDown
                    className={`transition ${
                      openMenu === menu.title ? "rotate-180" : ""
                    }`}
                  />
                )}
              </div>

              {!collapsed && openMenu === menu.title && (
                <div className="ml-8 space-y-1">
                  {menu.items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        `block px-3 py-1.5 rounded-md ${
                          isActive
                            ? "bg-white/20 font-medium"
                            : "hover:bg-white/10"
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
