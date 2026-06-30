import express from "express";
import { getMealPlans, addMealPlan, deleteMealPlan, generateGroceryList } from "../controllers/mealPlannerController.js";
import { protect, restrictToTier } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply protection and tier restriction to all meal planner routes
router.use(protect);
router.use(restrictToTier("Pro", "Chef"));

router.route("/")
    .get(getMealPlans)
    .post(addMealPlan);

router.get("/grocery-list", generateGroceryList);

router.route("/:id")
    .delete(deleteMealPlan);

export default router;
