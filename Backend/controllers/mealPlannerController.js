import MealPlan from "../models/MealPlan.js";
import Recipe from "../models/Recipe.js";

// @desc    Get user's meal plans
// @route   GET /api/meal-planner
// @access  Private (Pro/Chef)
export const getMealPlans = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let query = { user: req.user._id };

        if (startDate && endDate) {
            query.date = { $gte: startDate, $lte: endDate };
        }

        const mealPlans = await MealPlan.find(query).populate("recipe", "title image prepTime");
        res.status(200).json({ success: true, data: mealPlans });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Add a meal plan
// @route   POST /api/meal-planner
// @access  Private (Pro/Chef)
export const addMealPlan = async (req, res) => {
    try {
        const { recipeId, date, mealType } = req.body;

        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ success: false, message: "Recipe not found" });
        }

        const mealPlan = await MealPlan.create({
            user: req.user._id,
            recipe: recipeId,
            date,
            mealType
        });

        res.status(201).json({ success: true, data: mealPlan });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete a meal plan
// @route   DELETE /api/meal-planner/:id
// @access  Private (Pro/Chef)
export const deleteMealPlan = async (req, res) => {
    try {
        const mealPlan = await MealPlan.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!mealPlan) {
            return res.status(404).json({ success: false, message: "Meal plan not found" });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Generate Grocery List from meal plans
// @route   GET /api/meal-planner/grocery-list
// @access  Private (Pro/Chef)
export const generateGroceryList = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            return res.status(400).json({ success: false, message: "Please provide startDate and endDate" });
        }

        const mealPlans = await MealPlan.find({
            user: req.user._id,
            date: { $gte: startDate, $lte: endDate }
        }).populate("recipe", "ingredients");

        // Aggregate ingredients
        const ingredientsMap = new Map();
        mealPlans.forEach(plan => {
            if (plan.recipe && plan.recipe.ingredients) {
                plan.recipe.ingredients.forEach(ingredient => {
                    const normalized = ingredient.toLowerCase().trim();
                    if (ingredientsMap.has(normalized)) {
                        ingredientsMap.set(normalized, ingredientsMap.get(normalized) + 1);
                    } else {
                        ingredientsMap.set(normalized, 1);
                    }
                });
            }
        });

        const groceryList = Array.from(ingredientsMap, ([name, count]) => ({ name, count }));

        res.status(200).json({ success: true, data: groceryList });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
