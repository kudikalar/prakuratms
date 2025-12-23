import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import ConfirmModal from "../../../components/ConfirmModal";
import Toast from "../../../components/Toast";

export default function AllCourses() {
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [toast, setToast] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("courses")) || [];
    setCourses(stored);
  }, []);

  const confirmDelete = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const deleteCourse = () => {
    const updated = courses.filter((c) => c.id !== selectedId);
    setCourses(updated);
    localStorage.setItem("courses", JSON.stringify(updated));

    setToast("Course deleted successfully");
    setShowModal(false);
    setSelectedId(null);

    setTimeout(() => setToast(""), 3000);
  };

  return (
    <div className="space-y-8 text-gray-800">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">All Courses</h2>
          <p className="text-sm text-gray-600">
            Manage and organize training programs
          </p>
        </div>

        <NavLink
          to="/admin/courses/add"
          className="flex items-center gap-2 px-5 py-2.5 rounded-full
            bg-purple-600 hover:bg-purple-700
            text-white font-semibold shadow-lg"
        >
          <FaPlus /> Add Course
        </NavLink>
      </div>

      {/* COURSE LIST */}
      <div className="grid grid-cols-1 gap-6">
        {courses.map((course) => (
          <GlassCard key={course.id}>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{course.title}</h3>
                <p className="text-sm text-gray-600">
                  {course.category} · {course.duration}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() =>
                    navigate(`/admin/courses/add?id=${course.id}`)
                  }
                  className="p-2 rounded-full bg-blue-100 text-blue-600"
                >
                  <FaEdit />
                </button>

                <button
                  onClick={() => confirmDelete(course.id)}
                  className="p-2 rounded-full bg-red-100 text-red-600"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* MODAL */}
      <ConfirmModal
        open={showModal}
        title="Delete Course"
        message="Are you sure you want to delete this course?"
        onCancel={() => setShowModal(false)}
        onConfirm={deleteCourse}
      />

      {/* TOAST */}
      <Toast show={!!toast} message={toast} onClose={() => setToast("")} />
    </div>
  );
}

const GlassCard = ({ children }) => (
  <div className="
    bg-white/40 backdrop-blur-[24px]
    border border-white/40
    rounded-3xl p-6
    shadow-[0_30px_90px_rgba(0,0,0,0.2)]
  ">
    {children}
  </div>
);
