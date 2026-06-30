import express from "express";
import { addComment, getComments, deleteComment, editComment } from "../controllers/commentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:recipeId", protect, addComment);
router.get("/:recipeId", getComments);
router.put("/:commentId", protect, editComment);
router.delete("/:commentId", protect, deleteComment);

export default router;
