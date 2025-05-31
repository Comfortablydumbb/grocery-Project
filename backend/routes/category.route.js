const express = require("express");
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controller/category.controller");
const isLoggedIn = require("../middleware/isloggedin");
const isAdmin = require("../middleware/isadmin");
const uploader = require("../middleware/multer");
const router = express.Router();

// Admin-only routes:
router
  .route("/category")
  .post(isLoggedIn, isAdmin, uploader.array("images", 5), createCategory); // Allows up to 5 images

router.put(
  "/category/:id",
  isLoggedIn,
  isAdmin,
  uploader.array("images", 5),
  updateCategory
);

router.delete("/category/:id", isLoggedIn, isAdmin, deleteCategory);

// Public routes:
router.get("/categories", getAllCategories);
router.get("/category/:id", getCategoryById);

module.exports = router;
