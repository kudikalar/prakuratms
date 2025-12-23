import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../src/models/User.js";
import users from "../test-data/users.json" assert { type: "json" };
import bcrypt from "bcryptjs";

dotenv.config();
await mongoose.connect(process.env.MONGO_URI);

for (const user of users) {
  user.password = await bcrypt.hash(user.password, 10);
  await User.create(user);
}

console.log("✅ Test users inserted");
process.exit();