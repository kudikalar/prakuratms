🧪 TESTING (POSTMAN / CURL)
Admin Login
POST http://localhost:5000/api/auth/admin/login

Educator Login
POST http://localhost:5000/api/auth/educator/login

Student Login
POST http://localhost:5000/api/auth/student/login


Body (JSON):

{
  "email": "admin@prakura.com",
  "password": "Admin@123"
}

🎯 FRONTEND REDIRECT LOGIC
if (user.role === "ADMIN") navigate("/admin/dashboard");
if (user.role === "EDUCATOR") navigate("/educator/dashboard");
if (user.role === "STUDENT") navigate("/student/dashboard");