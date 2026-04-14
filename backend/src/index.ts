import app from "./app";
import { upsertAdminFromEnv } from "./lib/adminUser";
import { logger } from "./lib/logger";
import { connectMongo } from "./lib/mongo";
import { seedRbacDefaults } from "./lib/rbacSeed";

function shouldAutoSeedAdmin(): boolean {
  const v = process.env["AUTO_SEED_ADMIN"]?.toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

function shouldAutoSeedRbac(): boolean {
  const v = process.env["AUTO_SEED_RBAC"]?.toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

const rawPort = process.env["PORT"] ?? "8080";
const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

async function main() {
  await connectMongo();
  if (shouldAutoSeedAdmin()) {
    try {
      const { email } = await upsertAdminFromEnv();
      logger.info({ email }, "Bootstrap admin (AUTO_SEED_ADMIN)");
    } catch (err) {
      logger.error({ err }, "AUTO_SEED_ADMIN failed");
    }
  }
  if (shouldAutoSeedRbac()) {
    try {
      await seedRbacDefaults();
      logger.info("RBAC seed OK (AUTO_SEED_RBAC)");
    } catch (err) {
      logger.error({ err }, "AUTO_SEED_RBAC failed");
    }
  }
  app.listen(port, (err) => {
    if (err) {
      logger.error({ err }, "Error listening");
      process.exit(1);
    }
    logger.info({ port }, "Server listening");
  });
}

main().catch((err) => {
  logger.error({ err }, "Fatal startup error");
  process.exit(1);
});
