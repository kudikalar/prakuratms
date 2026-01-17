import {
  FaUsers,
  FaBookOpen,
  FaCalendarCheck,
  FaClipboardList,
  FaMoneyBill,
  FaShieldAlt,
  FaLifeRing,
} from "react-icons/fa";

/* ================= ROLE BASED MENU CONFIG ================= */

export const SIDEBAR_CONFIG = {
  Admin: [
    {
      title: "User Management",
      icon: FaUsers,
      subMenus: ["Admins", "Educators", "Students"],
    },
    {
      title: "Course Management",
      icon: FaBookOpen,
      subMenus: [
        "All Courses",
        "Add Course",
        "Course Categories",
        "Syllabus & Content",
      ],
    },
    {
      title: "Batch Management",
      icon: FaUsers,
      subMenus: ["Batches", "Create Batch", "Allocation", "Timetable"],
    },
    {
      title: "Attendance",
      icon: FaCalendarCheck,
      subMenus: ["Attendance Dashboard", "Summary"],
    },
    {
      title: "Assessments",
      icon: FaClipboardList,
      subMenus: ["Dashboard", "Create", "Evaluation", "Results"],
    },
    {
      title: "Payments",
      icon: FaMoneyBill,
      subMenus: ["Payments", "Analytics", "Overdue Alerts"],
    },
    {
      title: "Security & Audit",
      icon: FaShieldAlt,
      subMenus: ["Announcements", "Activity Logs"],
    },
    {
      title: "Help & Support",
      icon: FaLifeRing,
      subMenus: ["FAQs"],
    },
  ],

  Educator: [
    {
      title: "Attendance",
      icon: FaCalendarCheck,
      subMenus: ["Attendance Dashboard"],
    },
    {
      title: "Assessments",
      icon: FaClipboardList,
      subMenus: ["Dashboard", "Evaluation", "Results"],
    },
  ],

  Student: [
    {
      title: "My Courses",
      icon: FaBookOpen,
      subMenus: ["All Courses"],
    },
    {
      title: "Payments",
      icon: FaMoneyBill,
      subMenus: ["Payments"],
    },
  ],
};
