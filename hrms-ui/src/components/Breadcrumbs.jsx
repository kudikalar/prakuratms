import { Link, useLocation } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";

/* ================= ROUTE LABEL MAP ================= */

const ROUTE_LABELS = {
  admin: "Dashboard",
  dashboard: "Dashboard",

  users: "User Management",
  admins: "Admins",
  educators: "Educators",
  students: "Students",

  courses: "Courses",
  add: "Add Course",
  "course-categories": "Course Categories",
  "course-content": "Syllabus & Content",

  batches: "Batches",
  create: "Create Batch",
  allocation: "Allocation",
  timetable: "Timetable",

  attendance: "Attendance",
  analytics: "Analytics",

  assessments: "Assessments",
  evaluation: "Evaluation",
  results: "Results",

  finance: "Finance",
  payments: "Payments",
  alerts: "Overdue Alerts",

  notifications: "Notifications",
  announcements: "Announcements",

  security: "Security & Audit",
  "activity-logs": "Activity Logs",

  support: "Help & Support",
  faqs: "FAQs",
};

/* ================= BREADCRUMBS ================= */

export default function Breadcrumbs() {
  const location = useLocation();

  const segments = location.pathname
    .split("/")
    .filter(Boolean);

  const crumbs = segments.map((seg, idx) => {
    const path = "/" + segments.slice(0, idx + 1).join("/");
    const label =
      ROUTE_LABELS[seg] ||
      seg.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

    return { path, label };
  });

  return (
    <nav className="flex items-center flex-wrap gap-1 text-sm text-slate-600">
      {crumbs.map((c, i) => (
        <span key={c.path} className="flex items-center gap-1">
          {i > 0 && (
            <FaChevronRight className="text-slate-400 text-xs" />
          )}

          {i === crumbs.length - 1 ? (
            <span className="font-semibold text-slate-800">
              {c.label}
            </span>
          ) : (
            <Link
              to={c.path}
              className="hover:text-purple-600 transition"
            >
              {c.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
