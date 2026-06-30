import Recipe from "../../models/Recipe.js";
import Activity from "../../models/Activity.js";

// @desc    Get all recipes for admin
// @route   GET /api/admin/recipes
// @access  Private/Admin
export const getAdminRecipes = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";
        
        const query = {};
        if (search) {
            query.title = { $regex: search, $options: "i" };
        }

        const recipes = await Recipe.find(query)
            .populate("author", "name email avatar")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Recipe.countDocuments(query);

        res.status(200).json({
            success: true,
            data: recipes,
            total,
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error fetching recipes" });
    }
};

// @desc    Delete a recipe
// @route   DELETE /api/admin/recipes/:id
// @access  Private/Admin
export const deleteRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ success: false, message: "Recipe not found" });
        }

        await recipe.deleteOne();

        await Activity.create({
            user: req.user._id,
            action: `Deleted recipe: ${recipe.title}`,
            entityType: "recipe",
            entityId: recipe._id
        });

        res.status(200).json({ success: true, message: "Recipe deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error deleting recipe" });
    }
};
