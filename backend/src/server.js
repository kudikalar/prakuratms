import app from "./app.js";
import mongoose from "mongoose";

/* ================= LOAD ENV ================= */
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

/* ================= DB CONNECT ================= */
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err.message);
    process.exit(1);
  });

/* ================= START SERVER ================= */
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

/* ================= PORT ERROR HANDLING ================= */
server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} is already in use`);
    console.error("👉 Stop the other server or change PORT in .env");
    process.exit(1);
  } else {
    console.error("❌ Server error:", error);
  }
});

/* ================= GRACEFUL SHUTDOWN ================= */
const shutdown = (signal) => {
  console.log(`🛑 Received ${signal}. Shutting down gracefully...`);

  server.close(() => {
    console.log("✅ HTTP server closed");

    mongoose.connection.close(false, () => {
      console.log("✅ MongoDB connection closed");
      process.exit(0);
    });
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
