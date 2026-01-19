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
  FaLifeRing,
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
    "Messages",
    "Analytics",
    "Student Support",
    "Help & Support",
  ],
};

/* ================= ADMIN MENU ================= */

const ADMIN_MENU = [
  {
    title: "Dashboard",
    icon: <FaTachometerAlt />,
    items: [
  {
    label: "Overview",
    path: "/admin/dashboard",
    icon: <FaChartPie />,
  },
],

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
    items: [{ label: "Activity Logs", path: "/admin/security/activity-logs" }],
  },
  {
    title: "Help & Support",
    icon: <FaLifeRing />,
    items: [{ label: "FAQs", path: "/admin/support/faqs" }],
  },
];

/* ================= EDUCATOR MENU ================= */

const EDUCATOR_MENU = [
  {
    title: "Dashboard",
    icon: <FaTachometerAlt />,
    items: [{ label: "Overview", path: "/admin/educator/dashboard" }],
  },
  {
    title: "My Courses",
    icon: <FaBookOpen />,
    items: [
      { label: "Assigned Courses", path: "/admin/educator/assigned-courses" },
      { label: "Course Content", path: "/admin/educator/course-content" },
      { label: "Lesson Planner", path: "/admin/educator/lesson-planner" },
    ],
  },
  {
    title: "Batches",
    icon: <FaUserGraduate />,
    items: [{ label: "My Batches", path: "/admin/educator/my-batches" }],
  },
  {
    title: "Students",
    icon: <FaUsers />,
    items: [{ label: "Student List", path: "/admin/educator/students" }],
  },
  {
    title: "Attendance",
    icon: <FaCalendarCheck />,
    items: [
      { label: "Mark Attendance", path: "/admin/educator/my-batches" },
      { label: "Attendance History", path: "/admin/educator/my-batches" },
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
    items: [{ label: "Performance", path: "/admin/educator/performance" }],
  },
  {
    title: "Messages",
    icon: <FaBell />,
    items: [{ label: "Messages", path: "/admin/educator/messages" }],
  },
  {
    title: "Analytics",
    icon: <FaChartBar />,
    items: [
      { label: "Batch Performance", path: "/admin/educator/batch-analytics" },
      { label: "Course Reports", path: "/admin/educator/course-reports" },
    ],
  },
  {
    title: "Student Support",
    icon: <FaLifeRing />,
    items: [
      { label: "Intervention Alerts", path: "/admin/educator/interventions" },
      { label: "AI Risk Prediction", path: "/admin/educator/risk-prediction" },
    ],
  },
  {
    title: "Help & Support",
    icon: <FaLifeRing />,
    items: [{ label: "Support", path: "/admin/support/faqs" }],
  },
];

/* ================= STUDENT MENU ================= */

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
      { label: "Assessments", path: "/student/assessments" },
    ],
  },
  {
    title: "Projects",
    icon: <FaClipboardList />,
    items: [
      { label: "My Projects", path: "/student/projects" },
      { label: "Project Progress", path: "/student/project-progress" },
      { label: "Project Submission", path: "/student/project-submission" },
      { label: "Project Review", path: "/student/project-review" },
      { label: "Project Evaluation", path: "/student/project-evaluation" },
    ],
  },
  {
    title: "Skills & Goals",
    icon: <FaChartPie />,
    items: [
      { label: "Daily Tasks", path: "/student/daily-tasks" },
      { label: "Weekly Goals", path: "/student/weekly-goals" },
      { label: "Skill Gap Analyzer", path: "/student/skill-gap" },
    ],
  },
  {
    title: "Mock Interviews",
    icon: <FaUserGraduate />,
    items: [
      { label: "Mock Interviews", path: "/student/mock-interviews" },
      { label: "Mock Results", path: "/student/mock-results" },
      { label: "Scheduled Interviews", path: "/student/interviews" },
    ],
  },
  {
    title: "Placements",
    icon: <FaChartBar />,
    items: [
      { label: "Eligibility", path: "/student/placement-eligibility" },
      { label: "Readiness", path: "/student/placement-readiness" },
      { label: "Job Openings", path: "/student/placements" },
      { label: "Placement Stats", path: "/student/placement-stats" },
    ],
  },
  {
    title: "Documents",
    icon: <FaBookOpen />,
    items: [
      { label: "Resume Builder", path: "/student/resume-builder" },
      { label: "Certificates", path: "/student/certificates" },
      { label: "Documents", path: "/student/documents" },
    ],
  },
  {
    title: "Payments",
    icon: <FaMoneyBill />,
    items: [{ label: "Payments", path: "/student/payments" }],
  },
  {
    title: "Community",
    icon: <FaUsers />,
    items: [
      { label: "Peers", path: "/student/peers" },
      { label: "Alumni", path: "/student/alumni" },
      { label: "Alumni Stories", path: "/student/alumni-stories" },
      { label: "Alumni Matcher", path: "/student/alumni-matcher" },
      { label: "Referrals", path: "/student/referrals" },
      { label: "Discussions", path: "/student/discussions" },
    ],
  },
  {
    title: "Reports & AI",
    icon: <FaChartBar />,
    items: [
      { label: "Overall Report", path: "/student/report" },
      { label: "AI Coach", path: "/student/ai-coach" },
    ],
  },
  {
    title: "Notifications",
    icon: <FaBell />,
    items: [{ label: "Notifications", path: "/student/notifications" }],
  },
  {
    title: "Profile",
    icon: <FaUserGraduate />,
    items: [{ label: "My Profile", path: "/student/profile" }],
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
      ? user.role.charAt(0).toUpperCase() +
        user.role.slice(1).toLowerCase()
      : "Admin";

  const ACTIVE_MENU =
    role === "Student"
      ? STUDENT_MENU
      : role === "Educator"
      ? EDUCATOR_MENU
      : ADMIN_MENU;

  const allowedMenus =
    role === "Student"
      ? ACTIVE_MENU.map((m) => m.title)
      : ROLE_ACCESS[role] || [];

  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  /* open active menu */
  useEffect(() => {
    const active = ACTIVE_MENU.find((m) =>
      m.items.some((i) => location.pathname.startsWith(i.path))
    );
    if (active) setOpenMenu(active.title);
  }, [location.pathname, ACTIVE_MENU]);

  /* listen to header button */
  useEffect(() => {
    const open = () => setMobileOpen(true);
    window.addEventListener("OPEN_ADMIN_SIDEBAR", open);
    return () => window.removeEventListener("OPEN_ADMIN_SIDEBAR", open);
  }, []);

  /* close on route change */
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed md:static z-50
          h-full md:h-screen w-72
          bg-gradient-to-b from-[#fff7ed] via-[#fff1e6] to-[#ffedd5]
shadow-[6px_0_30px_rgba(255,165,0,0.18)]
border-r border-orange-200

          transform transition-transform duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="px-4 py-4 flex items-center justify-between border-b border-white/30">
          <div className="flex items-center gap-3">
            <img src={PrakuraLogo} className="w-8 h-8" />
            <span className="text-slate-900 font-semibold">PRAKURA TMS</span>

          </div>
          <button
            className="md:hidden text-white"
            onClick={() => setMobileOpen(false)}
          >
            <FaTimes />
          </button>
        </div>

        <nav className="px-2 py-3 space-y-1 text-sm overflow-y-auto">
          {ACTIVE_MENU.filter(
            (m) => allowedMenus.includes(m.title) || role === "Admin"
          ).map((menu) => (
            <div key={menu.title}>
              <button
                className="w-full flex justify-between items-center px-4 py-3 rounded-xl 
font-semibold text-slate-800 hover:bg-orange-100"
                onClick={() =>
                  setOpenMenu((p) => (p === menu.title ? null : menu.title))
                }
              >
                <div className="flex items-center gap-3 text-slate-800">
                  {menu.icon}
                  {menu.title}
                </div>
                <FaChevronDown
                  className={`transition ${
                    openMenu === menu.title ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openMenu === menu.title && (
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
                      <div className="flex items-center gap-3">
  <span className="text-orange-600 text-sm">
    {item.icon}
  </span>
  <span>{item.label}</span>
</div>
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
