import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBookOpen,
  FaTasks,
  FaUsers,
  FaCalendarAlt,
  FaChartLine,
  FaComments,
  FaUpload,
  FaChevronDown,
  FaLifeRing,
  FaTimes,
} from "react-icons/fa";

/* ================= MENU CONFIG ================= */

const EDUCATOR_MENU = [
  {
    title: "Dashboard",
    icon: <FaTachometerAlt />,
    items: [{ label: "Overview", path: "/educator/dashboard", icon: <FaTachometerAlt /> }],
  },
  {
    title: "My Courses",
    icon: <FaBookOpen />,
    items: [
      { label: "Assigned Courses", path: "/educator/assigned-courses", icon: <FaBookOpen /> },
      { label: "Course Content", path: "/educator/course-content", icon: <FaTasks /> },
      { label: "Lesson Planner", path: "/educator/lesson-planner", icon: <FaCalendarAlt /> },
      { label: "PPT Upload", path: "/educator/ppt-upload", icon: <FaUpload /> },
    ],
  },
  {
    title: "Batches",
    icon: <FaUsers />,
    items: [{ label: "My Batches", path: "/educator/my-batches", icon: <FaUsers /> }],
  },
  {
    title: "Students",
    icon: <FaUsers />,
    items: [{ label: "Student List", path: "/educator/students", icon: <FaUsers /> }],
  },
  {
    title: "Schedule",
    icon: <FaCalendarAlt />,
    items: [{ label: "Schedule", path: "/educator/schedule", icon: <FaCalendarAlt /> }],
  },
  {
    title: "Reports",
    icon: <FaChartLine />,
    items: [
      { label: "Performance", path: "/educator/performance", icon: <FaChartLine /> },
      { label: "Batch Analytics", path: "/educator/batch-analytics", icon: <FaChartLine /> },
      { label: "Batch Comparison", path: "/educator/batch-comparison", icon: <FaChartLine /> },
      { label: "Course Reports", path: "/educator/course-completion", icon: <FaChartLine /> },
      { label: "Risk Prediction", path: "/educator/risk-prediction", icon: <FaChartLine /> },
    ],
  },
  {
    title: "Messages",
    icon: <FaComments />,
    items: [{ label: "Messages", path: "/educator/messages", icon: <FaComments /> }],
  },
  {
    title: "Help & Support",
    icon: <FaLifeRing />,
    items: [{ label: "Support", path: "/admin/support/faqs", icon: <FaLifeRing /> }],
  },
];

/* ================= SIDEBAR ================= */

export default function EducatorSidebar() {
  const location = useLocation();

  /* 🔥 Remember last open menu */
  const [openMenu, setOpenMenu] = useState(
    () => localStorage.getItem("educator_open_menu") || null
  );

  /* 🔥 Mobile slide-in state */
  const [mobileOpen, setMobileOpen] = useState(false);

  /* AUTO OPEN ACTIVE SECTION */
  useEffect(() => {
    const active = EDUCATOR_MENU.find((m) =>
      m.items.some((i) => location.pathname.startsWith(i.path))
    );
    if (active) {
      setOpenMenu(active.title);
      localStorage.setItem("educator_open_menu", active.title);
    }
    setMobileOpen(false);
  }, [location.pathname]);

  /* LISTEN FROM HEADER (mobile menu button) */
  useEffect(() => {
    const open = () => setMobileOpen(true);
    window.addEventListener("OPEN_EDUCATOR_SIDEBAR", open);
    return () => window.removeEventListener("OPEN_EDUCATOR_SIDEBAR", open);
  }, []);

  const toggleMenu = (title) => {
    setOpenMenu((prev) => {
      const next = prev === title ? null : title;
      if (next) localStorage.setItem("educator_open_menu", next);
      return next;
    });
  };

  return (
    <>
      {/* MOBILE BACKDROP */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-72 z-50
        bg-gradient-to-br from-blue-800 via-blue-900 to-indigo-900
        border-r border-white/20 transform transition-transform duration-300
        ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* HEADER */}
        <div className="px-5 py-4 border-b border-white/20 flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-lg">PRAKURA TMS</h2>
            <p className="text-xs text-blue-200">Educator Panel</p>
          </div>

          {/* MOBILE CLOSE */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileOpen(false)}
          >
            <FaTimes />
          </button>
        </div>

        {/* MENU */}
        <nav className="px-3 py-4 space-y-1 text-white text-sm overflow-y-auto">
          {EDUCATOR_MENU.map((menu) => (
            <div key={menu.title}>
              {/* SECTION HEADER */}
              <button
                onClick={() => toggleMenu(menu.title)}
                className="w-full flex items-center justify-between px-3 py-2
                rounded-lg hover:bg-white/10 transition"
              >
                <span className="flex items-center gap-3">
                  {menu.icon}
                  {menu.title}
                </span>
                <FaChevronDown
                  className={`transition-transform ${
                    openMenu === menu.title ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* SUB MENU */}
              {openMenu === menu.title && (
                <div className="ml-6 mt-1 space-y-1">
                  {menu.items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-1.5 rounded-md transition
                        ${
                          isActive
                            ? "bg-white/20 font-semibold"
                            : "hover:bg-white/10"
                        }`
                      }
                    >
                      {item.icon}
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
