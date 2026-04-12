import mongoose, { Schema, type InferSchemaType } from "mongoose";

/**
 * Demande de contact. `reviewedBy` référence un User (relation MongoDB par ObjectId).
 */
const contactInquirySchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true, default: "" },
    interest: { type: String, required: true, trim: true },
    destinations: { type: String, trim: true, default: "" },
    message: { type: String, trim: true, default: "" },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true },
);

export type ContactInquiryDoc = InferSchemaType<typeof contactInquirySchema> & {
  _id: mongoose.Types.ObjectId;
};

export const ContactInquiry =
  mongoose.models["ContactInquiry"] ??
  mongoose.model<ContactInquiryDoc>("ContactInquiry", contactInquirySchema);
