import Comment from "../models/Comment.js";
import Recipe from "../models/Recipe.js";
import { getIO } from "../socket/socket.js";
import { sendRealTimeNotification } from "../socket/notification.socket.js";

// @desc    Add a comment to a recipe
// @route   POST /api/comments/:recipeId
// @access  Private
export const addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const recipeId = req.params.recipeId;

        if (!text) {
            return res.status(400).json({ success: false, message: "Comment text is required" });
        }

        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ success: false, message: "Recipe not found" });
        }

        const comment = await Comment.create({
            text,
            author: req.user._id,
            recipe: recipeId
        });

        // Increment commentsCount
        recipe.commentsCount = (recipe.commentsCount || 0) + 1;
        await recipe.save();

        // Trigger Notification
        if (recipe.author.toString() !== req.user._id.toString()) {
            const Notification = (await import("../models/Notification.js")).default;
            const notification = await Notification.create({
                recipient: recipe.author,
                sender: req.user._id,
                type: "comment",
                message: `${req.user.name} commented on your recipe: ${recipe.title}`,
                relatedRecipe: recipe._id
            });
            
            // Emit over Socket.io
            sendRealTimeNotification(getIO(), recipe.author.toString(), notification);
        }

        const populatedComment = await Comment.findById(comment._id).populate("author", "name avatar");

        res.status(201).json({ success: true, data: populatedComment });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error adding comment" });
    }
};

// @desc    Get comments for a recipe
// @route   GET /api/comments/:recipeId
// @access  Public
export const getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ recipe: req.params.recipeId })
            .populate("author", "name avatar")
            .sort({ createdAt: -1 }); // Newest first

        res.status(200).json({ success: true, data: comments });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error fetching comments" });
    }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:commentId
// @access  Private
export const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);

        if (!comment) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }

        // Only author or admin can delete
        if (comment.author.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Not authorized to delete this comment" });
        }

        const recipeId = comment.recipe;
        await comment.deleteOne();

        // Decrement commentsCount
        await Recipe.findByIdAndUpdate(recipeId, {
            $inc: { commentsCount: -1 }
        });

        res.status(200).json({ success: true, message: "Comment removed" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error deleting comment" });
    }
};

// @desc    Edit a comment
// @route   PUT /api/comments/:commentId
// @access  Private
export const editComment = async (req, res) => {
    try {
        const { text } = req.body;
        const comment = await Comment.findById(req.params.commentId);

        if (!comment) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }

        // Only author can edit
        if (comment.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Not authorized to edit this comment" });
        }

        if (!text || text.trim().length < 2) {
            return res.status(400).json({ success: false, message: "Comment must be at least 2 characters" });
        }

        comment.text = text;
        await comment.save();

        const updatedComment = await Comment.findById(comment._id).populate("author", "name avatar");

        res.status(200).json({ success: true, data: updatedComment });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error editing comment" });
    }
};
