import mongoose from "mongoose";
import { News } from "../src/models/News";

const uri = process.env["MONGODB_URI"] ?? "mongodb://127.0.0.1:27017/global";

async function run() {
  await mongoose.connect(uri);

  try {
    await News.createCollection();
  } catch {
    // Collection may already exist; ignore to keep script idempotent.
  }

  await News.collection.createIndex({ publishedAt: -1 });
  await News.collection.createIndex({ active: 1, publishedAt: -1 });
  await News.collection.createIndex({ createdBy: 1, createdAt: -1 });

  console.log("Collection 'news' OK (created or already exists).");
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
