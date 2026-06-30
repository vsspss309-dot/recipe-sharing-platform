import express from "express";
import { getCreatorAnalytics, getTopRecipes } from "../controllers/analyticsController.js";
import { protect, restrictToTier } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply protection and tier restriction to all analytics routes
router.use(protect);
router.use(restrictToTier("Chef")); // Only Chefs get analytics

router.get("/dashboard", getCreatorAnalytics);
router.get("/top-recipes", getTopRecipes);

export default router;
