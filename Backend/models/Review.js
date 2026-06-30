import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Review must belong to a user"]
        },
        recipe: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Recipe",
            required: [true, "Review must connect to a recipe"]
        },
        rating: {
            type: Number,
            required: [true, "Review rating is required"],
            min: [1, "Rating must be at least 1"],
            max: [5, "Rating cannot be above 5"]
        },
        comment: {
            type: String,
            required: [true, "Review text comment is required"],
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

// Compound index to ensure one review per user per recipe
reviewSchema.index({ user: 1, recipe: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);

export default Review;
