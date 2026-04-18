import mongoose, { Schema, type InferSchemaType } from "mongoose";

const permissionSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, trim: true, maxlength: 80 },
    label: { type: String, required: true, trim: true, maxlength: 160 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, collection: "Permissions" },
);

export type PermissionDoc = InferSchemaType<typeof permissionSchema> & { _id: mongoose.Types.ObjectId };

export const Permission =
  mongoose.models["Permission"] ?? mongoose.model<PermissionDoc>("Permission", permissionSchema);

