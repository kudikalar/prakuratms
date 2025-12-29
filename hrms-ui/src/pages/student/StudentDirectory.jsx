import { useEffect, useMemo, useState } from "react";
import {
  FaUserGraduate,
  FaBuilding,
  FaRupeeSign,
  FaBriefcase,
  FaSearch,
} from "react-icons/fa";

/* =====================================================
   STUDENT DIRECTORY – ENTERPRISE REFINED UI (NO REMOVALS)
===================================================== */

export default function StudentDirectory() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [batchFilter, setBatchFilter] = useState("All");
  const [placementFilter, setPlacementFilter] = useState("All");

  /* ================= INIT ================= */

  useEffect(() => {
    setStudents([
      {
        id: 1,
        name: "Ramesh Kumar",
        email: "ramesh@gmail.com",
        mobile: "9876543245",
        course: "QA Automation",
        batch: "Jan 2025",
        placed: true,
        company: "TCS",
        role: "QA Engineer",
        experience: "Fresher",
        package: "3.5 LPA",
      },
      {
        id: 2,
        name: "Anitha R",
        email: "anitha@yahoo.com",
        mobile: "9123456789",
        course: "Manual Testing",
        batch: "Dec 2024",
        placed: true,
        company: "Infosys",
        role: "Test Analyst",
        experience: "1.5 Years",
        package: "5.2 LPA",
      },
      {
        id: 3,
        name: "Suresh M",
        email: "suresh@hotmail.com",
        mobile: "9012345678",
        course: "Full Stack QA",
        batch: "Jan 2025",
        placed: false,
      },
    ]);
  }, []);

  /* ================= DERIVED DATA ================= */

  const courses = useMemo(
    () => ["All", ...new Set(students.map((s) => s.course))],
    [students]
  );

  const batches = useMemo(
    () => ["All", ...new Set(students.map((s) => s.batch))],
    [students]
  );

  const filteredStudents = useMemo(() => {
    return students
      .filter((s) => {
        const matchSearch =
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.course.toLowerCase().includes(search.toLowerCase()) ||
          (s.company || "").toLowerCase().includes(search.toLowerCase());

        const matchCourse =
          courseFilter === "All" || s.course === courseFilter;

        const matchBatch =
          batchFilter === "All" || s.batch === batchFilter;

        const matchPlacement =
          placementFilter === "All" ||
          (placementFilter === "Placed" && s.placed) ||
          (placementFilter === "In Progress" && !s.placed);

        return matchSearch && matchCourse && matchBatch && matchPlacement;
      })
      .sort((a, b) => Number(b.placed) - Number(a.placed));
  }, [students, search, courseFilter, batchFilter, placementFilter]);

  /* ================= UI ================= */

  return (
    <div className="space-y-8 animate-fadeIn">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-purple-600/70 to-indigo-600/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-purple-200/40">
        <h2 className="text-2xl font-bold text-white tracking-wide flex items-center gap-2">
          <FaUserGraduate className="opacity-80" />
          Student Directory
        </h2>
        <p className="text-sm text-purple-100 mt-1">
          Peer achievements and placement outcomes (privacy protected)
        </p>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 shadow border flex flex-wrap gap-4 items-center">

        {/* SEARCH INPUT */}
        <div className="flex items-center gap-2 px-4 py-2 bg-white/90 rounded-xl border shadow-sm hover:shadow transition">
          <FaSearch className="text-slate-400" />
          <input
            placeholder="Search name, course, company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="outline-none text-sm bg-transparent"
          />
        </div>

        <Select value={courseFilter} onChange={setCourseFilter} options={courses} />
        <Select value={batchFilter} onChange={setBatchFilter} options={batches} />
        <Select
          value={placementFilter}
          onChange={setPlacementFilter}
          options={["All", "Placed", "In Progress"]}
        />
      </div>

      {/* STUDENTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((s) => (
          <StudentCard key={s.id} student={s} />
        ))}
      </div>

      {!filteredStudents.length && (
        <p className="text-center text-sm text-slate-400 mt-4">
          No matching students found
        </p>
      )}
    </div>
  );
}

/* =====================================================
   COMPONENTS (IMPROVED UI)
===================================================== */

const StudentCard = ({ student }) => (
  <div className="bg-white/80 rounded-2xl p-6 shadow-lg border hover:shadow-xl transition-all cursor-pointer space-y-4">

    {/* BASIC INFO */}
    <div>
      <h3 className="font-semibold text-slate-800 flex items-center gap-2 text-lg">
        <FaUserGraduate className="text-purple-600" />
        {student.name}
      </h3>
      <p className="text-sm text-slate-500">
        {student.course} • {student.batch}
      </p>
    </div>

    {/* MASKED CONTACT */}
    <div className="text-sm text-slate-600 space-y-1">
      <p><strong>Email:</strong> {maskEmail(student.email)}</p>
      <p><strong>Mobile:</strong> {maskMobile(student.mobile)}</p>
    </div>

    {/* PLACEMENT STATUS */}
    {student.placed ? (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 shadow-sm space-y-1">
        <p className="text-sm font-semibold text-emerald-700 flex items-center gap-1">
          <FaBuilding /> {student.company}
        </p>
        <p className="text-xs text-slate-700">Role: {student.role}</p>
        <p className="text-xs text-slate-700 flex items-center gap-1">
          <FaBriefcase /> {student.experience}
        </p>
        <p className="text-xs text-slate-700 flex items-center gap-1">
          <FaRupeeSign /> {student.package}
        </p>
      </div>
    ) : (
      <span className="inline-block text-xs px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 font-semibold shadow-sm">
        Placement In Progress
      </span>
    )}
  </div>
);

const Select = ({ value, onChange, options }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="px-4 py-2 rounded-xl border shadow-sm hover:shadow transition bg-white/90 text-sm"
  >
    {options.map((o) => (
      <option key={o} value={o}>
        {o}
      </option>
    ))}
  </select>
);

/* =====================================================
   MASK HELPERS
===================================================== */

const maskEmail = (email = "") => {
  const [name, domain] = email.split("@");
  if (!name || !domain) return "****";
  return `${name.slice(0, 2)}****@${domain}`;
};

const maskMobile = (mobile = "") => {
  if (mobile.length < 6) return "******";
  return `${mobile.slice(0, 2)}****${mobile.slice(-2)}`;
};
