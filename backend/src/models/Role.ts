import mongoose, { Schema, type InferSchemaType } from "mongoose";

const roleSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, trim: true, maxlength: 60 },
    label: { type: String, required: true, trim: true, maxlength: 120 },
    permissions: { type: [String], default: [] },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, collection: "Roles" },
);

export type RoleDoc = InferSchemaType<typeof roleSchema> & { _id: mongoose.Types.ObjectId };

export const Role = mongoose.models["Role"] ?? mongoose.model<RoleDoc>("Role", roleSchema);

