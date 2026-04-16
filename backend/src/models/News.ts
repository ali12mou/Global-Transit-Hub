import mongoose from "mongoose";

const NewsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 220 },
    description: { type: String, required: true, trim: true, maxlength: 6000 },
    publishedAt: { type: Date, required: true },
    images: [{ type: String, trim: true, maxlength: 500 }],
    likesCount: { type: Number, required: true, default: 0, min: 0 },
    commentsCount: { type: Number, required: true, default: 0, min: 0 },
    showInMoreToRead: { type: Boolean, required: true, default: true },
    active: { type: Boolean, required: true, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  },
  { timestamps: true, collection: "news" },
);

export const News = (mongoose.models["News"] as mongoose.Model<any>) || mongoose.model("News", NewsSchema);
