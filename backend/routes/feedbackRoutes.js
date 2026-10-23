
const express = require("express");
const mongoose = require("mongoose");

const Feedback = require("../models/Feedback");
const Complaint = require("../models/Complaint");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Every feedback request requires a valid login.
router.use(authMiddleware);

// GET: Retrieve feedback belonging to the logged-in user.
router.get("/", async (req, res) => {
  try {
    const feedbacks = await Feedback.find({
      user: req.user.userId,
    })
      .populate("relatedComplaint", "title")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: feedbacks.length,
      feedbacks,
    });
  } catch (error) {
    console.error("Get feedback error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve feedback.",
    });
  }
});

// POST: Submit feedback for the logged-in user.
router.post("/", async (req, res) => {
  try {
    const {
      type,
      title,
      message,
      relatedComplaint,
    } = req.body || {};

    const allowedTypes = [
      "General Feedback",
      "Suggestion",
      "Appreciation",
      "Issue Report",
    ];

    if (!type || !title?.trim() || !message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Feedback type, subject, and message are required.",
      });
    }

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid feedback type.",
      });
    }

    if (title.trim().length < 3 || title.trim().length > 100) {
      return res.status(400).json({
        success: false,
        message: "Subject must contain 3–100 characters.",
      });
    }

    if (message.trim().length < 10 || message.trim().length > 500) {
      return res.status(400).json({
        success: false,
        message: "Feedback must contain 10–500 characters.",
      });
    }

    let complaintTitle = "";

    if (relatedComplaint) {
      if (!mongoose.Types.ObjectId.isValid(relatedComplaint)) {
        return res.status(400).json({
          success: false,
          message: "Invalid complaint ID.",
        });
      }

      const complaint = await Complaint.findById(relatedComplaint);

      if (!complaint) {
        return res.status(404).json({
          success: false,
          message: "Related complaint was not found.",
        });
      }

      // Students can link only their own complaints.
      if (
        req.user.role !== "faculty" &&
        String(complaint.submittedBy) !== String(req.user.userId)
      ) {
        return res.status(403).json({
          success: false,
          message: "You can only link your own complaints.",
        });
      }

      complaintTitle = complaint.title;
    }

    const feedback = await Feedback.create({
      user: req.user.userId,
      type,
      title: title.trim(),
      message: message.trim(),
      relatedComplaint: relatedComplaint || null,
      relatedComplaintTitle: complaintTitle,
    });

    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully.",
      feedback,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Submit feedback error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to submit feedback.",
    });
  }
});

module.exports = router;
