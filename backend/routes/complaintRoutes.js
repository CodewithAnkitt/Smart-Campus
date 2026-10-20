
const express = require("express");
const Complaint = require("../models/Complaint");

const router = express.Router();

// Create a new complaint
router.post("/", async (req, res) => {
  try {
    const { title, description, category, location } = req.body;

    if (!title || !description || !category || !location) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
    }

    const complaint = await Complaint.create({
      title,
      description,
      category,
      location,
    });

    return res.status(201).json({
      success: true,
      message: "Complaint submitted successfully!",
      complaint,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Create complaint error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to submit complaint.",
    });
  }
});

// Get all complaints
router.get("/", async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error("Get complaints error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve complaints.",
    });
  }
});

module.exports = router;
