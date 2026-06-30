import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: [true, "Comment text is required"],
            trim: true,
            maxlength: [500, "Comment cannot exceed 500 characters"]
        },
        recipe: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Recipe",
            required: true
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Comment", commentSchema);
