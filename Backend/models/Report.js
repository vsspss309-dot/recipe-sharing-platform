import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
    {
        reporter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Reporter ID is required"]
        },
        targetType: {
            type: String,
            enum: ["recipe", "comment", "user"],
            required: [true, "Target type is required"]
        },
        targetId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Target ID is required"]
        },
        reason: {
            type: String,
            enum: ["Spam", "Copyright", "Harassment", "Fake", "Other"],
            required: [true, "Report reason is required"]
        },
        details: {
            type: String,
            trim: true
        },
        status: {
            type: String,
            enum: ["pending", "resolved", "dismissed"],
            default: "pending"
        }
    },
    { timestamps: true }
);

export default mongoose.model("Report", reportSchema);
