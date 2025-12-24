import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
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

/* ===== SETTINGS ===== */
import InstituteProfile from "./pages/admin/settings/InstituteProfile";

/* ===== ASSESSMENTS ===== */
import AssessmentsDashboard from "./pages/admin/assessments/Dashboard";
import CreateAssessment from "./pages/admin/assessments/CreateAssessment";
import QuestionBank from "./pages/admin/assessments/QuestionBank";
import Evaluation from "./pages/admin/assessments/Evaluation";
import Results from "./pages/admin/assessments/Results";

/* ================= APP ================= */

export default function App() {
  return (
    <HashRouter basename="/prakuratms">
      <Routes>

        {/* ROOT */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["Admin", "Finance", "Counsellor"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* DEFAULT ADMIN */}
          <Route index element={<Navigate to="dashboard" replace />} />

          {/* DASHBOARD */}
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
          <Route
            path="attendance/analytics"
            element={<StudentAttendanceAnalytics />}
          />

          {/* ASSESSMENTS */}
          <Route path="assessments" element={<AssessmentsDashboard />} />
          <Route path="assessments/create" element={<CreateAssessment />} />
          <Route path="assessments/questions" element={<QuestionBank />} />
          <Route path="assessments/evaluation" element={<Evaluation />} />
          <Route path="assessments/results" element={<Results />} />

          {/* PAYMENTS */}
          <Route path="payments" element={<Payments />} />
          <Route
            path="payments/:studentId"
            element={<StudentPaymentDetails />}
          />

          {/* FINANCE */}
          <Route
            path="finance/analytics"
            element={
              <ProtectedRoute roles={["Admin", "Finance"]}>
                <PaymentAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="finance/alerts"
            element={
              <ProtectedRoute roles={["Admin", "Finance"]}>
                <OverdueAlerts />
              </ProtectedRoute>
            }
          />

          {/* SETTINGS */}
          <Route
            path="settings/institute"
            element={
              <ProtectedRoute roles={["Admin"]}>
                <InstituteProfile />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* FALLBACK */}
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

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
