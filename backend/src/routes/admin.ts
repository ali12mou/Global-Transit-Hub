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
import { Role } from "../models/Role";
import { Permission } from "../models/Permission";
import { requireAdmin, type AuthedRequest } from "../middleware/auth";
import { ensureUploadsDir } from "../lib/uploads";

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
  const urls = files.map((f) => `/uploads/${f.filename}`);
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

router.get("/activity-services", async (_req, res) => {
  const list = await ActivityService.find().sort({ createdAt: -1 }).limit(500).lean();
  res.json({
    services: list.map((row) => ({
      id: String((row as any)._id),
      service: String((row as any).service ?? ""),
      description: String((row as any).description ?? ""),
      images: ((row as any).images ?? []) as string[],
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

router.get("/activity-operations", async (_req, res) => {
  const list = await ActivityOperation.find().sort({ createdAt: -1 }).limit(800).lean();
  res.json({
    operations: list.map((row) => ({
      id: String((row as any)._id),
      description: String((row as any).description ?? ""),
      images: ((row as any).images ?? []) as string[],
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

router.get("/team-members", async (_req, res) => {
  const list = await TeamMember.find().sort({ createdAt: -1 }).limit(500).lean();
  res.json({
    members: list.map((row) => ({
      id: String((row as any)._id),
      name: String((row as any).name ?? ""),
      title: String((row as any).title ?? ""),
      description: String((row as any).description ?? ""),
      image: String((row as any).image ?? ""),
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

router.get("/stats", async (_req, res) => {
  const [inquiriesCount, usersCount, adminUsersCount] = await Promise.all([
    ContactInquiry.countDocuments(),
    User.countDocuments(),
    User.countDocuments({ role: "admin" }),
  ]);
  res.json({ inquiriesCount, usersCount, adminUsersCount });
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
