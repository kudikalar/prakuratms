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
  ],
  Finance: ["Dashboard", "Payments", "Finance", "Reports"],
  Counsellor: ["Dashboard", "Payments"],
};

/* ================= MENU CONFIG ================= */
const MENU = [
  {
    title: "Dashboard",
    icon: <FaTachometerAlt />,
    items: [{ label: "Overview", path: "/admin/dashboard" }],
  },
  {
    title: "User Management",
    icon: <FaUsers />,
    items: [
      { label: "Admins", path: "/admin/users/admins" },
      { label: "Educators", path: "/admin/users/educators" },
      { label: "Students", path: "/admin/users/students" },
    ],
  },
  {
    title: "Course Management",
    icon: <FaBookOpen />,
    items: [
      { label: "All Courses", path: "/admin/courses" },
      { label: "Add Course", path: "/admin/courses/add" },
      { label: "Course Categories", path: "/admin/course-categories" },
      { label: "Syllabus & Content", path: "/admin/course-content" },
    ],
  },
  {
    title: "Batch Management",
    icon: <FaUserGraduate />,
    items: [
      { label: "Batches", path: "/admin/batches" },
      { label: "Create Batch", path: "/admin/batches/create" },
      { label: "Batch Allocation", path: "/admin/batches/allocation" },
      { label: "Timetable", path: "/admin/batches/timetable" },
    ],
  },
  {
    title: "Attendance",
    icon: <FaCalendarCheck />,
    items: [{ label: "Attendance Dashboard", path: "/admin/attendance" }],
  },
  {
    title: "Attendance Analytics",
    icon: <FaChartPie />,
    items: [
      {
        label: "Student Attendance Summary",
        path: "/admin/attendance/analytics",
      },
    ],
  },
  {
    title: "Assessments",
    icon: <FaClipboardList />,
    items: [
      { label: "Dashboard", path: "/admin/assessments" },
      { label: "Create Assessment", path: "/admin/assessments/create" },
      { label: "Question Bank", path: "/admin/assessments/questions" },
      { label: "Evaluation", path: "/admin/assessments/evaluation" },
      { label: "Results", path: "/admin/assessments/results" },
    ],
  },
  {
    title: "Payments",
    icon: <FaMoneyBill />,
    items: [{ label: "Payments Overview", path: "/admin/payments" }],
  },
  {
    title: "Finance",
    icon: <FaChartBar />,
    items: [
      { label: "Payment Analytics", path: "/admin/finance/analytics" },
      { label: "Overdue Alerts", path: "/admin/finance/alerts" },
    ],
  },
  {
    title: "Notifications",
    icon: <FaBell />,
    items: [{ label: "Announcements", path: "/admin/announcements" }],
  },
  {
    title: "Reports",
    icon: <FaChartBar />,
    items: [{ label: "Reports", path: "/admin/reports" }],
  },
  {
    title: "Settings",
    icon: <FaCog />,
    items: [{ label: "Institute Profile", path: "/admin/settings/institute" }],
  },
  {
    title: "Security & Audit",
    icon: <FaShieldAlt />,
    items: [{ label: "Activity Logs", path: "/admin/security/activity-logs" }],
  },
];

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
  const allowedMenus = ROLE_ACCESS[role] ?? [];

  const [open, setOpen] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const storedLogo = localStorage.getItem("instituteLogo");
  const logo =
    storedLogo && storedLogo !== "null" && storedLogo !== ""
      ? storedLogo
      : PrakuraLogo;

  useEffect(() => {
    const active = MENU.find((menu) =>
      menu.items.some((i) => location.pathname.startsWith(i.path))
    );
    if (active) setOpen(active.title);
  }, [location.pathname]);

  const filteredMenu = useMemo(() => {
    return MENU.filter((m) => allowedMenus.includes(m.title))
      .map((m) => {
        const visibleItems = m.items.filter((i) =>
          i.label.toLowerCase().includes(search.toLowerCase())
        );
        return {
          ...m,
          items: search ? visibleItems : m.items,
          visible: !search || visibleItems.length > 0,
        };
      })
      .filter((m) => m.visible);
  }, [search, allowedMenus]);

  return (
    <>
      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed md:static z-50
          h-full md:h-screen
          bg-gradient-to-br
          from-slate-200
          via-slate-300/80
          to-slate-400/60
          backdrop-blur-xl
          border-r border-white/40
          transition-transform duration-300
          ${collapsed ? "w-20" : "w-72"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* HEADER */}
        <div className="px-4 py-4 flex justify-between items-center border-b border-white/40">
          <div className="flex items-center gap-3">
            <img src={logo} className="w-8 h-8" />
            {!collapsed && (
              <span className="font-semibold text-slate-800">
                PRAKURA TMS
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button className="md:hidden" onClick={() => setMobileOpen(false)}>
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
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search menu..."
                className="pl-9 w-full py-2 rounded-lg bg-white/60 backdrop-blur border border-white/50 text-sm"
              />
            </div>
          </div>
        )}

        {/* MENU */}
        <nav className="px-2 space-y-1 text-sm">
          {filteredMenu.map((menu) => {
            const isParentActive = menu.items.some((i) =>
              location.pathname.startsWith(i.path)
            );

            return (
              <div key={menu.title}>
                <div
                  onClick={() =>
                    !collapsed &&
                    setOpen(open === menu.title ? null : menu.title)
                  }
                  className={`flex justify-between items-center px-3 py-2 rounded-lg cursor-pointer transition
                    ${
                      isParentActive
                        ? "bg-white/60 text-purple-700 font-semibold"
                        : "hover:bg-white/50 hover:text-purple-600"
                    }`}
                >
                  <div className="flex gap-3 items-center">
                    <span className="text-purple-600">{menu.icon}</span>
                    {!collapsed && menu.title}
                  </div>

                  {!collapsed && menu.items.length > 1 && (
                    <FaChevronDown
                      className={`transition ${
                        open === menu.title ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </div>

                {!collapsed && open === menu.title && (
                  <div className="ml-9 mt-1 space-y-1">
                    {menu.items.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) =>
                          `block px-3 py-1.5 rounded-md transition
                          ${
                            isActive
                              ? "bg-purple-200/60 text-purple-800 font-medium"
                              : "hover:bg-white/50 hover:text-purple-600"
                          }`
                        }
                      >
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
