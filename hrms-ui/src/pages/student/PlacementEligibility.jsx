import { useEffect, useState } from "react";
import {
  FaBuilding,
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
  FaArrowUp,
} from "react-icons/fa";

/* =====================================================
   PLACEMENT ELIGIBILITY (RICH PURPLE TABLE UI)
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

  const readinessScore = Math.round(
    (student.attendance +
      student.mockInterviewScore * 10 +
      student.assessmentScore) /
      3
  );

  /* ================= UI ================= */

  return (
    <div className="space-y-10 animate-fadeIn">

      {/* HEADER */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow border border-white/40">
        <h2 className="text-3xl font-bold text-slate-800">
          Placement Eligibility
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Company-wise requirements & your eligibility status
        </p>
      </div>

      {/* SUMMARY CARD */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow border flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
          <FaBuilding className="text-indigo-600" />
          Overall Placement Readiness
        </h3>
        <span className="text-3xl font-extrabold text-indigo-600">
          {readinessScore}%
        </span>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white/70 backdrop-blur-xl rounded-2xl shadow border border-white/40">
        <table className="w-full text-sm">
          <thead className="bg-purple-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left">Company</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Attendance</th>
              <th className="px-4 py-3">Mock Score</th>
              <th className="px-4 py-3">Fees</th>
              <th className="px-4 py-3">Eligibility</th>
              <th className="px-4 py-3">Insight</th>
              <th className="px-4 py-3">Priority</th>
            </tr>
          </thead>

          <tbody>
            {companies.map((c) => {
              const attendanceGap = student.attendance - c.rules.attendance;
              const mockGap =
                student.mockInterviewScore - c.rules.mockInterviewScore;

              const eligible =
                attendanceGap >= 0 &&
                mockGap >= 0 &&
                student.feesCleared === c.rules.feesCleared;

              const priority = eligible
                ? "High Chance"
                : attendanceGap >= -2 && mockGap >= -0.5
                ? "Almost There"
                : "Not Ready";

              const insight = eligible
                ? "Strong Eligibility"
                : attendanceGap < 0
                ? `Improve attendance by ${Math.abs(attendanceGap)}%`
                : `Improve mock score by ${Math.abs(mockGap)}`;

              return (
                <tr
                  key={c.id}
                  className="border-b last:border-0 hover:bg-purple-50 transition"
                >
                  {/* COMPANY */}
                  <td className="px-4 py-4 flex items-center gap-2 font-medium text-slate-800">
                    <FaBuilding className="text-indigo-600" />
                    {c.company}
                  </td>

                  {/* ROLE */}
                  <td className="px-4 py-4 text-slate-700">{c.role}</td>

                  {/* ATTENDANCE */}
                  <td className="px-4 py-4 text-center font-semibold">
                    {student.attendance} / {c.rules.attendance}
                  </td>

                  {/* MOCK SCORE */}
                  <td className="px-4 py-4 text-center font-semibold">
                    {student.mockInterviewScore} / {c.rules.mockInterviewScore}
                  </td>

                  {/* FEES */}
                  <td className="px-4 py-4 text-center font-semibold">
                    {student.feesCleared ? "Yes" : "No"}
                  </td>

                  {/* ELIGIBILITY */}
                  <td className="px-4 py-4 text-center">
                    <EligibilityCell eligible={eligible} />
                  </td>

                  {/* INSIGHT */}
                  <td className="px-4 py-4 text-indigo-700 font-medium">
                    {eligible ? (
                      <span className="flex items-center gap-1 text-emerald-600">
                        <FaArrowUp />
                        High probability
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-600">
                        <FaInfoCircle />
                        {insight}
                      </span>
                    )}
                  </td>

                  {/* PRIORITY BADGE */}
                  <td className="px-4 py-4 text-center">
                    <PriorityBadge level={priority} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {!companies.length && (
          <p className="text-center py-6 text-slate-400">
            No placement drives available
          </p>
        )}
      </div>
    </div>
  );
}

/* =====================================================
   TABLE SUB-COMPONENTS
===================================================== */

const EligibilityCell = ({ eligible }) => (
  <span
    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
      eligible
        ? "bg-emerald-100 text-emerald-600"
        : "bg-red-100 text-red-600"
    }`}
  >
    {eligible ? <FaCheckCircle /> : <FaTimesCircle />}
    {eligible ? "Eligible" : "Not Eligible"}
  </span>
);

const PriorityBadge = ({ level }) => {
  const map = {
    "High Chance": "bg-emerald-100 text-emerald-600",
    "Almost There": "bg-yellow-100 text-yellow-600",
    "Not Ready": "bg-red-100 text-red-600",
  };

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${map[level]}`}
    >
      {level}
    </span>
  );
};
