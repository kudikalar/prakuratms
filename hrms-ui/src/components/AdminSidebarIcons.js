import {
  FaTachometerAlt,
  FaUsers,
  FaUserShield,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaBookOpen,
  FaPlus,
  FaTags,
  FaFileAlt,
  FaCalendarCheck,
  FaClock,
  FaClipboardList,
  FaTasks,
  FaChartBar,
  FaChartPie,
  FaMoneyBill,
  FaBell,
  FaShieldAlt,
  FaLifeRing,
} from "react-icons/fa";

/* =====================================================
   SUB MENU ICON REGISTRY
   ✔ Single source of truth
   ✔ Immutable
   ✔ Safe fallback
   ✔ Production ready
===================================================== */

/** 🔒 Default fallback icon (never undefined) */
export const DEFAULT_SUB_MENU_ICON = FaTachometerAlt;

/** 🎯 Icon mapping for all sidebar sub-menu labels */
export const SUB_MENU_ICONS = Object.freeze({
  /* ================= DASHBOARD ================= */
  Overview: FaTachometerAlt,

  /* ================= USERS ================= */
  Admins: FaUserShield,
  Educators: FaChalkboardTeacher,
  Students: FaUserGraduate,

  /* ================= COURSES ================= */
  "All Courses": FaBookOpen,
  "Add Course": FaPlus,
  "Course Categories": FaTags,
  "Syllabus & Content": FaFileAlt,

  /* ================= BATCHES ================= */
  Batches: FaUsers,
  "Create Batch": FaPlus,
  Allocation: FaUserGraduate,
  Timetable: FaClock,

  /* ================= ATTENDANCE ================= */
  "Attendance Dashboard": FaCalendarCheck,
  Summary: FaChartPie,

  /* ================= ASSESSMENTS ================= */
  Dashboard: FaClipboardList,
  Create: FaPlus,
  Evaluation: FaTasks,
  Results: FaChartBar,

  /* ================= FINANCE ================= */
  Payments: FaMoneyBill,
  Analytics: FaChartBar,
  "Overdue Alerts": FaBell,

  /* ================= NOTIFICATIONS & SECURITY ================= */
  Announcements: FaBell,
  "Activity Logs": FaShieldAlt,

  /* ================= SUPPORT ================= */
  FAQs: FaLifeRing,
});

/* =====================================================
   SAFE ICON RESOLVER (USE THIS EVERYWHERE)
===================================================== */

/**
 * Returns a valid icon component for a given menu label.
 * Never returns undefined.
 *
 * @param {string} label - Menu label
 * @returns {React.Component}
 */
export const getSubMenuIcon = (label) =>
  SUB_MENU_ICONS[label] || DEFAULT_SUB_MENU_ICON;
