import Enrollment from "../models/Enrollment.js";

export const enrollStudent = async (req, res) => {
  const enrollment = await Enrollment.create(req.body);

  res.status(201).json({
    success: true,
    message: "Student enrolled successfully",
    enrollment,
  });
};

export const getStudentCourses = async (req, res) => {
  const data = await Enrollment.find({
    studentId: req.user.id,
  }).populate({
    path: "batchId",
    populate: { path: "courseId" },
  });

  res.json({ success: true, courses: data });
};
