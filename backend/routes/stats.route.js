// routes/admin.js or routes/stats.js
const express = require("express");
const router = express.Router();
const {
  getAdminStats,
  getCustomerStats,
} = require("../controller/stats.controller");
const isLoggedIn = require("../middleware/isloggedin");
const isAdmin = require("../middleware/isadmin");

router.get("/adminstats", isLoggedIn, isAdmin, getAdminStats);
router.get("/customerstats", isLoggedIn, getCustomerStats);

module.exports = router;
