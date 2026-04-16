import { Router, type IRouter } from "express";
import multer from "multer";
import path from "node:path";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { ContactInquiry } from "../models/ContactInquiry";
import { User } from "../models/User";
import { ActivityService } from "../models/ActivityService";
import { ActivityOperation } from "../models/ActivityOperation";
import { TeamMember } from "../models/TeamMember";
import { CareerPost } from "../models/CareerPost";
import { Project } from "../models/Project";
import { News } from "../models/News";
import { Client } from "../models/Client";
import { Partner } from "../models/Partner";
import { Role } from "../models/Role";
import { Permission } from "../models/Permission";
import { requireAdmin, type AuthedRequest } from "../middleware/auth";
import { ensureUploadsDir } from "../lib/uploads";
import { toPublicUrl } from "../lib/publicUrl";

const router: IRouter = Router();

router.use(requireAdmin);

const uploadsDir = ensureUploadsDir();
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase().slice(0, 10);
    const base = crypto.randomBytes(16).toString("hex");
    cb(null, `${Date.now()}-${base}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 7 * 1024 * 1024 },
});

router.post("/uploads", upload.array("images", 12), (req, res) => {
  const files = (req.files as Express.Multer.File[] | undefined) ?? [];
  const urls = files.map((f) => toPublicUrl(req, `/uploads/${f.filename}`));
  res.json({ urls });
});

router.get("/users", async (_req, res) => {
  const list = await User.find().sort({ createdAt: -1 }).limit(500).lean();
  res.json({
    users: list.map((row) => ({
      id: String((row as any)._id),
      email: String((row as any).email ?? ""),
      role: String((row as any).role ?? "user"),
      createdAt: (row as any).createdAt,
    })),
  });
});

const createUserBody = z.object({
  email: z.string().email().transform((s) => s.toLowerCase().trim()),
  password: z.string().min(6).max(200),
  role: z.enum(["admin", "user"]).default("user"),
});

router.post("/users", async (req, res) => {
  const parsed = createUserBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "invalid_body" });
    return;
  }
  const { email, password, role } = parsed.data;
  const exists = await User.findOne({ email }).lean();
  if (exists) {
    res.status(409).json({ error: "email_exists" });
    return;
  }
  const passwordHash = await bcrypt.hash(password, 12);
  const doc = await User.create({ email, passwordHash, role });
  res.status(201).json({ id: doc._id.toString() });
});

const patchUserRoleBody = z.object({
  role: z.enum(["admin", "user"]),
});

router.patch("/users/:id", async (req, res) => {
  const id = String(req.params["id"] ?? "").trim();
  const parsed = patchUserRoleBody.safeParse(req.body);
  if (!id || !parsed.success) {
    res.status(400).json({ error: "invalid_body" });
    return;
  }
  const doc = await User.findByIdAndUpdate(
    id,
    { $set: { role: parsed.data.role } },
    { new: true },
  ).lean();
  if (!doc) {
    res.status(404).json({ error: "not_found" });
    return;
  }
  res.json({ ok: true });
});

router.delete("/users/:id", async (req: AuthedRequest, res) => {
  const id = String(req.params["id"] ?? "").trim();
  const meId = req.auth?.sub;
  if (!id) {
    res.status(400).json({ error: "invalid_id" });
    return;
  }
  if (meId && id === meId) {
    res.status(400).json({ error: "cannot_delete_self" });
    return;
  }
  await User.findByIdAndDelete(id);
  res.json({ ok: true });
});

router.get("/roles", async (_req, res) => {
  const list = await Role.find().sort({ key: 1 }).limit(200).lean();
  res.json({
    roles: list.map((r) => ({
      id: String((r as any)._id),
      key: String((r as any).key ?? ""),
      label: String((r as any).label ?? ""),
      permissions: ((r as any).permissions ?? []) as string[],
      active: Boolean((r as any).active),
    })),
  });
});

const roleBody = z.object({
  key: z.string().trim().min(1).max(60),
  label: z.string().trim().min(1).max(120),
  permissions: z.array(z.string().trim().min(1).max(80)).default([]),
  active: z.boolean().optional(),
});

router.post("/roles", async (req, res) => {
  const parsed = roleBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "invalid_body" });
    return;
  }
  const exists = await Role.findOne({ key: parsed.data.key }).lean();
  if (exists) {
    res.status(409).json({ error: "key_exists" });
    return;
  }
  const doc = await Role.create({
    key: parsed.data.key,
    label: parsed.data.label,
    permissions: parsed.data.permissions,
    active: parsed.data.active ?? true,
  });
  res.status(201).json({ id: doc._id.toString() });
});

router.patch("/roles/:id", async (req, res) => {
  const id = String(req.params["id"] ?? "").trim();
  const parsed = roleBody.partial().safeParse(req.body);
  if (!id || !parsed.success) {
    res.status(400).json({ error: "invalid_body" });
    return;
  }
  if (parsed.data.key) {
    const exists = await Role.findOne({ key: parsed.data.key, _id: { $ne: id } }).lean();
    if (exists) {
      res.status(409).json({ error: "key_exists" });
      return;
    }
  }
  const doc = await Role.findByIdAndUpdate(id, { $set: parsed.data }, { new: true }).lean();
  if (!doc) {
    res.status(404).json({ error: "not_found" });
    return;
  }
  res.json({ ok: true });
});

router.delete("/roles/:id", async (req, res) => {
  const id = String(req.params["id"] ?? "").trim();
  if (!id) {
    res.status(400).json({ error: "invalid_id" });
    return;
  }
  await Role.findByIdAndDelete(id);
  res.json({ ok: true });
});

router.get("/permissions", async (_req, res) => {
  const list = await Permission.find().sort({ key: 1 }).limit(400).lean();
  res.json({
    permissions: list.map((p) => ({
      id: String((p as any)._id),
      key: String((p as any).key ?? ""),
      label: String((p as any).label ?? ""),
      active: Boolean((p as any).active),
    })),
  });
});

const permissionBody = z.object({
  key: z.string().trim().min(1).max(80),
  label: z.string().trim().min(1).max(160),
  active: z.boolean().optional(),
});

router.post("/permissions", async (req, res) => {
  const parsed = permissionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "invalid_body" });
    return;
  }
  const exists = await Permission.findOne({ key: parsed.data.key }).lean();
  if (exists) {
    res.status(409).json({ error: "key_exists" });
    return;
  }
  const doc = await Permission.create({
    key: parsed.data.key,
    label: parsed.data.label,
    active: parsed.data.active ?? true,
  });
  res.status(201).json({ id: doc._id.toString() });
});

router.patch("/permissions/:id", async (req, res) => {
  const id = String(req.params["id"] ?? "").trim();
  const parsed = permissionBody.partial().safeParse(req.body);
  if (!id || !parsed.success) {
    res.status(400).json({ error: "invalid_body" });
    return;
  }
  if (parsed.data.key) {
    const exists = await Permission.findOne({ key: parsed.data.key, _id: { $ne: id } }).lean();
    if (exists) {
      res.status(409).json({ error: "key_exists" });
      return;
    }
  }
  const doc = await Permission.findByIdAndUpdate(id, { $set: parsed.data }, { new: true }).lean();
  if (!doc) {
    res.status(404).json({ error: "not_found" });
    return;
  }
  res.json({ ok: true });
});

router.delete("/permissions/:id", async (req, res) => {
  const id = String(req.params["id"] ?? "").trim();
  if (!id) {
    res.status(400).json({ error: "invalid_id" });
    return;
  }
  await Permission.findByIdAndDelete(id);
  res.json({ ok: true });
});

router.get("/activity-services", async (req, res) => {
  const list = await ActivityService.find().sort({ createdAt: -1 }).limit(500).lean();
  res.json({
    services: list.map((row) => ({
      id: String((row as any)._id),
      service: String((row as any).service ?? ""),
      description: String((row as any).description ?? ""),
      images: (((row as any).images ?? []) as string[]).map((src) => toPublicUrl(req, src)),
      active: Boolean((row as any).active),
      createdAt: (row as any).createdAt,
    })),
  });
});

router.post("/activity-services", async (req, res) => {
  const service = String(req.body?.service ?? "").trim().slice(0, 80);
  const description = String(req.body?.description ?? "").trim().slice(0, 2000);
  const images = Array.isArray(req.body?.images) ? req.body.images : [];
  const cleanImages = images.map(String).slice(0, 3);
  const active = req.body?.active === false ? false : true;
  if (!service || !description) {
    res.status(400).json({ error: "invalid_body" });
    return;
  }
  const doc = await ActivityService.create({ service, description, images: cleanImages, active });
  res.status(201).json({ id: doc._id.toString() });
});

router.patch("/activity-services/:id", async (req, res) => {
  const id = String(req.params["id"] ?? "").trim();
  const service = String(req.body?.service ?? "").trim().slice(0, 80);
  const description = String(req.body?.description ?? "").trim().slice(0, 2000);
  const images = Array.isArray(req.body?.images) ? req.body.images : undefined;
  const active = typeof req.body?.active === "boolean" ? req.body.active : undefined;
  const update: any = {};
  if (service) update.service = service;
  if (description) update.description = description;
  if (images) update.images = images.map(String).slice(0, 3);
  if (active !== undefined) update.active = active;
  const doc = await ActivityService.findByIdAndUpdate(id, { $set: update }, { new: true }).lean();
  if (!doc) {
    res.status(404).json({ error: "not_found" });
    return;
  }
  res.json({ ok: true });
});

router.delete("/activity-services/:id", async (req, res) => {
  const id = String(req.params["id"] ?? "").trim();
  await ActivityService.findByIdAndDelete(id);
  res.json({ ok: true });
});

router.get("/activity-operations", async (req, res) => {
  const list = await ActivityOperation.find().sort({ createdAt: -1 }).limit(800).lean();
  res.json({
    operations: list.map((row) => ({
      id: String((row as any)._id),
      description: String((row as any).description ?? ""),
      images: (((row as any).images ?? []) as string[]).map((src) => toPublicUrl(req, src)),
      active: Boolean((row as any).active),
      createdAt: (row as any).createdAt,
    })),
  });
});

router.post("/activity-operations", async (req, res) => {
  const description = String(req.body?.description ?? "").trim().slice(0, 2000);
  const images = Array.isArray(req.body?.images) ? req.body.images : [];
  const cleanImages = images.map(String).slice(0, 12);
  const active = req.body?.active === false ? false : true;
  if (!description) {
    res.status(400).json({ error: "invalid_body" });
    return;
  }
  const doc = await ActivityOperation.create({ description, images: cleanImages, active });
  res.status(201).json({ id: doc._id.toString() });
});

router.patch("/activity-operations/:id", async (req, res) => {
  const id = String(req.params["id"] ?? "").trim();
  const description = String(req.body?.description ?? "").trim().slice(0, 2000);
  const images = Array.isArray(req.body?.images) ? req.body.images : undefined;
  const active = typeof req.body?.active === "boolean" ? req.body.active : undefined;
  const update: any = {};
  if (description) update.description = description;
  if (images) update.images = images.map(String).slice(0, 12);
  if (active !== undefined) update.active = active;
  const doc = await ActivityOperation.findByIdAndUpdate(id, { $set: update }, { new: true }).lean();
  if (!doc) {
    res.status(404).json({ error: "not_found" });
    return;
  }
  res.json({ ok: true });
});

router.delete("/activity-operations/:id", async (req, res) => {
  const id = String(req.params["id"] ?? "").trim();
  await ActivityOperation.findByIdAndDelete(id);
  res.json({ ok: true });
});

router.get("/team-members", async (req, res) => {
  const list = await TeamMember.find().sort({ createdAt: -1 }).limit(500).lean();
  res.json({
    members: list.map((row) => ({
      id: String((row as any)._id),
      name: String((row as any).name ?? ""),
      title: String((row as any).title ?? ""),
      description: String((row as any).description ?? ""),
      image: toPublicUrl(req, String((row as any).image ?? "")),
      active: Boolean((row as any).active),
      createdAt: (row as any).createdAt,
    })),
  });
});

router.post("/team-members", async (req, res) => {
  const name = String(req.body?.name ?? "").trim().slice(0, 120);
  const title = String(req.body?.title ?? "").trim().slice(0, 160);
  const description = String(req.body?.description ?? "").trim().slice(0, 2000);
  const image = String(req.body?.image ?? "").trim().slice(0, 400);
  const active = req.body?.active === false ? false : true;
  if (!name || !title || !description) {
    res.status(400).json({ error: "invalid_body" });
    return;
  }
  const doc = await TeamMember.create({ name, title, description, image, active });
  res.status(201).json({ id: doc._id.toString() });
});

router.patch("/team-members/:id", async (req, res) => {
  const id = String(req.params["id"] ?? "").trim();
  if (!id) {
    res.status(400).json({ error: "invalid_id" });
    return;
  }
  const name = String(req.body?.name ?? "").trim().slice(0, 120);
  const title = String(req.body?.title ?? "").trim().slice(0, 160);
  const description = String(req.body?.description ?? "").trim().slice(0, 2000);
  const image = typeof req.body?.image === "string" ? String(req.body.image).trim().slice(0, 400) : undefined;
  const active = typeof req.body?.active === "boolean" ? req.body.active : undefined;

  const update: any = {};
  if (name) update.name = name;
  if (title) update.title = title;
  if (description) update.description = description;
  if (image !== undefined) update.image = image;
  if (active !== undefined) update.active = active;

  const doc = await TeamMember.findByIdAndUpdate(id, { $set: update }, { new: true }).lean();
  if (!doc) {
    res.status(404).json({ error: "not_found" });
    return;
  }
  res.json({ ok: true });
});

router.delete("/team-members/:id", async (req, res) => {
  const id = String(req.params["id"] ?? "").trim();
  if (!id) {
    res.status(400).json({ error: "invalid_id" });
    return;
  }
  await TeamMember.findByIdAndDelete(id);
  res.json({ ok: true });
});

router.get("/careers", async (_req, res) => {
  const list = await CareerPost.find().sort({ createdAt: -1 }).limit(500).lean();
  res.json({
    careers: list.map((row) => ({
      id: String((row as any)._id),
      title: String((row as any).title ?? ""),
      location: String((row as any).location ?? ""),
      contractType: String((row as any).contractType ?? ""),
      description: String((row as any).description ?? ""),
      applyEmail: String((row as any).applyEmail ?? ""),
      active: Boolean((row as any).active),
      createdAt: (row as any).createdAt,
    })),
  });
});

router.post("/careers", async (req, res) => {
  const title = String(req.body?.title ?? "").trim().slice(0, 180);
  const location = String(req.body?.location ?? "").trim().slice(0, 120);
  const contractType = String(req.body?.contractType ?? "").trim().slice(0, 80);
  const description = String(req.body?.description ?? "").trim().slice(0, 5000);
  const applyEmail = String(req.body?.applyEmail ?? "").trim().slice(0, 200);
  const active = req.body?.active === false ? false : true;
  if (!title || !description) {
    res.status(400).json({ error: "invalid_body" });
    return;
  }
  const doc = await CareerPost.create({ title, location, contractType, description, applyEmail, active });
  res.status(201).json({ id: doc._id.toString() });
});

router.patch("/careers/:id", async (req, res) => {
  const id = String(req.params["id"] ?? "").trim();
  if (!id) {
    res.status(400).json({ error: "invalid_id" });
    return;
  }
  const title = String(req.body?.title ?? "").trim().slice(0, 180);
  const location = typeof req.body?.location === "string" ? String(req.body.location).trim().slice(0, 120) : undefined;
  const contractType =
    typeof req.body?.contractType === "string" ? String(req.body.contractType).trim().slice(0, 80) : undefined;
  const description = String(req.body?.description ?? "").trim().slice(0, 5000);
  const applyEmail =
    typeof req.body?.applyEmail === "string" ? String(req.body.applyEmail).trim().slice(0, 200) : undefined;
  const active = typeof req.body?.active === "boolean" ? req.body.active : undefined;

  const update: any = {};
  if (title) update.title = title;
  if (description) update.description = description;
  if (location !== undefined) update.location = location;
  if (contractType !== undefined) update.contractType = contractType;
  if (applyEmail !== undefined) update.applyEmail = applyEmail;
  if (active !== undefined) update.active = active;

  const doc = await CareerPost.findByIdAndUpdate(id, { $set: update }, { new: true }).lean();
  if (!doc) {
    res.status(404).json({ error: "not_found" });
    return;
  }
  res.json({ ok: true });
});

router.delete("/careers/:id", async (req, res) => {
  const id = String(req.params["id"] ?? "").trim();
  if (!id) {
    res.status(400).json({ error: "invalid_id" });
    return;
  }
  await CareerPost.findByIdAndDelete(id);
  res.json({ ok: true });
});

router.get("/projects", async (req, res) => {
  const list = await Project.find().sort({ createdAt: -1 }).limit(300).lean();
  res.json({
    projects: list.map((row) => ({
      id: String((row as any)._id),
      title: String((row as any).title ?? ""),
      category: String((row as any).category ?? ""),
      description: String((row as any).description ?? ""),
      image: toPublicUrl(req, String((row as any).image ?? "")),
      featured: Boolean((row as any).featured),
      active: Boolean((row as any).active),
      createdAt: (row as any).createdAt,
    })),
  });
});

router.post("/projects", async (req, res) => {
  const title = String(req.body?.title ?? "").trim().slice(0, 200);
  const category = String(req.body?.category ?? "").trim().slice(0, 80);
  const description = String(req.body?.description ?? "").trim().slice(0, 5000);
  const image = String(req.body?.image ?? "").trim().slice(0, 400);
  const featured = typeof req.body?.featured === "boolean" ? req.body.featured : true;
  const active = req.body?.active === false ? false : true;
  if (!title || !description) {
    res.status(400).json({ error: "invalid_body" });
    return;
  }
  const doc = await Project.create({ title, category, description, image, featured, active });
  res.status(201).json({ id: doc._id.toString() });
});

router.patch("/projects/:id", async (req, res) => {
  const id = String(req.params["id"] ?? "").trim();
  if (!id) {
    res.status(400).json({ error: "invalid_id" });
    return;
  }
  const title = String(req.body?.title ?? "").trim().slice(0, 200);
  const category = typeof req.body?.category === "string" ? String(req.body.category).trim().slice(0, 80) : undefined;
  const description = String(req.body?.description ?? "").trim().slice(0, 5000);
  const image = typeof req.body?.image === "string" ? String(req.body.image).trim().slice(0, 400) : undefined;
  const featured = typeof req.body?.featured === "boolean" ? req.body.featured : undefined;
  const active = typeof req.body?.active === "boolean" ? req.body.active : undefined;

  const update: any = {};
  if (title) update.title = title;
  if (description) update.description = description;
  if (category !== undefined) update.category = category;
  if (image !== undefined) update.image = image;
  if (featured !== undefined) update.featured = featured;
  if (active !== undefined) update.active = active;

  const doc = await Project.findByIdAndUpdate(id, { $set: update }, { new: true }).lean();
  if (!doc) {
    res.status(404).json({ error: "not_found" });
    return;
  }
  res.json({ ok: true });
});

router.delete("/projects/:id", async (req, res) => {
  const id = String(req.params["id"] ?? "").trim();
  if (!id) {
    res.status(400).json({ error: "invalid_id" });
    return;
  }
  await Project.findByIdAndDelete(id);
  res.json({ ok: true });
});

router.get("/clients", async (req, res) => {
  const list = await Client.find().sort({ createdAt: -1 }).limit(500).lean();
  res.json({
    clients: list.map((row) => ({
      id: String((row as any)._id),
      name: String((row as any).name ?? ""),
      images: (((row as any).images ?? []) as string[]).map((src) => toPublicUrl(req, src)),
      active: Boolean((row as any).active),
      createdAt: (row as any).createdAt,
    })),
  });
});

router.post("/clients", async (req, res) => {
  const name = String(req.body?.name ?? "").trim().slice(0, 160);
  const images = Array.isArray(req.body?.images) ? req.body.images : [];
  const cleanImages = images.map(String).slice(0, 8);
  const active = req.body?.active === false ? false : true;
  if (!name) {
    res.status(400).json({ error: "invalid_body" });
    return;
  }
  const doc = await Client.create({ name, images: cleanImages, active });
  res.status(201).json({ id: doc._id.toString() });
});

router.patch("/clients/:id", async (req, res) => {
  const id = String(req.params["id"] ?? "").trim();
  if (!id) {
    res.status(400).json({ error: "invalid_id" });
    return;
  }
  const update: any = {};
  if (typeof req.body?.name === "string") update.name = String(req.body.name).trim().slice(0, 160);
  if (Array.isArray(req.body?.images)) update.images = req.body.images.map(String).slice(0, 8);
  if (typeof req.body?.active === "boolean") update.active = req.body.active;
  const doc = await Client.findByIdAndUpdate(id, { $set: update }, { new: true }).lean();
  if (!doc) {
    res.status(404).json({ error: "not_found" });
    return;
  }
  res.json({ ok: true });
});

router.delete("/clients/:id", async (req, res) => {
  const id = String(req.params["id"] ?? "").trim();
  if (!id) {
    res.status(400).json({ error: "invalid_id" });
    return;
  }
  await Client.findByIdAndDelete(id);
  res.json({ ok: true });
});

router.get("/partners", async (req, res) => {
  const list = await Partner.find().sort({ type: 1, createdAt: -1 }).limit(500).lean();
  res.json({
    partners: list.map((row) => ({
      id: String((row as any)._id),
      name: String((row as any).name ?? ""),
      type: String((row as any).type ?? ""),
      images: (((row as any).images ?? []) as string[]).map((src) => toPublicUrl(req, src)),
      active: Boolean((row as any).active),
      createdAt: (row as any).createdAt,
    })),
  });
});

router.post("/partners", async (req, res) => {
  const name = String(req.body?.name ?? "").trim().slice(0, 180);
  const type = String(req.body?.type ?? "").trim().slice(0, 80);
  const images = Array.isArray(req.body?.images) ? req.body.images : [];
  const cleanImages = images.map(String).slice(0, 8);
  const active = req.body?.active === false ? false : true;
  if (!name || !type) {
    res.status(400).json({ error: "invalid_body" });
    return;
  }
  const doc = await Partner.create({ name, type, images: cleanImages, active });
  res.status(201).json({ id: doc._id.toString() });
});

router.patch("/partners/:id", async (req, res) => {
  const id = String(req.params["id"] ?? "").trim();
  if (!id) {
    res.status(400).json({ error: "invalid_id" });
    return;
  }
  const update: any = {};
  if (typeof req.body?.name === "string") update.name = String(req.body.name).trim().slice(0, 180);
  if (typeof req.body?.type === "string") update.type = String(req.body.type).trim().slice(0, 80);
  if (Array.isArray(req.body?.images)) update.images = req.body.images.map(String).slice(0, 8);
  if (typeof req.body?.active === "boolean") update.active = req.body.active;
  const doc = await Partner.findByIdAndUpdate(id, { $set: update }, { new: true }).lean();
  if (!doc) {
    res.status(404).json({ error: "not_found" });
    return;
  }
  res.json({ ok: true });
});

router.delete("/partners/:id", async (req, res) => {
  const id = String(req.params["id"] ?? "").trim();
  if (!id) {
    res.status(400).json({ error: "invalid_id" });
    return;
  }
  await Partner.findByIdAndDelete(id);
  res.json({ ok: true });
});

router.get("/news", async (req, res) => {
  const list = await News.find().sort({ publishedAt: -1, createdAt: -1 }).limit(500).populate("createdBy", "email").lean();
  res.json({
    news: list.map((row) => ({
      id: String((row as any)._id),
      name: String((row as any).name ?? ""),
      description: String((row as any).description ?? ""),
      publishedAt: (row as any).publishedAt,
      images: (((row as any).images ?? []) as string[]).map((src) => toPublicUrl(req, src)),
      likesCount: Number((row as any).likesCount ?? 0),
      commentsCount: Number((row as any).commentsCount ?? 0),
      showInMoreToRead: Boolean((row as any).showInMoreToRead ?? true),
      active: Boolean((row as any).active),
      user: String((row as any)?.createdBy?.email ?? ""),
      createdAt: (row as any).createdAt,
    })),
  });
});

router.post("/news", async (req: AuthedRequest, res) => {
  const name = String(req.body?.name ?? "").trim().slice(0, 220);
  const description = String(req.body?.description ?? "").trim().slice(0, 6000);
  const publishedAtInput = req.body?.publishedAt;
  const images = Array.isArray(req.body?.images) ? req.body.images : [];
  const cleanImages = images.map(String).slice(0, 8);
  const active = req.body?.active === false ? false : true;
  const likesCount = Math.max(0, Number(req.body?.likesCount ?? 0) || 0);
  const commentsCount = Math.max(0, Number(req.body?.commentsCount ?? 0) || 0);
  const showInMoreToRead = req.body?.showInMoreToRead === false ? false : true;
  const publishedAt = new Date(typeof publishedAtInput === "string" ? publishedAtInput : Date.now());
  if (!name || !description || Number.isNaN(publishedAt.getTime())) {
    res.status(400).json({ error: "invalid_body" });
    return;
  }
  const doc = await News.create({
    name,
    description,
    publishedAt,
    images: cleanImages,
    likesCount,
    commentsCount,
    showInMoreToRead,
    active,
    createdBy: req.auth?.sub ?? undefined,
  });
  res.status(201).json({ id: doc._id.toString() });
});

router.patch("/news/:id", async (req, res) => {
  const id = String(req.params["id"] ?? "").trim();
  if (!id) {
    res.status(400).json({ error: "invalid_id" });
    return;
  }
  const update: any = {};
  if (typeof req.body?.name === "string") update.name = String(req.body.name).trim().slice(0, 220);
  if (typeof req.body?.description === "string") update.description = String(req.body.description).trim().slice(0, 6000);
  if (typeof req.body?.publishedAt === "string") {
    const d = new Date(req.body.publishedAt);
    if (Number.isNaN(d.getTime())) {
      res.status(400).json({ error: "invalid_body" });
      return;
    }
    update.publishedAt = d;
  }
  if (Array.isArray(req.body?.images)) update.images = req.body.images.map(String).slice(0, 8);
  if (typeof req.body?.likesCount !== "undefined") update.likesCount = Math.max(0, Number(req.body.likesCount) || 0);
  if (typeof req.body?.commentsCount !== "undefined")
    update.commentsCount = Math.max(0, Number(req.body.commentsCount) || 0);
  if (typeof req.body?.showInMoreToRead === "boolean") update.showInMoreToRead = req.body.showInMoreToRead;
  if (typeof req.body?.active === "boolean") update.active = req.body.active;

  const doc = await News.findByIdAndUpdate(id, { $set: update }, { new: true }).lean();
  if (!doc) {
    res.status(404).json({ error: "not_found" });
    return;
  }
  res.json({ ok: true });
});

router.delete("/news/:id", async (req, res) => {
  const id = String(req.params["id"] ?? "").trim();
  if (!id) {
    res.status(400).json({ error: "invalid_id" });
    return;
  }
  await News.findByIdAndDelete(id);
  res.json({ ok: true });
});

router.get("/stats", async (_req, res) => {
  const now = new Date();
  const start7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const [
    inquiriesCount,
    usersCount,
    adminUsersCount,
    servicesCount,
    operationsCount,
    teamMembersCount,
    careersCount,
    activeCareersCount,
    projectsCount,
    activeProjectsCount,
    newsCount,
    activeNewsCount,
    inquiriesLast7Days,
  ] = await Promise.all([
    ContactInquiry.countDocuments(),
    User.countDocuments(),
    User.countDocuments({ role: "admin" }),
    ActivityService.countDocuments(),
    ActivityOperation.countDocuments(),
    TeamMember.countDocuments(),
    CareerPost.countDocuments(),
    CareerPost.countDocuments({ active: true }),
    Project.countDocuments(),
    Project.countDocuments({ active: true }),
    News.countDocuments(),
    News.countDocuments({ active: true }),
    ContactInquiry.aggregate([
      { $match: { createdAt: { $gte: start7d } } },
      {
        $group: {
          _id: {
            y: { $year: "$createdAt" },
            m: { $month: "$createdAt" },
            d: { $dayOfMonth: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.y": 1, "_id.m": 1, "_id.d": 1 } },
    ]),
  ]);

  res.json({
    inquiriesCount,
    usersCount,
    adminUsersCount,
    servicesCount,
    operationsCount,
    teamMembersCount,
    careersCount,
    activeCareersCount,
    projectsCount,
    activeProjectsCount,
    newsCount,
    activeNewsCount,
    inquiriesLast7Days,
  });
});

router.get("/inquiries", async (_req, res) => {
  const list = await ContactInquiry.find()
    .sort({ createdAt: -1 })
    .limit(200)
    .populate("reviewedBy", "email role")
    .lean();

  res.json({
    inquiries: list.map((row) => ({
      id: String((row as any)._id),
      firstName: String((row as any).firstName ?? ""),
      lastName: String((row as any).lastName ?? ""),
      email: String((row as any).email ?? ""),
      phone: String((row as any).phone ?? ""),
      interest: String((row as any).interest ?? ""),
      destinations: String((row as any).destinations ?? ""),
      message: String((row as any).message ?? ""),
      createdAt: (row as any).createdAt,
      reviewedBy: (row as any).reviewedBy,
    })),
  });
});

router.patch("/inquiries/:id/review", async (req: AuthedRequest, res) => {
  const id = String(req.params["id"] ?? "").trim();
  if (!id) {
    res.status(400).json({ error: "invalid_id" });
    return;
  }

  const reviewerId = req.auth?.sub;
  if (!reviewerId) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }

  const updated = await ContactInquiry.findByIdAndUpdate(
    id,
    { $set: { reviewedBy: reviewerId } },
    { new: true },
  )
    .populate("reviewedBy", "email role")
    .lean();

  if (!updated) {
    res.status(404).json({ error: "not_found" });
    return;
  }

  res.json({
    inquiry: {
      id: String((updated as any)._id),
      firstName: String((updated as any).firstName ?? ""),
      lastName: String((updated as any).lastName ?? ""),
      email: String((updated as any).email ?? ""),
      phone: String((updated as any).phone ?? ""),
      interest: String((updated as any).interest ?? ""),
      destinations: String((updated as any).destinations ?? ""),
      message: String((updated as any).message ?? ""),
      createdAt: (updated as any).createdAt,
      reviewedBy: (updated as any).reviewedBy,
    },
  });
});

export default router;
