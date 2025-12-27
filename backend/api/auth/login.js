import bcrypt from "bcryptjs";
import connectDB from "../../lib/db.js";
import User from "../../models/User.js";
import { signToken } from "../../lib/auth.js";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST")
      return res.status(405).json({ message: "Method not allowed" });

    await connectDB();

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email, isActive: true });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken({
      id: user._id,
      role: user.role
    });

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
