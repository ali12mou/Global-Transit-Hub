import mongoose from "mongoose";
import { Client } from "../src/models/Client";

const uri = process.env["MONGODB_URI"] ?? "mongodb://127.0.0.1:27017/global";

async function run() {
  await mongoose.connect(uri);

  try {
    await Client.createCollection();
  } catch {
    // Collection may already exist; ignore to keep script idempotent.
  }

  await Client.collection.createIndex({ createdAt: -1 });
  await Client.collection.createIndex({ active: 1, createdAt: -1 });

  console.log("Collection 'clients' OK (created or already exists).");
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
