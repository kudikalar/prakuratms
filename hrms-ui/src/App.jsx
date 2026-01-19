import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";

/* ================= AUTH ================= */
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Contact from "./pages/Contact";

/* ================= LAYOUTS ================= */
import AdminLayout from "./pages/admin/AdminLayout";
import EducatorLayout from "./pages/educator/EducatorLayout";
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
import AdminCourseContent from "./pages/admin/courses/CourseContent";

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
import EducatorDashboard from "./pages/educator/EducatorDashboard";
import AssignedCourses from "./pages/educator/AssignedCourses";
import EducatorCourseContent from "./pages/educator/CourseContent";
import LessonPlanner from "./pages/educator/LessonPlanner";
import MyBatches from "./pages/educator/MyBatches";
import StudentList from "./pages/educator/StudentList";
import StudentProgress from "./pages/educator/StudentProgress";
import MarkAttendance from "./pages/educator/MarkAttendance";
import AttendanceHistory from "./pages/educator/AttendanceHistory";
import Schedule from "./pages/educator/Schedule";
import Performance from "./pages/educator/Performance";
import Messages from "./pages/educator/Messages";
import BatchAnalytics from "./pages/educator/BatchAnalytics";
import BatchComparison from "./pages/educator/BatchComparison";
import CourseCompletionReports from "./pages/educator/CourseCompletionReports";
import RiskPrediction from "./pages/educator/RiskPrediction";
import StudentInterventions from "./pages/educator/StudentInterventions";
import StudentNotes from "./pages/educator/StudentNotes";
import PPTUpload from "./pages/educator/PPTUpload";

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
import StudentAICoach from "./pages/student/StudentAICoach";

/* ================= HELPERS ================= */

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

/* ================= APP ================= */

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-black text-white">
        <Routes>

          {/* PUBLIC */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contact" element={<Contact />} />

          {/* ADMIN */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["ADMIN", "FINANCE", "CFO", "COUNSELLOR"]}>
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
            <Route path="course-content" element={<AdminCourseContent />} />
            <Route path="batches" element={<Batches />} />
            <Route path="batches/create" element={<CreateBatch />} />
            <Route path="batches/allocation" element={<BatchAllocation />} />
            <Route path="batches/timetable" element={<Timetable />} />
            <Route path="attendance" element={<AttendanceDashboard />} />
            <Route path="attendance/analytics" element={<StudentAttendanceAnalytics />} />
            <Route path="payments" element={<Payments />} />
            <Route path="payments/:studentId" element={<StudentPaymentDetails />} />
            <Route path="finance/analytics" element={<PaymentAnalytics />} />
            <Route path="finance/alerts" element={<OverdueAlerts />} />
            <Route path="assessments" element={<AssessmentsDashboard />} />
            <Route path="assessments/create" element={<CreateAssessment />} />
            <Route path="assessments/questions" element={<QuestionBank />} />
            <Route path="assessments/evaluation" element={<Evaluation />} />
            <Route path="assessments/results" element={<Results />} />
            <Route path="notifications/announcements" element={<Announcements />} />
            <Route path="security/activity-logs" element={<ActivityLogs />} />
            <Route path="security/audit" element={<SecurityAudit />} />
            <Route path="support/faqs" element={<FAQs />} />
            <Route path="support/tickets" element={<SupportTickets />} />
            <Route path="support/contact" element={<ContactAdmin />} />
            <Route path="settings/institute" element={<InstituteProfile />} />
          </Route>

          {/* EDUCATOR */}
          <Route
            path="/educator"
            element={
              <ProtectedRoute roles={["EDUCATOR"]}>
                <EducatorLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<EducatorDashboard />} />
            <Route path="assigned-courses" element={<AssignedCourses />} />
            <Route path="course-content" element={<EducatorCourseContent />} />
            <Route path="lesson-planner" element={<LessonPlanner />} />
            <Route path="ppt-upload" element={<PPTUpload />} />
            <Route path="my-batches" element={<MyBatches />} />
            <Route path="students" element={<StudentList />} />
            <Route path="student-progress/:studentId" element={<StudentProgress />} />
            <Route path="mark-attendance/:batchId" element={<MarkAttendance />} />
            <Route path="attendance-history/:batchId" element={<AttendanceHistory />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="performance" element={<Performance />} />
            <Route path="messages" element={<Messages />} />
            <Route path="batch-analytics" element={<BatchAnalytics />} />
            <Route path="batch-comparison" element={<BatchComparison />} />
            <Route path="course-completion" element={<CourseCompletionReports />} />
            <Route path="risk-prediction" element={<RiskPrediction />} />
            <Route path="student-interventions" element={<StudentInterventions />} />
            <Route path="student-notes/:studentId" element={<StudentNotes />} />
          </Route>

          {/* STUDENT */}
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
            <Route path="ai-coach" element={<StudentAICoach />} />
            <Route path="report" element={<OverallStudentReport />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

/* ================= PROTECTED ROUTE ================= */

function ProtectedRoute({ children, roles }) {
  const token = localStorage.getItem("token");
  const rawUser = localStorage.getItem("user");

  if (!token || !rawUser) {
    // 🔐 HASH ROUTER SAFE REDIRECT
    window.location.replace("/#/");
    return null;
  }

  let user;
  try {
    user = JSON.parse(rawUser);
  } catch {
    window.location.replace("/#/");
    return null;
  }

  const role = user?.role?.toUpperCase();

  if (!roles.includes(role)) {
    if (role === "STUDENT")
      return <Navigate to="/student/dashboard" replace />;
    if (role === "EDUCATOR")
      return <Navigate to="/educator/dashboard" replace />;
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}