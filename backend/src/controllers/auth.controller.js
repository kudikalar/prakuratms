import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* ================= TOKEN ================= */

const signToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

/* ================= LOGIN ================= */

const loginByRole = async (req, res, role) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email,
      role,
      isActive: true,
    }).select("+password");

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: signToken(user),
      user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
};

export const adminLogin = (req, res) => loginByRole(req, res, "ADMIN");
export const educatorLogin = (req, res) => loginByRole(req, res, "EDUCATOR");
export const studentLogin = (req, res) => loginByRole(req, res, "STUDENT");

/* ================= CREATE USERS ================= */

const createUserByRole = async (req, res, role) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (await User.findOne({ email })) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 12),
      role,
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
};

export const createAdmin = (req, res) =>
  createUserByRole(req, res, "ADMIN");
export const createEducator = (req, res) =>
  createUserByRole(req, res, "EDUCATOR");
export const createStudent = (req, res) =>
  createUserByRole(req, res, "STUDENT");

/* ================= ADMIN MANAGEMENT ================= */

export const getAllUsers = async (req, res) => {
  const { role } = req.query;
  const users = await User.find(role ? { role } : {}).select("-password");

  res.json({
    success: true,
    message: "Users fetched successfully",
    users,
  });
};

export const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.json({
    success: true,
    message: "User fetched successfully",
    user,
  });
};

export const updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.json({
    success: true,
    message: "User updated successfully",
    user,
  });
};

export const toggleUserStatus = async (req, res) => {
  const { isActive } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.json({
    success: true,
    message: `User ${isActive ? "activated" : "deactivated"} successfully`,
  });
};


/* ================= CREATE COURSE ================= */
export const createCourse = async (req, res) => {
  try {
    const { title, category } = req.body;

    if (!title || !category) {
      return res.status(400).json({
        success: false,
        message: "Title and category are required",
      });
    }

    const course = await Course.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to create course",
    });
  }
};

/* ================= UPDATE COURSE ================= */
export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to update course",
    });
  }
};
