import mongoose from "mongoose";

const PartnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 180 },
    type: { type: String, required: true, trim: true, maxlength: 80 },
    images: [{ type: mongoose.Schema.Types.ObjectId, ref: "Upload" }],
    active: { type: Boolean, required: true, default: true },
  },
  { timestamps: true, collection: "partners" },
);

export const Partner = (mongoose.models["Partner"] as mongoose.Model<any>) || mongoose.model("Partner", PartnerSchema);
