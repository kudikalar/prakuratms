import { useEffect, useState } from "react";
import {
  FaBuilding,
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
  FaArrowUp,
  FaChartLine,
} from "react-icons/fa";

/* =====================================================
   STUDENT PLACEMENT ELIGIBILITY TRACKER (NEXT LEVEL)
===================================================== */

export default function PlacementEligibility() {
  const [student, setStudent] = useState(null);
  const [companies, setCompanies] = useState([]);

  /* ================= INIT ================= */

  useEffect(() => {
    const studentData = {
      attendance: 88,
      mockInterviewScore: 7.5,
      assessmentScore: 74,
      feesCleared: true,
    };

    const companyRules = [
      {
        id: 1,
        company: "TCS",
        role: "Junior Tester",
        rules: {
          attendance: 85,
          mockInterviewScore: 7,
          feesCleared: true,
        },
      },
      {
        id: 2,
        company: "Infosys",
        role: "QA Engineer",
        rules: {
          attendance: 90,
          mockInterviewScore: 8,
          feesCleared: true,
        },
      },
      {
        id: 3,
        company: "Startup – QA",
        role: "Automation Trainee",
        rules: {
          attendance: 75,
          mockInterviewScore: 6,
          feesCleared: true,
        },
      },
    ];

    setStudent(studentData);
    setCompanies(companyRules);
  }, []);

  if (!student) return null;

  /* ================= SUMMARY ================= */

  const readinessScore = Math.round(
    (student.attendance +
      student.mockInterviewScore * 10 +
      student.assessmentScore) /
      3
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* HEADER */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow border">
        <h2 className="text-2xl font-semibold text-slate-800">
          Placement Eligibility Tracker
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Company-wise eligibility with improvement insights
        </p>
      </div>

      {/* SUMMARY DASHBOARD */}
      <div className="bg-white/70 rounded-2xl p-6 shadow border flex justify-between items-center">
        <div className="flex items-center gap-3">
          <FaChartLine className="text-indigo-600 text-xl" />
          <p className="font-medium text-slate-700">
            Overall Placement Readiness
          </p>
        </div>
        <span className="text-2xl font-bold text-indigo-600">
          {readinessScore}%
        </span>
      </div>

      {/* COMPANY LIST */}
      <div className="space-y-4">
        {companies.map((c) => (
          <CompanyCard
            key={c.id}
            company={c}
            student={student}
          />
        ))}
      </div>

      {!companies.length && (
        <p className="text-center text-sm text-slate-400">
          No placement drives available
        </p>
      )}
    </div>
  );
}

/* =====================================================
   COMPONENTS
===================================================== */

const CompanyCard = ({ company, student }) => {
  const attendanceGap =
    student.attendance - company.rules.attendance;
  const mockGap =
    student.mockInterviewScore -
    company.rules.mockInterviewScore;

  const eligible =
    attendanceGap >= 0 &&
    mockGap >= 0 &&
    student.feesCleared === company.rules.feesCleared;

  const priority =
    eligible
      ? "High Chance"
      : attendanceGap >= -2 && mockGap >= -0.5
      ? "Almost There"
      : "Not Ready";

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow border space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FaBuilding className="text-indigo-600" />
            <h3 className="font-semibold text-slate-800">
              {company.company}
            </h3>
          </div>
          <p className="text-sm text-slate-600">
            Role: {company.role}
          </p>
        </div>

        <EligibilityStatus eligible={eligible} />
      </div>

      {/* RULES */}
      <div className="space-y-2 text-sm">
        <Rule
          label="Attendance"
          required={company.rules.attendance}
          actual={student.attendance}
        />
        <Rule
          label="Mock Interview Score"
          required={company.rules.mockInterviewScore}
          actual={student.mockInterviewScore}
        />
        <Rule
          label="Fees Cleared"
          required={company.rules.feesCleared}
          actual={student.feesCleared}
          boolean
        />
      </div>

      {/* INSIGHT */}
      {!eligible ? (
        <p className="flex items-center gap-2 text-xs text-red-600">
          <FaInfoCircle />
          Improve{" "}
          {attendanceGap < 0
            ? `attendance by ${Math.abs(attendanceGap)}%`
            : `mock interview score by ${Math.abs(mockGap)}`}
        </p>
      ) : (
        <p className="flex items-center gap-2 text-xs text-emerald-600">
          <FaArrowUp />
          High probability of shortlisting
        </p>
      )}

      {/* PRIORITY */}
      <span
        className={`inline-block text-xs px-3 py-1 rounded-full font-semibold ${
          priority === "High Chance"
            ? "bg-emerald-100 text-emerald-600"
            : priority === "Almost There"
            ? "bg-yellow-100 text-yellow-600"
            : "bg-red-100 text-red-600"
        }`}
      >
        {priority}
      </span>
    </div>
  );
};

const EligibilityStatus = ({ eligible }) => (
  <div
    className={`flex items-center gap-2 font-semibold ${
      eligible ? "text-emerald-600" : "text-red-600"
    }`}
  >
    {eligible ? <FaCheckCircle /> : <FaTimesCircle />}
    {eligible ? "Eligible" : "Not Eligible"}
  </div>
);

const Rule = ({ label, required, actual, boolean }) => {
  const pass = boolean ? actual === required : actual >= required;

  return (
    <div className="flex justify-between items-center">
      <span className="text-slate-600">{label}</span>
      <span
        className={`font-semibold ${
          pass ? "text-emerald-600" : "text-red-600"
        }`}
      >
        {boolean
          ? actual
            ? "Yes"
            : "No"
          : `${actual} / ${required}`}
      </span>
    </div>
  );
};
