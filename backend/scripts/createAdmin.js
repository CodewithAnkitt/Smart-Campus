
require("dotenv").config({
  path: require("path").join(__dirname, "..", ".env"),
});

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

async function createAdmin() {
  try {
    const name = process.env.ADMIN_NAME;
    const email = process.env.ADMIN_EMAIL;
    const phone = process.env.ADMIN_PHONE;
    const password = process.env.ADMIN_PASSWORD;

    if (!name || !email || !phone || !password) {
      throw new Error(
        "Admin details missing. Check your backend/.env file."
      );
    }

    if (password.length < 12) {
      throw new Error(
        "Admin password must contain at least 12 characters."
      );
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingUser) {
      if (existingUser.role === "admin") {
        console.log("Admin account already exists.");
        console.log(`Admin email: ${existingUser.email}`);
        return;
      }

      throw new Error(
        "This email already belongs to a non-admin user. Choose a different ADMIN_EMAIL."
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      name,
      email: email.toLowerCase().trim(),
      phone,
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin account created successfully.");
    console.log(`Admin email: ${email}`);
  } catch (error) {
    console.error("Admin creation failed:", error.message);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
}

createAdmin();
