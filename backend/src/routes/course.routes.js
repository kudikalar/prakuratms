import express from "express";
import {
  createCourse,
  getAllCourses,
  updateCourse,
  deleteCourse,
} from "../controllers/course.controller.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ================= ADMIN COURSES ================= */

router.post(
  "/",
  protect,
  authorize("ADMIN"),
  createCourse
);

router.get(
  "/",
  protect,
  authorize("ADMIN"),
  getAllCourses
);

router.put(
  "/:id",
  protect,
  authorize("ADMIN"),
  updateCourse
);

router.delete(
  "/:id",
  protect,
  authorize("ADMIN"),
  deleteCourse
);

export default router;
