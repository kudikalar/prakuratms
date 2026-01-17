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

/* ================= SUB MENU ICONS ================= */

export const SUB_MENU_ICONS = {
  Overview: FaTachometerAlt,

  Admins: FaUserShield,
  Educators: FaChalkboardTeacher,
  Students: FaUserGraduate,

  "All Courses": FaBookOpen,
  "Add Course": FaPlus,
  "Course Categories": FaTags,
  "Syllabus & Content": FaFileAlt,

  Batches: FaUsers,
  "Create Batch": FaPlus,
  Allocation: FaUserGraduate,
  Timetable: FaClock,

  "Attendance Dashboard": FaCalendarCheck,
  Summary: FaChartPie,

  Dashboard: FaClipboardList,
  Create: FaPlus,
  Evaluation: FaTasks,
  Results: FaChartBar,

  Payments: FaMoneyBill,
  Analytics: FaChartBar,
  "Overdue Alerts": FaBell,

  Announcements: FaBell,
  "Activity Logs": FaShieldAlt,

  FAQs: FaLifeRing,
};
