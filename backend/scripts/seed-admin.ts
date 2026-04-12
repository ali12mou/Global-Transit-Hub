import mongoose from "mongoose";
import { upsertAdminFromEnv } from "../src/lib/adminUser";

const uri = process.env["MONGODB_URI"] ?? "mongodb://127.0.0.1:27017/global";

async function run() {
  await mongoose.connect(uri);
  const { email } = await upsertAdminFromEnv();
  console.log(`Admin OK: ${email} (collection users — connexion: globaltransit ou ${email})`);
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
