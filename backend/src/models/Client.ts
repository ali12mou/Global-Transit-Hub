import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 160 },
    images: [{ type: String, trim: true, maxlength: 500 }],
    active: { type: Boolean, required: true, default: true },
  },
  { timestamps: true, collection: "clients" },
);

export const Client = (mongoose.models["Client"] as mongoose.Model<any>) || mongoose.model("Client", ClientSchema);
