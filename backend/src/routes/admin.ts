import { Router, type IRouter } from "express";
import multer from "multer";
import path from "node:path";
import crypto from "node:crypto";
import { ContactInquiry } from "../models/ContactInquiry";
import { User } from "../models/User";
import { ActivityService } from "../models/ActivityService";
import { ActivityOperation } from "../models/ActivityOperation";
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
