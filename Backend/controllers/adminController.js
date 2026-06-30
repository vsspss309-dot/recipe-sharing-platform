import User from "../models/User.js";
import Recipe from "../models/Recipe.js";
import Comment from "../models/Comment.js";

// @desc    Get system-wide stats for admin dashboard
// @route   GET /api/admin/stats
// @access  Private (Admin)
export const getSystemStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalRecipes = await Recipe.countDocuments();
        const totalComments = await Comment.countDocuments();
        
        // Count pro/chef tiers
        const premiumUsers = await User.countDocuments({ subscriptionTier: { $in: ["Pro", "Chef"] } });

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalRecipes,
                totalComments,
                premiumUsers
            }
        });
    } catch (error) {
        console.error("Admin stats error:", error);
        res.status(500).json({ success: false, message: "Server error fetching stats" });
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select("-password").sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error fetching users" });
    }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private (Admin)
export const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error updating user role" });
    }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // We are choosing NOT to cascade delete recipes to preserve data, but we could do it here.

        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error deleting user" });
    }
};

// @desc    Delete any recipe (Moderation)
// @route   DELETE /api/admin/recipes/:id
// @access  Private (Admin)
export const deleteAnyRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findByIdAndDelete(req.params.id);
        
        if (!recipe) {
            return res.status(404).json({ success: false, message: "Recipe not found" });
        }

        // Cleanup comments associated with the recipe
        await Comment.deleteMany({ recipe: recipe._id });

        res.status(200).json({ success: true, message: "Recipe deleted successfully (Moderated)" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error deleting recipe" });
    }
};
