import Recipe from "../models/Recipe.js";
import Comment from "../models/Comment.js";

// @desc    Get dashboard metrics
// @route   GET /api/dashboard
// @access  Private
export const getDashboardMetrics = async (req, res) => {
    try {
        const userId = req.user._id;

        // Count user's recipes
        const totalRecipes = await Recipe.countDocuments({ author: userId });

        // Aggregate total likes and bookmarks across user's recipes
        const stats = await Recipe.aggregate([
            { $match: { author: userId } },
            {
                $group: {
                    _id: null,
                    totalLikes: { $sum: "$likesCount" },
                    totalBookmarks: { $sum: "$savesCount" },
                    totalComments: { $sum: "$commentsCount" }
                }
            }
        ]);

        const totals = stats.length > 0 ? stats[0] : { totalLikes: 0, totalBookmarks: 0, totalComments: 0 };

        // Get recent recipes
        const recentRecipes = await Recipe.find({ author: userId })
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            success: true,
            data: {
                totalRecipes,
                totalLikes: totals.totalLikes || 0,
                totalBookmarks: totals.totalBookmarks || 0,
                totalComments: totals.totalComments || 0,
                recentRecipes
            }
        });
    } catch (error) {
        console.error("Dashboard error:", error);
        res.status(500).json({ success: false, message: "Server error fetching dashboard metrics" });
    }
};
