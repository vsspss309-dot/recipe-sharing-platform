import express from "express";
import { toggleFollow, getUserProfile, getNotifications, markNotificationRead, getSavedRecipes, updateProfile } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/saved", protect, getSavedRecipes);
router.put("/profile", protect, updateProfile);
router.get("/notifications", protect, getNotifications);
router.put("/notifications/:id/read", protect, markNotificationRead);
router.get("/:id", getUserProfile);
router.post("/:id/follow", protect, toggleFollow);

export default router;
