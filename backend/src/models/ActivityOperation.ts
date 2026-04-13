import mongoose, { Schema, type InferSchemaType } from "mongoose";

const activityOperationSchema = new Schema(
  {
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    images: { type: [String], default: [] },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, collection: "activity_operations" },
);

export type ActivityOperationDoc = InferSchemaType<typeof activityOperationSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const ActivityOperation =
  mongoose.models["ActivityOperation"] ??
  mongoose.model<ActivityOperationDoc>("ActivityOperation", activityOperationSchema);

