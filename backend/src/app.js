import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";

/* 🆕 ADD THIS IMPORT */
import courseRoutes from "./routes/course.routes.js";

/* ================= LOAD ENV (MUST BE FIRST) ================= */
dotenv.config();

/* ================= APP INIT ================= */
const app = express();

/* ================= MIDDLEWARE ================= */
app.use(
  cors({
    origin: "*", // adjust later for prod
    credentials: true,
  })
);

/* 🔴 IMPORTANT: BODY PARSERS (THIS FIXES COURSE CREATE) */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* ================= HEALTH CHECK ================= */
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    jwtLoaded: !!process.env.JWT_SECRET,
  });
});

/* ================= ROUTES ================= */
app.use("/api/auth", authRoutes);

/* 🆕 COURSE ROUTES (THIS FIXES DELETE ISSUE) */
app.use("/api/auth", courseRoutes);

/* ================= 404 HANDLER ================= */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});

/* ================= GLOBAL ERROR HANDLER ================= */
app.use((err, req, res, next) => {
  console.error("🔥 UNHANDLED ERROR:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Server error",
  });
});

export default app;
