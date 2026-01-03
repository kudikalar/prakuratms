import express from "express";
import { protect, authorize } from "../middleware/auth.middleware.js";
import { getStudentCourses } from "../controllers/enrollment.controller.js";

const router = express.Router();

router.get("/my-courses", protect, authorize("STUDENT"), getStudentCourses);

export default router;
