import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";

// Import admin controllers
import { getAdminDashboardStats } from "../controllers/admin/dashboard.controller.js";
import { getUsers, deleteUser } from "../controllers/admin/user.controller.js";
import { getAdminRecipes, deleteRecipe } from "../controllers/admin/recipe.controller.js";
import { getReports, updateReportStatus } from "../controllers/admin/report.controller.js";
import { getAdminComments, adminDeleteComment } from "../controllers/admin/comment.controller.js";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../controllers/admin/category.controller.js";

const router = express.Router();

// Apply middleware to all routes in this file
router.use(protect);
router.use(authorize("admin"));

// Dashboard
router.get("/dashboard", getAdminDashboardStats);

// Users
router.get("/users", getUsers);
router.delete("/users/:id", deleteUser);

// Recipes
router.get("/recipes", getAdminRecipes);
router.delete("/recipes/:id", deleteRecipe);

// Comments
router.get("/comments", getAdminComments);
router.delete("/comments/:id", adminDeleteComment);

// Reports
router.get("/reports", getReports);
router.put("/reports/:id", updateReportStatus);

// Categories
router.get("/categories", getCategories);
router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

export default router;
