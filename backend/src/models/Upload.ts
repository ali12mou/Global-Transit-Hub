import mongoose, { Schema, type InferSchemaType } from "mongoose";

/**
 * Fichier téléversé (disk: backend/uploads). Les entités CMS référencent ces documents.
 */
const uploadSchema = new Schema(
  {
    path: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
      unique: true,
      match: /^\/uploads\/.+/,
    },
    originalName: { type: String, required: true, trim: true, maxlength: 260, default: "" },
    mimeType: { type: String, required: true, trim: true, maxlength: 120, default: "application/octet-stream" },
    size: { type: Number, required: true, min: 0, default: 0 },
  },
  { timestamps: true, collection: "uploads" },
);

export type UploadDoc = InferSchemaType<typeof uploadSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Upload =
  mongoose.models["Upload"] ?? mongoose.model<UploadDoc>("Upload", uploadSchema);
