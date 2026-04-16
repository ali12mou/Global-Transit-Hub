import mongoose from "mongoose";
import { logger } from "./logger";
import { Client } from "../models/Client";
import { Partner } from "../models/Partner";

const defaultUri = "mongodb://127.0.0.1:27017/global";

export async function connectMongo(): Promise<void> {
  const uri = process.env["MONGODB_URI"] ?? defaultUri;
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  try {
    await Client.createCollection();
  } catch {
    // Collection may already exist; keep startup idempotent.
  }
  await Client.collection.createIndex({ createdAt: -1 });
  await Client.collection.createIndex({ active: 1, createdAt: -1 });
  try {
    await Partner.createCollection();
  } catch {
    // Collection may already exist; keep startup idempotent.
  }
  await Partner.collection.createIndex({ createdAt: -1 });
  await Partner.collection.createIndex({ active: 1, type: 1, createdAt: -1 });
  logger.info({ db: mongoose.connection.name }, "MongoDB connected");
}
