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
  FaShieldAlt,
  FaChevronDown,
  FaBars,
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
    "Security & Audit",
    "Help & Support",
  ],
  Finance: ["Dashboard", "Payments", "Finance", "Help & Support"],
  Counsellor: ["Dashboard", "Payments", "Help & Support"],
  Educator: [
    "Dashboard",
    "My Courses",
    "Batches",
    "Students",
    "Attendance",
    "Assessments",
    "Reports",
    "Notifications",
    "Help & Support",
  ],
  Student: [
    "Dashboard",
    "My Courses",
    "Projects",
    "Placement",
    "Skills & Goals",
    "Documents",
    "Community",
    "Reports",
    "Profile",
    "Notifications",
    "Payments",
  ],
};

/* ================= ADMIN MENU (UNCHANGED) ================= */

const ADMIN_MENU = [
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
      { label: "Allocation", path: "/admin/batches/allocation" },
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
    items: [{ label: "Summary", path: "/admin/attendance/analytics" }],
  },
  {
    title: "Assessments",
    icon: <FaClipboardList />,
    items: [
      { label: "Dashboard", path: "/admin/assessments" },
      { label: "Create", path: "/admin/assessments/create" },
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
      { label: "Analytics", path: "/admin/finance/analytics" },
      { label: "Overdue Alerts", path: "/admin/finance/alerts" },
    ],
  },
  {
    title: "Notifications",
    icon: <FaBell />,
    items: [{ label: "Announcements", path: "/admin/notifications/announcements" }],
  },
  {
    title: "Security & Audit",
    icon: <FaShieldAlt />,
    items: [
      { label: "Activity Logs", path: "/admin/security/activity-logs" },
      { label: "Security Audit", path: "/admin/security/audit" },
    ],
  },
  {
    title: "Help & Support",
    icon: <FaLifeRing />,
    items: [
      { label: "FAQs", path: "/admin/support/faqs" },
      { label: "Support Tickets", path: "/admin/support/tickets" },
      { label: "Contact Admin", path: "/admin/support/contact" },
    ],
  },
];

/* ================= EDUCATOR MENU (UNCHANGED) ================= */

const EDUCATOR_MENU = [
  {
    title: "Dashboard",
    icon: <FaTachometerAlt />,
    items: [{ label: "Overview", path: "/admin/dashboard" }],
  },
  {
    title: "My Courses",
    icon: <FaBookOpen />,
    items: [
      { label: "Assigned Courses", path: "/admin/educator/assigned-courses" },
      { label: "Course Content", path: "/admin/educator/course-content" },
    ],
  },
  {
    title: "Batches",
    icon: <FaUserGraduate />,
    items: [
      { label: "My Batches", path: "/admin/educator/my-batches" },
      { label: "Schedule", path: "/admin/educator/schedule" },
    ],
  },
  {
    title: "Students",
    icon: <FaUsers />,
    items: [
      { label: "Student List", path: "/admin/educator/students" },
      { label: "Performance", path: "/admin/educator/performance" },
    ],
  },
  {
    title: "Attendance",
    icon: <FaCalendarCheck />,
    items: [
      { label: "Mark Attendance", path: "/admin/educator/attendance/mark" },
      { label: "History", path: "/admin/educator/history" },
    ],
  },
  {
    title: "Assessments",
    icon: <FaClipboardList />,
    items: [
      { label: "Create Assessment", path: "/admin/assessments/create" },
      { label: "Evaluation", path: "/admin/assessments/evaluation" },
    ],
  },
  {
    title: "Reports",
    icon: <FaChartBar />,
    items: [{ label: "Reports", path: "/admin/educator/performance" }],
  },
  {
    title: "Notifications",
    icon: <FaBell />,
    items: [{ label: "My Notifications", path: "/admin/notifications/announcements" }],
  },
  {
    title: "Help & Support",
    icon: <FaLifeRing />,
    items: [{ label: "Support", path: "/admin/support/faqs" }],
  },
];

/* ================= STUDENT MENU (ADDED – NO REMOVALS) ================= */

const STUDENT_MENU = [
  {
    title: "Dashboard",
    icon: <FaTachometerAlt />,
    items: [{ label: "Overview", path: "/student/dashboard" }],
  },

  {
    title: "My Courses",
    icon: <FaBookOpen />,
    items: [
      { label: "Courses", path: "/student/courses" },
      { label: "Attendance", path: "/student/attendance" },
      { label: "Attendance Calendar", path: "/student/attendance-calendar" },
      { label: "Assessments", path: "/student/assessments" },
    ],
  },

  {
    title: "Projects",
    icon: <FaClipboardList />,
    items: [
      { label: "My Projects", path: "/student/projects" },
      { label: "Progress Tracker", path: "/student/project-progress" },
      { label: "Submissions", path: "/student/project-submission" },
      { label: "Reviews", path: "/student/project-review" },
      { label: "Evaluation", path: "/student/project-evaluation" },
    ],
  },

  {
    title: "Placement",
    icon: <FaChartBar />,
    items: [
      { label: "Eligibility", path: "/student/placement-eligibility" },
      { label: "Readiness", path: "/student/placement-readiness" },
      { label: "Placements", path: "/student/placements" },
      { label: "Placement Stats", path: "/student/placement-stats" },
      { label: "Mock Interviews", path: "/student/mock-interviews" },
      { label: "Mock Results", path: "/student/mock-results" },
      { label: "Interview Schedule", path: "/student/interviews" },
    ],
  },

  {
    title: "Skills & Goals",
    icon: <FaChartPie />,
    items: [
      { label: "Skill Gap Analyzer", path: "/student/skill-gap" },
      { label: "Daily Tasks", path: "/student/daily-tasks" },
    ],
  },

  {
    title: "Documents",
    icon: <FaShieldAlt />,
    items: [
      { label: "Documents", path: "/student/documents" },
      { label: "Certificates", path: "/student/certificates" },
      { label: "Resume Builder", path: "/student/resume-builder" },
    ],
  },

  {
    title: "Community",
    icon: <FaUsers />,
    items: [
      { label: "Peers Directory", path: "/student/peers" },
      { label: "Alumni Directory", path: "/student/alumni" },
      { label: "Success Stories", path: "/student/alumni-stories" },
      { label: "Story Matcher", path: "/student/alumni-matcher" },
      { label: "Referrals", path: "/student/referrals" },
      { label: "1:1 Discussions", path: "/student/discussions" },
    ],
  },

  {
    title: "AI & Reports",
    icon: <FaChartBar />,
    items: [
      { label: "AI Coach", path: "/student/ai-coach" },
      { label: "Overall Report", path: "/student/report" },
    ],
  },

  {
    title: "Profile",
    icon: <FaUserGraduate />,
    items: [{ label: "My Profile", path: "/student/profile" }],
  },

  {
    title: "Notifications",
    icon: <FaBell />,
    items: [{ label: "My Notifications", path: "/student/notifications" }],
  },

  {
    title: "Payments",
    icon: <FaMoneyBill />,
    items: [{ label: "Payment History", path: "/student/payments" }],
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

  const role =
    typeof user?.role === "string"
      ? user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()
      : "Admin";

  const allowedMenus = ROLE_ACCESS[role] || [];

  const ACTIVE_MENU =
    role === "Student"
      ? STUDENT_MENU
      : role === "Educator"
      ? EDUCATOR_MENU
      : ADMIN_MENU;

  const [openMenu, setOpenMenu] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  /* MOBILE SIDEBAR OPEN */
  useEffect(() => {
    const handler = () => setMobileOpen(true);
    window.addEventListener("OPEN_ADMIN_SIDEBAR", handler);
    return () => window.removeEventListener("OPEN_ADMIN_SIDEBAR", handler);
  }, []);

  const filteredMenu = useMemo(
    () =>
      ACTIVE_MENU.filter(
        (m) => allowedMenus.includes(m.title) || role === "Admin"
      ).map((m) => ({
        ...m,
        items: m.items.filter(
          (i) =>
            i.label.toLowerCase().includes(search.toLowerCase()) ||
            m.title.toLowerCase().includes(search.toLowerCase())
        ),
      })),
    [ACTIVE_MENU, allowedMenus, role, search]
  );

  useEffect(() => {
    const active = filteredMenu.find((m) =>
      m.items.some((i) => location.pathname.startsWith(i.path))
    );
    if (active) setOpenMenu(active.title);
  }, [location.pathname, filteredMenu]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  return (
    <>
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      <aside
        className={`fixed md:static z-50 h-full md:h-screen
        bg-gradient-to-br from-blue-800 via-blue-900 to-indigo-900
        border-r border-white/20 transition-all duration-300
        ${collapsed ? "w-20" : "w-72"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* HEADER */}
        <div className="px-4 py-4 flex items-center gap-3 border-b border-white/20">
          <img src={PrakuraLogo} className="w-8 h-8" />
          {!collapsed && (
            <span className="text-white font-semibold">PRAKURA TMS</span>
          )}
        </div>

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

        <nav className="px-2 space-y-1 text-white text-sm overflow-y-auto">
          {filteredMenu.map((menu) => (
            <div key={menu.title}>
              <div
                className="flex justify-between items-center px-3 py-2 rounded-lg cursor-pointer hover:bg-white/10"
                onClick={() =>
                  setOpenMenu((p) => (p === menu.title ? null : menu.title))
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
