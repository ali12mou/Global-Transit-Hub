import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 160 },
    images: [{ type: mongoose.Schema.Types.ObjectId, ref: "Upload" }],
    active: { type: Boolean, required: true, default: true },
  },
  { timestamps: true, collection: "clients" },
);

export const Client = (mongoose.models["Client"] as mongoose.Model<any>) || mongoose.model("Client", ClientSchema);
