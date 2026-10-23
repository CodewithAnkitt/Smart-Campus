
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Complaint = require("../models/Complaint");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

// GET: Students/faculty see their own complaints; admin sees all
router.get("/", async (req, res) => {
  try {
    const filter =
      req.user.role === "admin"
        ? {}
        : { submittedBy: req.user.userId };

    const complaints = await Complaint.find(filter)
      .populate("submittedBy", "name email role")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error("Get complaints error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load complaints.",
    });
  }
});

// POST: Submit a complaint
router.post("/", async (req, res) => {
  try {
    const { title, description, category, location } = req.body || {};

    if (
      !title?.trim() ||
      !description?.trim() ||
      !category ||
      !location?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Title, description, category, and location are required.",
      });
    }

    const allowedCategories = [
      "Electricity",
      "Water",
      "Cleanliness",
      "Internet",
      "Classroom",
      "Faculty",
    ];

    if (!allowedCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint category.",
      });
    }

    const complaint = await Complaint.create({
      title: title.trim(),
      description: description.trim(),
      category,
      location: location.trim(),
      submittedBy: req.user.userId,
    });

    return res.status(201).json({
      success: true,
      message: "Complaint submitted successfully.",
      complaint,
    });
  } catch (error) {
    console.error("Submit complaint error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to submit complaint.",
    });
  }
});

// PATCH: Admin updates complaint status
router.patch("/:id/status", async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only administrators can update complaint status.",
      });
    }

    const { id } = req.params;
    const { status } = req.body || {};

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint ID.",
      });
    }

    const allowedStatuses = ["Pending", "In Progress", "Resolved"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint status.",
      });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true, runValidators: true }
    ).populate("submittedBy", "name email role");

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Complaint status updated successfully.",
      complaint,
    });
  } catch (error) {
    console.error("Update complaint status error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update complaint status.",
    });
  }
});

// DELETE: Only the owner can delete their own pending complaint
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint ID.",
      });
    }

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    if (
      !complaint.submittedBy ||
      complaint.submittedBy.toString() !== req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "You cannot delete this complaint.",
      });
    }

    if (complaint.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending complaints can be deleted.",
      });
    }

    await complaint.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Complaint deleted successfully.",
    });
  } catch (error) {
    console.error("Delete complaint error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to delete complaint.",
    });
  }
});

module.exports = router;
