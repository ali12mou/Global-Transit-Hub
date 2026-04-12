import mongoose from "mongoose";
import { logger } from "./logger";

const defaultUri = "mongodb://127.0.0.1:27017/global";

export async function connectMongo(): Promise<void> {
  const uri = process.env["MONGODB_URI"] ?? defaultUri;
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  logger.info({ db: mongoose.connection.name }, "MongoDB connected");
}
