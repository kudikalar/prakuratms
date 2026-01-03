import express from "express";
import cors from "cors";
import dotenv from "dotenv";

/* ================= ROUTES ================= */
import authRoutes from "./routes/auth.routes.js";
import courseRoutes from "./routes/course.routes.js";
import studentRoutes from "./routes/student.routes.js";


/* ================= LOAD ENV ================= */
dotenv.config();

/* ================= APP INIT ================= */
const app = express();

/* ================= MIDDLEWARE ================= */
app.use(
  cors({
    origin: "*", // 🔐 restrict in production
    credentials: true,
  })
);

/* ✅ BODY PARSERS */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* ================= HEALTH CHECK ================= */
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    jwtLoaded: Boolean(process.env.JWT_SECRET),
    env: process.env.NODE_ENV || "development",
  });
});
app.use("/api/student", studentRoutes);

/* ================= ROUTE MOUNTING ================= */

/* 🔐 AUTH */
app.use("/api/auth", authRoutes);

/* 📚 COURSES (ADMIN / STUDENT) */
app.use("/api/courses", courseRoutes);

/* ================= 404 HANDLER ================= */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    path: req.originalUrl,
    message: "API endpoint not found",
  });
});

/* ================= GLOBAL ERROR HANDLER ================= */
app.use((err, req, res, next) => {
  console.error("🔥 UNHANDLED ERROR:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

export default app;
