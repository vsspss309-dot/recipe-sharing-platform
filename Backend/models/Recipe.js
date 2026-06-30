import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Recipe title is required"],
            trim: true
        },
        description: {
            type: String,
            required: [true, "Recipe description is required"],
            trim: true
        },
        image: {
            type: String,
            default: ""
        },
        cookingTime: {
            type: Number,
            required: [true, "Cooking time in minutes is required"],
            min: [1, "Cooking time must be at least 1 minute"]
        },
        difficulty: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            default: "Medium"
        },
        cuisine: {
            type: String,
            default: "Global"
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            enum: {
                values: ["Breakfast", "Italian", "Dessert", "Gujarati", "Rajasthani", "Marathi", "South Indian", "Mexican", "Thai", "Japanese", "Mediterranean", "American", "Other"],
                message: "{VALUE} is not a supported category"
            }
        },
        ingredients: {
            type: [String],
            required: [true, "Ingredients list is required"],
            validate: {
                validator: function(val) {
                    return val && val.length > 0;
                },
                message: "A recipe must contain at least one ingredient"
            }
        },
        instructions: {
            type: [String],
            required: [true, "Instructions steps list is required"],
            validate: {
                validator: function(val) {
                    return val && val.length > 0;
                },
                message: "A recipe must contain at least one instruction step"
            }
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Recipe must belong to a chef/user"]
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, "Rating must be above 1.0"],
            max: [5, "Rating cannot be above 5.0"],
            set: (val) => Math.round(val * 10) / 10 // Rounds to 1 decimal place (e.g. 4.567 -> 4.6)
        },
        ratingsCount: {
            type: Number,
            default: 0
        },
        viewsCount: {
            type: Number,
            default: 0
        },
        savesCount: {
            type: Number,
            default: 0
        },
        commentsCount: {
            type: Number,
            default: 0
        },
        likesCount: {
            type: Number,
            default: 0
        },
        nutritionalInfo: {
            calories: { type: Number, default: 0 },
            protein: { type: Number, default: 0 },
            carbs: { type: Number, default: 0 },
            fat: { type: Number, default: 0 }
        }
    },
    {
        timestamps: true
    }
);

// Indexing for search optimization on title, description & ingredients
recipeSchema.index({ title: "text", description: "text", ingredients: "text" });

const Recipe = mongoose.model("Recipe", recipeSchema);

export default Recipe;
