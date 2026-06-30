import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters long"]
    },
    description: {
      type: String,
      required: [true, "Project description is required"]
    },
    status: {
      type: String,
      enum: ["Planning", "In Progress", "Completed", "On Hold"],
      default: "Planning"
    },
    isHighImpact: {
      type: Boolean,
      default: false
    },
    impactScore: {
      type: Number,
      min: 1,
      max: 10,
      default: 5
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Project", projectSchema);
