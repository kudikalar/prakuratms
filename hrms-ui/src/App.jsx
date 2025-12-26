import { HashRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Login from "./pages/Login";
import AdminLayout from "./pages/admin/AdminLayout";

/* ===== DASHBOARD ===== */
import DashboardHome from "./pages/admin/DashboardHome";

/* ===== USERS ===== */
import Admins from "./pages/admin/users/Admins";
import Educators from "./pages/admin/users/Educators";
import Students from "./pages/admin/users/Students";
import StudentProfile from "./pages/admin/users/StudentProfile";

/* ===== COURSES ===== */
import AllCourses from "./pages/admin/courses/AllCourses";
import AddCourse from "./pages/admin/courses/AddCourse";
import CourseCategories from "./pages/admin/courses/CourseCategories";
import CourseContent from "./pages/admin/courses/CourseContent";

/* ===== BATCHES ===== */
import Batches from "./pages/admin/batches/Batches";
import CreateBatch from "./pages/admin/batches/CreateBatch";
import BatchAllocation from "./pages/admin/batches/BatchAllocation";
import Timetable from "./pages/admin/batches/Timetable";

/* ===== ATTENDANCE ===== */
import AttendanceDashboard from "./pages/admin/attendance/AttendanceDashboard";
import StudentAttendanceAnalytics from "./pages/admin/attendance/analytics/StudentAttendanceAnalytics";

/* ===== PAYMENTS ===== */
import Payments from "./pages/admin/payments/Payments";
import StudentPaymentDetails from "./pages/admin/payments/StudentPaymentDetails";

/* ===== FINANCE ===== */
import PaymentAnalytics from "./pages/admin/finance/PaymentAnalytics";
import OverdueAlerts from "./pages/admin/finance/OverdueAlerts";

/* ===== NOTIFICATIONS ===== */
import Announcements from "./pages/admin/notifications/Announcements";

/* ===== SETTINGS ===== */
import InstituteProfile from "./pages/admin/settings/InstituteProfile";

/* ===== ASSESSMENTS ===== */
import AssessmentsDashboard from "./pages/admin/assessments/Dashboard";
import CreateAssessment from "./pages/admin/assessments/CreateAssessment";
import QuestionBank from "./pages/admin/assessments/QuestionBank";
import Evaluation from "./pages/admin/assessments/Evaluation";
import Results from "./pages/admin/assessments/Results";

/* ===== SECURITY ===== */
import ActivityLogs from "./pages/admin/security/ActivityLogs";
import SecurityAudit from "./pages/admin/security/SecurityAudit";

/* ===== HELP & SUPPORT ===== */
import FAQs from "./pages/admin/support/FAQs";
import SupportTickets from "./pages/admin/support/SupportTickets";
import ContactAdmin from "./pages/admin/support/ContactAdmin";

/* ================= HELPERS ================= */

// Scroll to top on route change (UX polish)
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}

// Admin 404 (safe fallback)
function AdminNotFound() {
  return (
    <div className="p-6 text-center text-slate-600">
      Page not found
    </div>
  );
}

/* ================= APP ================= */

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />

      <Routes>
        {/* ROOT */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* ADMIN (PROTECTED LAYOUT) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute
              roles={["Admin", "Finance", "Counsellor", "Educator", "Student"]}
            >
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardHome />} />

          {/* USERS */}
          <Route path="users/admins" element={<Admins />} />
          <Route path="users/educators" element={<Educators />} />
          <Route path="users/students" element={<Students />} />
          <Route path="users/students/:id" element={<StudentProfile />} />

          {/* COURSES */}
          <Route path="courses" element={<AllCourses />} />
          <Route path="courses/add" element={<AddCourse />} />
          <Route path="course-categories" element={<CourseCategories />} />
          <Route path="course-content" element={<CourseContent />} />

          {/* BATCHES */}
          <Route path="batches" element={<Batches />} />
          <Route path="batches/create" element={<CreateBatch />} />
          <Route path="batches/allocation" element={<BatchAllocation />} />
          <Route path="batches/timetable" element={<Timetable />} />

          {/* ATTENDANCE */}
          <Route path="attendance" element={<AttendanceDashboard />} />
          <Route path="attendance/analytics" element={<StudentAttendanceAnalytics />} />

          {/* ASSESSMENTS */}
          <Route path="assessments" element={<AssessmentsDashboard />} />
          <Route path="assessments/create" element={<CreateAssessment />} />
          <Route path="assessments/questions" element={<QuestionBank />} />
          <Route path="assessments/evaluation" element={<Evaluation />} />
          <Route path="assessments/results" element={<Results />} />

          {/* PAYMENTS */}
          <Route path="payments" element={<Payments />} />
          <Route path="payments/:studentId" element={<StudentPaymentDetails />} />

          {/* FINANCE */}
          <Route path="finance/analytics" element={<PaymentAnalytics />} />
          <Route path="finance/alerts" element={<OverdueAlerts />} />

          {/* NOTIFICATIONS */}
          <Route path="notifications/announcements" element={<Announcements />} />

          {/* SECURITY */}
          <Route path="security/activity-logs" element={<ActivityLogs />} />
          <Route path="security/audit" element={<SecurityAudit />} />

          {/* HELP & SUPPORT */}
          <Route path="support/faqs" element={<FAQs />} />
          <Route path="support/tickets" element={<SupportTickets />} />
          <Route path="support/contact" element={<ContactAdmin />} />

          {/* SETTINGS */}
          <Route path="settings/institute" element={<InstituteProfile />} />

          {/* ADMIN 404 */}
          <Route path="*" element={<AdminNotFound />} />
        </Route>

        {/* GLOBAL FALLBACK */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </HashRouter>
  );
}

/* ================= PROTECTED ROUTE ================= */

function ProtectedRoute({ children, roles }) {
  const token = localStorage.getItem("token");
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  // NOT LOGGED IN
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // ROLE NOT ALLOWED → SAFE REDIRECT
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}
