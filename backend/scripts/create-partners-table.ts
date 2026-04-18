import mongoose from "mongoose";
import { Partner } from "../src/models/Partner";

const uri = process.env["MONGODB_URI"] ?? "mongodb://127.0.0.1:27017/global";

const defaultPorts = [
  "Port de Djibouti",
  "Port de Doraleh",
  "Port polyvalent de Doraleh",
  "Port de Tadjourah",
  "Port de Ghoubet",
  "Terminal a conteneurs de Doraleh",
];

async function run() {
  await mongoose.connect(uri);

  try {
    await Partner.createCollection();
  } catch {
    // Collection may already exist; ignore to keep script idempotent.
  }

  await Partner.collection.createIndex({ createdAt: -1 });
  await Partner.collection.createIndex({ active: 1, type: 1, createdAt: -1 });

  for (const name of defaultPorts) {
    await Partner.updateOne(
      { name, type: "ports" },
      { $setOnInsert: { name, type: "ports", images: [], active: true } },
      { upsert: true },
    );
  }

  console.log("Collection 'partners' OK with default ports.");
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
