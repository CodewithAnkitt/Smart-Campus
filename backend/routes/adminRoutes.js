
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { getDashboard } = require("../controllers/adminController");

// Every endpoint in this router requires authentication.
router.use(authMiddleware);

// Only administrators can access dashboard data.
router.use((req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Administrator access required.",
    });
  }

  next();
});

router.get("/dashboard", getDashboard);

module.exports = router;
