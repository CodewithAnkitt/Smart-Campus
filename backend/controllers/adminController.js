
const Complaint = require("../models/Complaint");
const User = require("../models/User");
const Feedback = require("../models/Feedback");

// GET /api/admin/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const [
      totalComplaints,
      resolvedComplaints,
      pendingComplaints,
      inProgressComplaints,
      totalUsers,
      statusCounts,
      categoryCounts,
      recentComplaints,
      recentUsers,
      recentFeedback,
    ] = await Promise.all([
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: "Resolved" }),
      Complaint.countDocuments({ status: "Pending" }),
      Complaint.countDocuments({ status: "In Progress" }),

      User.countDocuments({ role: { $in: ["student", "faculty"] } }),

      Complaint.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),

      Complaint.aggregate([
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ]),

      Complaint.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("submittedBy", "name email role")
        .lean(),

      User.find({ role: { $in: ["student", "faculty"] } })
        .select("name email role createdAt")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),

      Feedback.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("user", "name email role")
        .lean(),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalComplaints,
        resolvedComplaints,
        pendingComplaints,
        inProgressComplaints,
        totalUsers,
      },
      statusCounts,
      categoryCounts,
      recentComplaints,
      recentUsers,
      recentFeedback,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load admin dashboard data.",
    });
  }
};
