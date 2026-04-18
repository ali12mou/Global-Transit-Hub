import mongoose from "mongoose";
import { logger } from "./logger";
import { ActivityService } from "../models/ActivityService";
import { ActivityOperation } from "../models/ActivityOperation";
import { Client } from "../models/Client";
import { Partner } from "../models/Partner";
import { News } from "../models/News";
import { TeamMember } from "../models/TeamMember";
import { Project } from "../models/Project";
import { ensureUploadForPath, normalizeStoragePath } from "./imageRefs";

async function migrateImageArray(model: mongoose.Model<unknown>, field: string): Promise<number> {
  let updated = 0;
  const docs = await model.find({});
  for (const doc of docs) {
    const d = doc as unknown as Record<string, unknown> & { _id: mongoose.Types.ObjectId };
    const raw = d[field];
    if (!Array.isArray(raw) || raw.length === 0) continue;
    if (!raw.some((x) => typeof x === "string" && String(x).trim().length > 0)) continue;
    const newIds: mongoose.Types.ObjectId[] = [];
    for (const item of raw) {
      if (typeof item === "string" && item.trim()) {
        const p = normalizeStoragePath(item);
        if (p.startsWith("/uploads/")) {
          try {
            newIds.push(await ensureUploadForPath(p, {}));
          } catch {
            /* skip invalid */
          }
        }
        continue;
      }
      if (item instanceof mongoose.Types.ObjectId) {
        newIds.push(item);
        continue;
      }
      if (mongoose.isValidObjectId(item)) {
        newIds.push(new mongoose.Types.ObjectId(String(item)));
      }
    }
    if (newIds.length === 0) continue;
    await model.updateOne({ _id: (d as { _id: unknown })._id }, { $set: { [field]: newIds } });
    updated += 1;
  }
  return updated;
}

async function migrateSingleImage(model: mongoose.Model<unknown>, field: string): Promise<number> {
  let updated = 0;
  const docs = await model.find({});
  for (const doc of docs) {
    const d = doc as unknown as Record<string, unknown> & { _id: mongoose.Types.ObjectId };
    const raw = d[field];
    if (raw == null || raw === "") continue;
    if (typeof raw !== "string") continue;
    const p = normalizeStoragePath(raw);
    if (!p.startsWith("/uploads/")) continue;
    try {
      const id = await ensureUploadForPath(p, {});
      await model.updateOne({ _id: (d as { _id: unknown })._id }, { $set: { [field]: id } });
      updated += 1;
    } catch {
      /* ignore */
    }
  }
  return updated;
}

/**
 * Migre les anciennes chaînes /uploads/… vers des références ObjectId → collection uploads.
 */
export async function migrateLegacyImageStringsToUploadRefs(): Promise<void> {
  const t0 = Date.now();
  let n = 0;
  n += await migrateImageArray(ActivityService as mongoose.Model<unknown>, "images");
  n += await migrateImageArray(ActivityOperation as mongoose.Model<unknown>, "images");
  n += await migrateImageArray(Client as mongoose.Model<unknown>, "images");
  n += await migrateImageArray(Partner as mongoose.Model<unknown>, "images");
  n += await migrateImageArray(News as mongoose.Model<unknown>, "images");
  n += await migrateSingleImage(TeamMember as mongoose.Model<unknown>, "image");
  n += await migrateSingleImage(Project as mongoose.Model<unknown>, "image");
  logger.info({ migratedDocuments: n, ms: Date.now() - t0 }, "migrateLegacyImageStringsToUploadRefs done");
}
