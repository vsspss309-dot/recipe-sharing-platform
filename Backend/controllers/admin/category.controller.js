import Category from "../../models/Category.js";
import Activity from "../../models/Activity.js";

// @desc    Get all categories
// @route   GET /api/admin/categories
// @access  Private/Admin
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({}).sort({ name: 1 });
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error fetching categories" });
    }
};

// @desc    Create a category
// @route   POST /api/admin/categories
// @access  Private/Admin
export const createCategory = async (req, res) => {
    try {
        const { name, icon, color, description, status } = req.body;
        
        const categoryExists = await Category.findOne({ name });
        if (categoryExists) {
            return res.status(400).json({ success: false, message: "Category already exists" });
        }

        const category = await Category.create({ name, icon, color, description, status });

        await Activity.create({
            user: req.user._id,
            action: `Created category: ${name}`,
            entityType: "category",
            entityId: category._id
        });

        res.status(201).json({ success: true, data: category });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error creating category" });
    }
};

// @desc    Update a category
// @route   PUT /api/admin/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        await Activity.create({
            user: req.user._id,
            action: `Updated category: ${category.name}`,
            entityType: "category",
            entityId: category._id
        });

        res.status(200).json({ success: true, data: category });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error updating category" });
    }
};

// @desc    Delete a category
// @route   DELETE /api/admin/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        await category.deleteOne();

        await Activity.create({
            user: req.user._id,
            action: `Deleted category: ${category.name}`,
            entityType: "category",
            entityId: category._id
        });

        res.status(200).json({ success: true, message: "Category deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error deleting category" });
    }
};
