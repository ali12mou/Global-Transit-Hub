import mongoose, { Schema, type InferSchemaType } from "mongoose";

const activityServiceSchema = new Schema(
  {
    service: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    images: { type: [{ type: Schema.Types.ObjectId, ref: "Upload" }], default: [] },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, collection: "activity_services" },
);

export type ActivityServiceDoc = InferSchemaType<typeof activityServiceSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const ActivityService =
  mongoose.models["ActivityService"] ??
  mongoose.model<ActivityServiceDoc>("ActivityService", activityServiceSchema);

