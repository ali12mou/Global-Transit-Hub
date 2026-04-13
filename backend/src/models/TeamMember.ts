import mongoose from "mongoose";

const TeamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    image: { type: String, required: false, default: "" },
    active: { type: Boolean, required: true, default: true },
  },
  { timestamps: true, collection: "team_members" },
);

export const TeamMember =
  (mongoose.models["TeamMember"] as mongoose.Model<any>) ||
  mongoose.model("TeamMember", TeamMemberSchema);

