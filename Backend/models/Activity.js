import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"]
        },
        action: {
            type: String,
            required: [true, "Action description is required"]
        },
        entityType: {
            type: String, // 'recipe', 'user', 'comment', 'report', 'category'
            required: [true, "Entity type is required"]
        },
        entityId: {
            type: mongoose.Schema.Types.ObjectId
        },
        ipAddress: {
            type: String
        }
    },
    { timestamps: true }
);

export default mongoose.model("Activity", activitySchema);
