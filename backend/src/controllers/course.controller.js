import Course from "../models/Course.js";
import mongoose from "mongoose";

/* ================= CREATE COURSE ================= */
export const createCourse = async (req, res) => {
  try {
    let {
      title,
      category,
      duration,
      level,
      mode,
      price,
      description,
      startDate,
      endDate,
    } = req.body;

    if (!title || !category || !duration) {
      return res.status(400).json({
        success: false,
        message: "Title, category, and duration are required",
      });
    }

    // ✅ Normalize empty values
    level = level?.trim() || "Beginner";
    mode = mode?.trim() || "Online";
    price = price === "" || price == null ? 0 : Number(price);

    const course = await Course.create({
      title,
      category,
      description,
      duration,
      level,
      mode,
      price,
      startDate,
      endDate,
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (err) {
    console.error("CREATE COURSE ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to create course",
    });
  }
};


/* ================= GET ALL COURSES ================= */
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true }).sort({
      createdAt: -1,
    });

    return res.json({
      success: true,
      courses,
    });
  } catch (err) {
    console.error("GET COURSES ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
    });
  }
};

/* ================= UPDATE COURSE ================= */
export const updateCourse = async (req, res) => {
  try {
    const updates = {};

    const fields = [
      "title",
      "category",
      "description",
      "duration",
      "level",
      "mode",
      "price",
      "startDate",
      "endDate",
      "isActive",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined && req.body[field] !== "") {
        updates[field] =
          field === "price" ? Number(req.body[field]) : req.body[field];
      }
    });

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.json({
      success: true,
      message: "Course updated successfully",
      course,
    });
  } catch (err) {
    console.error("UPDATE COURSE ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to update course",
    });
  }
};


/* ================= DELETE COURSE (SOFT DELETE – FIXED) ================= */
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const course = await Course.findOneAndUpdate(
      { _id: id, isActive: true },
      { isActive: false },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found or already deleted",
      });
    }

    return res.json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (err) {
    console.error("DELETE COURSE ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to delete course",
    });
  }
};
