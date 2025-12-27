import { useEffect, useMemo, useState } from "react";
import {
  FaUserGraduate,
  FaBuilding,
  FaRupeeSign,
  FaBriefcase,
  FaSearch,
} from "react-icons/fa";

/* =====================================================
   STUDENT DIRECTORY – ENTERPRISE MASKED VIEW
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
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow border">
        <h2 className="text-2xl font-semibold text-slate-800">
          Student Directory
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Peer achievements and placement outcomes (privacy protected)
        </p>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white/70 rounded-2xl p-4 shadow border flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border">
          <FaSearch className="text-slate-400" />
          <input
            placeholder="Search name, course, company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="outline-none text-sm"
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

      {/* LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((s) => (
          <StudentCard key={s.id} student={s} />
        ))}
      </div>

      {!filteredStudents.length && (
        <p className="text-center text-sm text-slate-400">
          No matching students found
        </p>
      )}
    </div>
  );
}

/* =====================================================
   COMPONENTS
===================================================== */

const StudentCard = ({ student }) => (
  <div className="bg-white/70 rounded-2xl p-6 shadow border space-y-3">
    {/* BASIC INFO */}
    <div>
      <h3 className="font-semibold text-slate-800 flex items-center gap-2">
        <FaUserGraduate />
        {student.name}
      </h3>
      <p className="text-sm text-slate-500">
        {student.course} • {student.batch}
      </p>
    </div>

    {/* MASKED CONTACT */}
    <div className="text-sm text-slate-600">
      <p>Email: {maskEmail(student.email)}</p>
      <p>Mobile: {maskMobile(student.mobile)}</p>
    </div>

    {/* PLACEMENT */}
    {student.placed ? (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 space-y-1">
        <p className="text-sm font-semibold text-emerald-700 flex items-center gap-1">
          <FaBuilding /> {student.company}
        </p>
        <p className="text-xs text-slate-700">
          Role: {student.role}
        </p>
        <p className="text-xs text-slate-700 flex items-center gap-1">
          <FaBriefcase /> {student.experience}
        </p>
        <p className="text-xs text-slate-700 flex items-center gap-1">
          <FaRupeeSign /> {student.package}
        </p>
      </div>
    ) : (
      <span className="inline-block text-xs px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 font-semibold">
        Placement In Progress
      </span>
    )}
  </div>
);

const Select = ({ value, onChange, options }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="px-3 py-2 rounded-xl border bg-white text-sm"
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
