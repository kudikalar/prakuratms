import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";

/* ================= AUTH ================= */
import Login from "./pages/Login";

/* ================= LAYOUTS ================= */
import AdminLayout from "./pages/admin/AdminLayout";
import StudentLayout from "./pages/student/StudentLayout";

/* ================= ADMIN ================= */
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

import InstituteProfile from "./pages/admin/settings/InstituteProfile";

/* ================= EDUCATOR ================= */
import AssignedCourses from "./pages/educator/AssignedCourses";
import EducatorCourseContent from "./pages/educator/CourseContent";
import MyBatches from "./pages/educator/MyBatches";
import Schedule from "./pages/educator/Schedule";
import StudentList from "./pages/educator/StudentList";
import Performance from "./pages/educator/Performance";
import MarkAttendance from "./pages/educator/MarkAttendance";
import EducatorHistory from "./pages/educator/History";

/* ================= STUDENT ================= */
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
import PlacementStats from "./pages/student/PlacementStats";

import ResumeBuilder from "./pages/student/ResumeBuilder";
import Certificates from "./pages/student/Certificates";
import Documents from "./pages/student/Documents";

import PaymentsStudent from "./pages/student/Payments";
import Notifications from "./pages/student/Notifications";

import StudentDirectory from "./pages/student/StudentDirectory";
import AlumniDirectory from "./pages/student/AlumniDirectory";
import AlumniSuccessStories from "./pages/student/AlumniSuccessStories";
import AlumniStoryMatcher from "./pages/student/AlumniStoryMatcher";
import ReferralRequests from "./pages/student/ReferralRequests";
import OneToOneDiscussions from "./pages/student/OneToOneDiscussions";

import Profile from "./pages/student/Profile";
import OverallStudentReport from "./pages/student/OverallStudentReport";
import StudentAIcoach from "./pages/student/StudentAIcoach";

/* ================= HELPERS ================= */

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}

function NotFound() {
  return (
    <div className="p-10 text-center text-slate-500">
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
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* ================= ADMIN / EDUCATOR ================= */}
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

          {/* Users */}
          <Route path="users/admins" element={<Admins />} />
          <Route path="users/educators" element={<Educators />} />
          <Route path="users/students" element={<Students />} />
          <Route path="users/students/:id" element={<StudentProfile />} />

          {/* Courses */}
          <Route path="courses" element={<AllCourses />} />
          <Route path="courses/add" element={<AddCourse />} />
          <Route path="course-categories" element={<CourseCategories />} />
          <Route path="course-content" element={<CourseContent />} />

          {/* Batches */}
          <Route path="batches" element={<Batches />} />
          <Route path="batches/create" element={<CreateBatch />} />
          <Route path="batches/allocation" element={<BatchAllocation />} />
          <Route path="batches/timetable" element={<Timetable />} />

          {/* Attendance */}
          <Route path="attendance" element={<AttendanceDashboard />} />
          <Route path="attendance/analytics" element={<StudentAttendanceAnalytics />} />

          {/* Assessments */}
          <Route path="assessments" element={<AssessmentsDashboard />} />
          <Route path="assessments/create" element={<CreateAssessment />} />
          <Route path="assessments/questions" element={<QuestionBank />} />
          <Route path="assessments/evaluation" element={<Evaluation />} />
          <Route path="assessments/results" element={<Results />} />

          {/* Finance */}
          <Route path="payments" element={<Payments />} />
          <Route path="payments/:studentId" element={<StudentPaymentDetails />} />
          <Route path="finance/analytics" element={<PaymentAnalytics />} />
          <Route path="finance/alerts" element={<OverdueAlerts />} />

          {/* Others */}
          <Route path="notifications/announcements" element={<Announcements />} />
          <Route path="security/activity-logs" element={<ActivityLogs />} />
          <Route path="security/audit" element={<SecurityAudit />} />
          <Route path="support/faqs" element={<FAQs />} />
          <Route path="support/tickets" element={<SupportTickets />} />
          <Route path="support/contact" element={<ContactAdmin />} />
          <Route path="settings/institute" element={<InstituteProfile />} />

          {/* Educator */}
          <Route path="educator/assigned-courses" element={<AssignedCourses />} />
          <Route path="educator/course-content" element={<EducatorCourseContent />} />
          <Route path="educator/my-batches" element={<MyBatches />} />
          <Route path="educator/schedule" element={<Schedule />} />
          <Route path="educator/students" element={<StudentList />} />
          <Route path="educator/performance" element={<Performance />} />
          <Route path="educator/attendance/mark" element={<MarkAttendance />} />
          <Route path="educator/history" element={<EducatorHistory />} />

          <Route path="*" element={<NotFound />} />
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
          <Route path="courses" element={<Courses />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="assessments" element={<Assessments />} />

          <Route path="projects" element={<MyProjects />} />
          <Route path="project-progress" element={<ProjectProgress />} />
          <Route path="project-submission" element={<ProjectSubmission />} />
          <Route path="project-review" element={<ProjectReview />} />
          <Route path="project-evaluation" element={<ProjectEvaluation />} />

          <Route path="daily-tasks" element={<DailyTaskTracker />} />
          <Route path="weekly-goals" element={<WeeklyLearningGoals />} />
          <Route path="skill-gap" element={<SkillGapAnalyzer />} />

          <Route path="mock-interviews" element={<MockInterviews />} />
          <Route path="mock-results" element={<MockInterviewResults />} />
          <Route path="interviews" element={<ScheduledInterviews />} />

          <Route path="placement-eligibility" element={<PlacementEligibility />} />
          <Route path="placement-readiness" element={<PlacementReadiness />} />
          <Route path="placements" element={<Placements />} />
          <Route path="placement-stats" element={<PlacementStats />} />

          <Route path="resume-builder" element={<ResumeBuilder />} />
          <Route path="certificates" element={<Certificates />} />
          <Route path="documents" element={<Documents />} />

          <Route path="payments" element={<PaymentsStudent />} />
          <Route path="notifications" element={<Notifications />} />

          <Route path="peers" element={<StudentDirectory />} />
          <Route path="alumni" element={<AlumniDirectory />} />
          <Route path="alumni-stories" element={<AlumniSuccessStories />} />
          <Route path="alumni-matcher" element={<AlumniStoryMatcher />} />
          <Route path="referrals" element={<ReferralRequests />} />
          <Route path="discussions" element={<OneToOneDiscussions />} />

          <Route path="ai-coach" element={<StudentAIcoach />} />
          <Route path="report" element={<OverallStudentReport />} />
          <Route path="profile" element={<Profile />} />

          <Route path="*" element={<NotFound />} />
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

  const role = user?.role?.toUpperCase();

  if (!roles.includes(role)) {
    return (
      <Navigate
        to={role === "STUDENT" ? "/student/dashboard" : "/admin/dashboard"}
        replace
      />
    );
  }

  return children;
}
