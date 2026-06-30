import Comment from "../../models/Comment.js";
import Activity from "../../models/Activity.js";

// @desc    Get all comments
// @route   GET /api/admin/comments
// @access  Private/Admin
export const getAdminComments = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const comments = await Comment.find({})
            .populate("author", "name email avatar")
            .populate("recipe", "title")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Comment.countDocuments();

        res.status(200).json({
            success: true,
            data: comments,
            total,
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error fetching comments" });
    }
};

// @desc    Delete comment
// @route   DELETE /api/admin/comments/:id
// @access  Private/Admin
export const adminDeleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }

        await comment.deleteOne();

        await Activity.create({
            user: req.user._id,
            action: `Deleted a comment`,
            entityType: "comment",
            entityId: comment._id
        });

        res.status(200).json({ success: true, message: "Comment deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error deleting comment" });
    }
};
