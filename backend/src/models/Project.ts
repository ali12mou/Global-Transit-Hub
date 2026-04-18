import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    category: { type: String, required: false, trim: true, maxlength: 80, default: "" },
    description: { type: String, required: true, trim: true, maxlength: 5000 },
    image: { type: mongoose.Schema.Types.ObjectId, ref: "Upload", required: false, default: null },
    featured: { type: Boolean, required: true, default: true },
    active: { type: Boolean, required: true, default: true },
  },
  { timestamps: true, collection: "projects" },
);

export const Project =
  (mongoose.models["Project"] as mongoose.Model<any>) || mongoose.model("Project", ProjectSchema);

