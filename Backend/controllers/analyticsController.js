import Recipe from "../models/Recipe.js";

// @desc    Get aggregated analytics for a creator
// @route   GET /api/analytics/dashboard
// @access  Private (Chef)
export const getCreatorAnalytics = async (req, res) => {
    try {
        const recipes = await Recipe.find({ author: req.user._id });
        
        let totalViews = 0;
        let totalSaves = 0;
        let totalRating = 0;
        let ratedCount = 0;

        recipes.forEach(recipe => {
            totalViews += (recipe.viewsCount || 0);
            totalSaves += (recipe.savesCount || 0);
            if (recipe.ratingsCount > 0) {
                totalRating += (recipe.ratingsAverage * recipe.ratingsCount);
                ratedCount += recipe.ratingsCount;
            }
        });

        const averageRating = ratedCount > 0 ? (totalRating / ratedCount).toFixed(1) : 0;

        res.status(200).json({
            success: true,
            data: {
                totalRecipes: recipes.length,
                totalViews,
                totalSaves,
                averageRating: Number(averageRating)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get top performing recipes for a creator
// @route   GET /api/analytics/top-recipes
// @access  Private (Chef)
export const getTopRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find({ author: req.user._id })
            .sort({ viewsCount: -1 })
            .limit(10)
            .select("title viewsCount savesCount ratingsAverage ratingsCount image");

        res.status(200).json({ success: true, data: recipes });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
