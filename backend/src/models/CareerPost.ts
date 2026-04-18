import mongoose from "mongoose";

const CareerPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 180 },
    location: { type: String, required: false, trim: true, maxlength: 120, default: "" },
    contractType: { type: String, required: false, trim: true, maxlength: 80, default: "" },
    description: { type: String, required: true, trim: true, maxlength: 5000 },
    applyEmail: { type: String, required: false, trim: true, maxlength: 200, default: "" },
    active: { type: Boolean, required: true, default: true },
  },
  { timestamps: true, collection: "career_posts" },
);

export const CareerPost =
  (mongoose.models["CareerPost"] as mongoose.Model<any>) ||
  mongoose.model("CareerPost", CareerPostSchema);

