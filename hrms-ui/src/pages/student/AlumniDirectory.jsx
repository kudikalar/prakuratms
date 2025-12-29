import { useEffect, useState, useMemo } from "react";
import {
  FaUserGraduate,
  FaBuilding,
  FaBriefcase,
  FaRupeeSign,
  FaMapMarkerAlt,
  FaSearch,
  FaSortAmountDown,
  FaChartLine,
} from "react-icons/fa";

/* =====================================================
   ALUMNI DIRECTORY – SMART PLACEMENT VIEW (STUDENT)
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
        company: "Product Startup",
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

  const stats = useMemo(() => {
    if (!alumni.length) return { avgExp: 0, avgPkg: 0 };
    return {
      avgExp: (
        alumni.reduce((s, a) => s + a.experience, 0) / alumni.length
      ).toFixed(1),
      avgPkg: (
        alumni.reduce((s, a) => s + a.package, 0) / alumni.length
      ).toFixed(1),
    };
  }, [alumni]);

  const filtered = useMemo(() => {
    return alumni
      .filter((a) =>
        `${a.name} ${a.company} ${a.role} ${a.course}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
      .filter((a) =>
        courseFilter === "All" ? true : a.course === courseFilter
      )
      .filter((a) =>
        locationFilter === "All" ? true : a.location === locationFilter
      )
      .sort((a, b) => {
        if (sortBy === "experience") return b.experience - a.experience;
        if (sortBy === "package") return b.package - a.package;
        return a.name.localeCompare(b.name);
      });
  }, [alumni, search, courseFilter, locationFilter, sortBy]);

  /* ================= UI ================= */

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* HEADER */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow border">
        <h2 className="text-2xl font-semibold text-slate-800">
          Alumni Directory
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Explore real placement outcomes and career growth
        </p>
      </div>

      {/* INSIGHTS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Insight label="Alumni Listed" value={filtered.length} />
        <Insight label="Avg Experience" value={`${stats.avgExp} yrs`} />
        <Insight label="Avg Package" value={`${stats.avgPkg} LPA`} highlight />
      </div>

      {/* CONTROLS */}
      <div className="sticky top-4 z-10 bg-white/70 backdrop-blur-xl rounded-3xl p-5 shadow border grid grid-cols-1 md:grid-cols-4 gap-4">
        <Search value={search} onChange={setSearch} />

        <Select label="Course" value={courseFilter} onChange={setCourseFilter} options={courses} />
        <Select label="Location" value={locationFilter} onChange={setLocationFilter} options={locations} />

        <button
          onClick={() =>
            setSortBy((s) =>
              s === "experience"
                ? "package"
                : s === "package"
                ? "name"
                : "experience"
            )
          }
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-2xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
        >
          <FaSortAmountDown />
          Sort: {sortBy}
        </button>
      </div>

      {/* ALUMNI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((a) => (
          <AlumniCard key={a.id} alumni={a} />
        ))}
      </div>

      {!filtered.length && (
        <p className="text-center text-sm text-slate-400">
          No alumni match your criteria
        </p>
      )}
    </div>
  );
}

/* =====================================================
   COMPONENTS
===================================================== */

const Insight = ({ label, value, highlight }) => (
  <div className="bg-white/70 rounded-2xl p-5 shadow border">
    <p className="text-sm text-slate-500 flex items-center gap-2">
      <FaChartLine /> {label}
    </p>
    <h3 className={`text-2xl font-bold ${highlight ? "text-indigo-600" : "text-slate-800"}`}>
      {value}
    </h3>
  </div>
);

const AlumniCard = ({ alumni }) => {
  const badges = [];
  if (alumni.package >= 6 && alumni.experience <= 3) badges.push("Fast Growth");
  if (alumni.experience >= 5) badges.push("Senior Track");
  if (alumni.location === "Remote") badges.push("Remote Ready");

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow border hover:shadow-xl transition">
      <h3 className="font-semibold text-slate-800 flex items-center gap-2">
        <FaUserGraduate className="text-indigo-600" />
        {alumni.name}
      </h3>
      <p className="text-sm text-slate-500">{alumni.batch}</p>

      <div className="mt-3 space-y-1 text-sm text-slate-700">
        <p className="flex items-center gap-2"><FaBuilding /> {alumni.company}</p>
        <p className="flex items-center gap-2"><FaBriefcase /> {alumni.role} • {alumni.experience} yrs</p>
        <p className="flex items-center gap-2"><FaRupeeSign /> {alumni.package} LPA</p>
        <p className="flex items-center gap-2"><FaMapMarkerAlt /> {alumni.location}</p>
      </div>

      {badges.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {badges.map((b) => (
            <span key={b} className="px-3 py-1 text-xs rounded-full bg-indigo-100 text-indigo-700">
              {b}
            </span>
          ))}
        </div>
      )}
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
      placeholder="Search name, company, role, course..."
      className="w-full pl-11 pr-4 py-2.5 rounded-2xl border bg-white/80 focus:ring-2 focus:ring-indigo-400 outline-none"
    />
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div>
    <label className="text-xs font-medium text-slate-500">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full mt-1 px-4 py-2.5 rounded-2xl border bg-white/80 focus:ring-2 focus:ring-indigo-400 outline-none"
    >
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  </div>
);
