import mongoose from "mongoose";

const mealPlanSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Meal plan must belong to a user"]
        },
        recipe: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Recipe",
            required: [true, "Meal plan must refer to a recipe"]
        },
        date: {
            type: String, // YYYY-MM-DD
            required: [true, "Date is required"]
        },
        mealType: {
            type: String,
            enum: ["Breakfast", "Lunch", "Dinner", "Snack"],
            required: [true, "Meal type is required"]
        }
    },
    {
        timestamps: true
    }
);

// Index to easily fetch a user's meals for a specific date range
mealPlanSchema.index({ user: 1, date: 1 });

const MealPlan = mongoose.model("MealPlan", mealPlanSchema);

export default MealPlan;
