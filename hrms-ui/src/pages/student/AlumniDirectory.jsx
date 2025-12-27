import { useEffect, useState, useMemo } from "react";
import {
  FaUserGraduate,
  FaBuilding,
  FaBriefcase,
  FaRupeeSign,
  FaMapMarkerAlt,
  FaSearch,
  FaSortAmountDown,
} from "react-icons/fa";

/* =====================================================
   ALUMNI DIRECTORY – ADVANCED (STUDENT VIEW)
===================================================== */

export default function AlumniDirectory() {
  const [alumni, setAlumni] = useState([]);
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [sortBy, setSortBy] = useState("experience");

  /* ================= INIT ================= */

  useEffect(() => {
    setAlumni([
      {
        id: 1,
        name: "Suresh Kumar",
        batch: "QA Automation – 2023",
        course: "QA Automation",
        company: "TCS",
        role: "QA Engineer",
        experience: 2,
        package: 4.5,
        location: "Bangalore",
      },
      {
        id: 2,
        name: "Anitha R",
        batch: "Manual Testing – 2022",
        course: "Manual Testing",
        company: "Infosys",
        role: "Test Analyst",
        experience: 3.5,
        package: 6.2,
        location: "Hyderabad",
      },
      {
        id: 3,
        name: "Prakash M",
        batch: "Full Stack QA – 2021",
        course: "Full Stack QA",
        company: "Startup (Product)",
        role: "Senior QA Engineer",
        experience: 5,
        package: 10,
        location: "Remote",
      },
    ]);
  }, []);

  /* ================= DERIVED ================= */

  const courses = ["All", ...new Set(alumni.map((a) => a.course))];
  const locations = ["All", ...new Set(alumni.map((a) => a.location))];

  const filtered = useMemo(() => {
    return alumni
      .filter((a) =>
        `${a.name} ${a.company} ${a.role}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
      .filter((a) =>
        courseFilter === "All" ? true : a.course === courseFilter
      )
      .filter((a) =>
        locationFilter === "All" ? true : a.location === locationFilter
      )
      .sort((a, b) =>
        sortBy === "experience"
          ? b.experience - a.experience
          : b.package - a.package
      );
  }, [alumni, search, courseFilter, locationFilter, sortBy]);

  /* ================= UI ================= */

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* HEADER */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/40">
        <h2 className="text-2xl font-semibold text-slate-800">
          Alumni Directory
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Explore alumni career growth, roles, and placement journeys
        </p>
      </div>

      {/* CONTROLS */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-5 shadow border border-white/40 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Search value={search} onChange={setSearch} />

        <Select
          label="Course"
          value={courseFilter}
          onChange={setCourseFilter}
          options={courses}
        />

        <Select
          label="Location"
          value={locationFilter}
          onChange={setLocationFilter}
          options={locations}
        />

        <button
          onClick={() =>
            setSortBy((s) =>
              s === "experience" ? "package" : "experience"
            )
          }
          className="
            flex items-center justify-center gap-2
            px-4 py-2 rounded-2xl
            bg-gradient-to-r from-indigo-600 to-purple-600
            text-white font-semibold
            hover:from-indigo-700 hover:to-purple-700
            shadow-md transition
          "
        >
          <FaSortAmountDown />
          Sort by {sortBy === "experience" ? "Package" : "Experience"}
        </button>
      </div>

      {/* ALUMNI LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((a) => (
          <AlumniCard key={a.id} alumni={a} />
        ))}
      </div>

      {!filtered.length && (
        <p className="text-center text-sm text-slate-400">
          No alumni found
        </p>
      )}
    </div>
  );
}

/* =====================================================
   COMPONENTS
===================================================== */

const AlumniCard = ({ alumni }) => {
  const level =
    alumni.experience >= 5
      ? "Senior"
      : alumni.experience >= 2
      ? "Mid"
      : "Junior";

  return (
    <div
      className="
        bg-white/70 backdrop-blur-xl
        rounded-3xl p-6
        shadow-md border border-white/40
        hover:shadow-xl
        transition-all duration-300
      "
    >
      {/* HEADER */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <FaUserGraduate className="text-indigo-600" />
            {alumni.name}
          </h3>
          <p className="text-sm text-slate-500">
            {alumni.batch}
          </p>
        </div>

        <span
          className="
            px-3 py-1 rounded-full text-xs font-semibold
            bg-indigo-100 text-indigo-700
          "
        >
          {level}
        </span>
      </div>

      {/* CAREER */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200/60 rounded-2xl p-4 space-y-2">
        <p className="text-sm font-semibold text-indigo-700 flex items-center gap-2">
          <FaBuilding /> {alumni.company}
        </p>

        <p className="text-xs text-slate-700 flex items-center gap-2">
          <FaBriefcase /> {alumni.role} • {alumni.experience} yrs
        </p>

        <p className="text-xs text-slate-700 flex items-center gap-2">
          <FaRupeeSign /> {alumni.package}+ LPA
        </p>

        <p className="text-xs text-slate-600 flex items-center gap-2">
          <FaMapMarkerAlt /> {alumni.location}
        </p>
      </div>
    </div>
  );
};

/* ================= SMALL UI ================= */

const Search = ({ value, onChange }) => (
  <div className="relative">
    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search alumni by name, company, role..."
      className="
        w-full pl-11 pr-4 py-2.5
        rounded-2xl border
        bg-white/80
        focus:ring-2 focus:ring-indigo-400
        outline-none transition
      "
    />
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div>
    <label className="text-xs font-medium text-slate-500">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="
        w-full mt-1 px-4 py-2.5
        rounded-2xl border
        bg-white/80
        focus:ring-2 focus:ring-indigo-400
        outline-none transition
      "
    >
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  </div>
);
