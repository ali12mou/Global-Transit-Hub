import mongoose from "mongoose";
import { ActivityOperation } from "../models/ActivityOperation";
import { ActivityService } from "../models/ActivityService";
import { CareerPost } from "../models/CareerPost";
import { Client } from "../models/Client";
import { ContactInquiry } from "../models/ContactInquiry";
import { News } from "../models/News";
import { Partner } from "../models/Partner";
import { Permission } from "../models/Permission";
import { Project } from "../models/Project";
import { Role } from "../models/Role";
import { TeamMember } from "../models/TeamMember";
import { User } from "../models/User";
import { logger } from "./logger";

const defaultUri = "mongodb://127.0.0.1:27017/global";

async function ensureCollection(model: mongoose.Model<unknown>): Promise<void> {
  try {
    await model.createCollection();
  } catch {
    // Collection may already exist; keep startup idempotent.
  }
}

/** Crée les index déclarés dans les schémas (unique, etc.). */
async function ensureSchemaIndexes(model: mongoose.Model<unknown>): Promise<void> {
  await model.createIndexes();
}

/**
 * Collections MongoDB + index pour les tris / filtres utilisés par les routes admin et public.
 */
async function ensureAllIndexes(): Promise<void> {
  await ensureCollection(User);
  await ensureSchemaIndexes(User);
  await User.collection.createIndex({ createdAt: -1 });

  await ensureCollection(News);
  await ensureSchemaIndexes(News);
  await News.collection.createIndex({ publishedAt: -1 });
  await News.collection.createIndex({ active: 1, publishedAt: -1 });
  await News.collection.createIndex({ createdBy: 1, createdAt: -1 });

  await ensureCollection(Client);
  await ensureSchemaIndexes(Client);
  await Client.collection.createIndex({ createdAt: -1 });
  await Client.collection.createIndex({ active: 1, createdAt: -1 });

  await ensureCollection(Partner);
  await ensureSchemaIndexes(Partner);
  await Partner.collection.createIndex({ createdAt: -1 });
  await Partner.collection.createIndex({ active: 1, type: 1, createdAt: -1 });

  await ensureCollection(TeamMember);
  await ensureSchemaIndexes(TeamMember);
  await TeamMember.collection.createIndex({ createdAt: -1 });
  await TeamMember.collection.createIndex({ active: 1, createdAt: -1 });

  await ensureCollection(ActivityService);
  await ensureSchemaIndexes(ActivityService);
  await ActivityService.collection.createIndex({ createdAt: -1 });
  await ActivityService.collection.createIndex({ active: 1, createdAt: -1 });

  await ensureCollection(ActivityOperation);
  await ensureSchemaIndexes(ActivityOperation);
  await ActivityOperation.collection.createIndex({ createdAt: -1 });
  await ActivityOperation.collection.createIndex({ active: 1, createdAt: -1 });

  await ensureCollection(CareerPost);
  await ensureSchemaIndexes(CareerPost);
  await CareerPost.collection.createIndex({ createdAt: -1 });
  await CareerPost.collection.createIndex({ active: 1, createdAt: -1 });

  await ensureCollection(Project);
  await ensureSchemaIndexes(Project);
  await Project.collection.createIndex({ createdAt: -1 });
  await Project.collection.createIndex({ active: 1, createdAt: -1 });
  await Project.collection.createIndex({ featured: 1, active: 1, createdAt: -1 });

  await ensureCollection(Role);
  await ensureSchemaIndexes(Role);

  await ensureCollection(Permission);
  await ensureSchemaIndexes(Permission);

  await ensureCollection(ContactInquiry);
  await ensureSchemaIndexes(ContactInquiry);
  await ContactInquiry.collection.createIndex({ createdAt: -1 });
  await ContactInquiry.collection.createIndex({ reviewedBy: 1, createdAt: -1 });
}

export async function connectMongo(): Promise<void> {
  const uri = process.env["MONGODB_URI"] ?? defaultUri;
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  await ensureAllIndexes();
  logger.info({ db: mongoose.connection.name }, "MongoDB connected");
}
