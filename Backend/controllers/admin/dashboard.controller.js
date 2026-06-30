import User from "../../models/User.js";
import Recipe from "../../models/Recipe.js";
import Comment from "../../models/Comment.js";
import Category from "../../models/Category.js";

// @desc    Get complete admin dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getAdminDashboardStats = async (req, res) => {
    try {
        const [
            totalUsers,
            totalRecipes,
            totalComments,
            totalCategories
        ] = await Promise.all([
            User.countDocuments(),
            Recipe.countDocuments(),
            Comment.countDocuments(),
            Category.countDocuments()
        ]);

        // Aggregate advanced metrics
        const recipeStats = await Recipe.aggregate([
            {
                $group: {
                    _id: null,
                    totalLikes: { $sum: "$likesCount" },
                    totalBookmarks: { $sum: "$savesCount" }
                }
            }
        ]);

        const stats = {
            totalUsers,
            totalRecipes,
            totalComments,
            totalCategories,
            totalLikes: recipeStats[0]?.totalLikes || 0,
            totalBookmarks: recipeStats[0]?.totalBookmarks || 0
        };

        res.status(200).json({ success: true, data: stats });
    } catch (error) {
        console.error("Admin dashboard stats error:", error);
        res.status(500).json({ success: false, message: "Server error fetching stats" });
    }
};
