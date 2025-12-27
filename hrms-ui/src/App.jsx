import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import Login from "./pages/Login";
import AdminLayout from "./pages/admin/AdminLayout";

/* ===== ADMIN ===== */
import DashboardHome from "./pages/admin/DashboardHome";
import Admins from "./pages/admin/users/Admins";
import Educators from "./pages/admin/users/Educators";
import Students from "./pages/admin/users/Students";
import StudentProfile from "./pages/admin/users/StudentProfile";
import AllCourses from "./pages/admin/courses/AllCourses";
import AddCourse from "./pages/admin/courses/AddCourse";
import CourseCategories from "./pages/admin/courses/CourseCategories";
import CourseContent from "./pages/admin/courses/CourseContent";
import Batches from "./pages/admin/batches/Batches";
import CreateBatch from "./pages/admin/batches/CreateBatch";
import BatchAllocation from "./pages/admin/batches/BatchAllocation";
import Timetable from "./pages/admin/batches/Timetable";
import AttendanceDashboard from "./pages/admin/attendance/AttendanceDashboard";
import StudentAttendanceAnalytics from "./pages/admin/attendance/analytics/StudentAttendanceAnalytics";
import Payments from "./pages/admin/payments/Payments";
import StudentPaymentDetails from "./pages/admin/payments/StudentPaymentDetails";
import PaymentAnalytics from "./pages/admin/finance/PaymentAnalytics";
import OverdueAlerts from "./pages/admin/finance/OverdueAlerts";
import Announcements from "./pages/admin/notifications/Announcements";
import InstituteProfile from "./pages/admin/settings/InstituteProfile";
import AssessmentsDashboard from "./pages/admin/assessments/Dashboard";
import CreateAssessment from "./pages/admin/assessments/CreateAssessment";
import QuestionBank from "./pages/admin/assessments/QuestionBank";
import Evaluation from "./pages/admin/assessments/Evaluation";
import Results from "./pages/admin/assessments/Results";
import ActivityLogs from "./pages/admin/security/ActivityLogs";
import SecurityAudit from "./pages/admin/security/SecurityAudit";
import FAQs from "./pages/admin/support/FAQs";
import SupportTickets from "./pages/admin/support/SupportTickets";
import ContactAdmin from "./pages/admin/support/ContactAdmin";

/* ===== STUDENT ===== */
import StudentLayout from "./pages/student/StudentLayout";
import StudentDashboard from "./pages/student/Dashboard";
import Courses from "./pages/student/Courses";
import Attendance from "./pages/student/Attendance";
import Assessments from "./pages/student/Assessments";
import MyProjects from "./pages/student/MyProjects";
import ProjectProgress from "./pages/student/ProjectProgress";
import ProjectSubmission from "./pages/student/ProjectSubmission";
import ProjectReview from "./pages/student/ProjectReview";
import ProjectEvaluation from "./pages/student/ProjectEvaluation";
import DailyTaskTracker from "./pages/student/DailyTaskTracker";
import WeeklyLearningGoals from "./pages/student/WeeklyLearningGoals";
import SkillGapAnalyzer from "./pages/student/SkillGapAnalyzer";
import MockInterviews from "./pages/student/MockInterviews";
import MockInterviewResults from "./pages/student/MockInterviewResults";
import ScheduledInterviews from "./pages/student/ScheduledInterviews";
import PlacementEligibility from "./pages/student/PlacementEligibility";
import PlacementReadiness from "./pages/student/PlacementReadiness";
import Placements from "./pages/student/Placements";
import ResumeBuilder from "./pages/student/ResumeBuilder";
import Certificates from "./pages/student/Certificates";
import Documents from "./pages/student/Documents";
import PaymentsStudent from "./pages/student/Payments";
import Notifications from "./pages/student/Notifications";
import StudentDirectory from "./pages/student/StudentDirectory";
import AlumniDirectory from "./pages/student/AlumniDirectory";
import Profile from "./pages/student/Profile";
import OverallStudentReport from "./pages/student/OverallStudentReport";

/* ================= HELPERS ================= */

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}

function AdminNotFound() {
  return <div className="p-6 text-center text-slate-600">Page not found</div>;
}

/* ================= APP ================= */

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* ================= ADMIN ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["ADMIN", "FINANCE", "COUNSELLOR", "EDUCATOR"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="users/admins" element={<Admins />} />
          <Route path="users/educators" element={<Educators />} />
          <Route path="users/students" element={<Students />} />
          <Route path="users/students/:id" element={<StudentProfile />} />
          <Route path="courses" element={<AllCourses />} />
          <Route path="courses/add" element={<AddCourse />} />
          <Route path="course-categories" element={<CourseCategories />} />
          <Route path="course-content" element={<CourseContent />} />
          <Route path="batches" element={<Batches />} />
          <Route path="batches/create" element={<CreateBatch />} />
          <Route path="batches/allocation" element={<BatchAllocation />} />
          <Route path="batches/timetable" element={<Timetable />} />
          <Route path="attendance" element={<AttendanceDashboard />} />
          <Route path="attendance/analytics" element={<StudentAttendanceAnalytics />} />
          <Route path="assessments" element={<AssessmentsDashboard />} />
          <Route path="assessments/create" element={<CreateAssessment />} />
          <Route path="assessments/questions" element={<QuestionBank />} />
          <Route path="assessments/evaluation" element={<Evaluation />} />
          <Route path="assessments/results" element={<Results />} />
          <Route path="payments" element={<Payments />} />
          <Route path="payments/:studentId" element={<StudentPaymentDetails />} />
          <Route path="finance/analytics" element={<PaymentAnalytics />} />
          <Route path="finance/alerts" element={<OverdueAlerts />} />
          <Route path="notifications/announcements" element={<Announcements />} />
          <Route path="security/activity-logs" element={<ActivityLogs />} />
          <Route path="security/audit" element={<SecurityAudit />} />
          <Route path="support/faqs" element={<FAQs />} />
          <Route path="support/tickets" element={<SupportTickets />} />
          <Route path="support/contact" element={<ContactAdmin />} />
          <Route path="settings/institute" element={<InstituteProfile />} />
          <Route path="*" element={<AdminNotFound />} />
        </Route>

        {/* ================= STUDENT ================= */}
        <Route
          path="/student"
          element={
            <ProtectedRoute roles={["STUDENT"]}>
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="report" element={<OverallStudentReport />} /> {/* 🔧 alias */}
          <Route path="overall-report" element={<OverallStudentReport />} />
          <Route path="courses" element={<Courses />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="assessments" element={<Assessments />} />
          <Route path="projects" element={<MyProjects />} />
          <Route path="projects/progress" element={<ProjectProgress />} />
          <Route path="projects/submissions" element={<ProjectSubmission />} />
          <Route path="projects/reviews" element={<ProjectReview />} />
          <Route path="projects/evaluation" element={<ProjectEvaluation />} />
          <Route path="daily-tasks" element={<DailyTaskTracker />} />
          <Route path="weekly-goals" element={<WeeklyLearningGoals />} />
          <Route path="skill-gap" element={<SkillGapAnalyzer />} />
          <Route path="mock-interviews" element={<MockInterviews />} />
          <Route path="mock-results" element={<MockInterviewResults />} />
          <Route path="interviews" element={<ScheduledInterviews />} /> {/* 🔧 FIX */}
          <Route path="scheduled-interviews" element={<ScheduledInterviews />} />
          <Route path="placement/eligibility" element={<PlacementEligibility />} />
          <Route path="placement/readiness" element={<PlacementReadiness />} />
          <Route path="placement" element={<Placements />} />
          <Route path="resume-builder" element={<ResumeBuilder />} />
          <Route path="certificates" element={<Certificates />} />
          <Route path="documents" element={<Documents />} />
          <Route path="payments" element={<PaymentsStudent />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="peers" element={<StudentDirectory />} />
          <Route path="alumni" element={<AlumniDirectory />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </HashRouter>
  );
}

/* ================= PROTECTED ROUTE ================= */

function ProtectedRoute({ children, roles }) {
  const token = localStorage.getItem("token");
  const rawUser = localStorage.getItem("user");

  if (!token || !rawUser) {
    return <Navigate to="/login" replace />;
  }

  let user;
  try {
    user = JSON.parse(rawUser);
  } catch {
    return <Navigate to="/login" replace />;
  }

  const userRole = user?.role?.toUpperCase();

  if (!roles.includes(userRole)) {
    return (
      <Navigate
        to={userRole === "STUDENT" ? "/student/dashboard" : "/admin/dashboard"}
        replace
      />
    );
  }

  return children;
}
