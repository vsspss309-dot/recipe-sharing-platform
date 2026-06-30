import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Category name is required"],
            unique: true,
            trim: true
        },
        icon: {
            type: String, // e.g., 'FiCoffee', 'FiWind', emoji, or URL
            required: [true, "Category icon is required"]
        },
        color: {
            type: String, // e.g., 'primary', 'secondary', or hex code
            default: "primary"
        },
        description: {
            type: String,
            trim: true
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active"
        }
    },
    { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
