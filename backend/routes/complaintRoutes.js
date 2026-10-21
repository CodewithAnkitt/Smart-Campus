
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
// delete pending complaint
const mongoose = require("mongoose");

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid complaint ID",
      });
    }

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    const status = String(complaint.status || "Pending").trim().toLowerCase();

    if (status !== "pending") {
      return res.status(403).json({
        message: `This complaint is currently "${complaint.status}". Only Pending complaints can be deleted.`,
      });
    }

    await Complaint.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Complaint deleted successfully",
    });
  } catch (error) {
    console.error("Delete complaint error:", error);

    return res.status(500).json({
      message: "Server error while deleting complaint",
    });
  }
});

module.exports = router;
