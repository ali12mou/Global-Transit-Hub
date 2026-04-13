import { Router, type IRouter } from "express";
import { ContactInquiry } from "../models/ContactInquiry";
import { User } from "../models/User";
import { requireAdmin } from "../middleware/auth";

const router: IRouter = Router();

router.use(requireAdmin);

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
      id: row._id.toString(),
      firstName: row.firstName,
      lastName: row.lastName,
      email: row.email,
      phone: row.phone,
      interest: row.interest,
      destinations: row.destinations,
      message: row.message,
      createdAt: row.createdAt,
      reviewedBy: row.reviewedBy,
    })),
  });
});

router.patch("/inquiries/:id/review", async (req, res) => {
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
      id: updated._id.toString(),
      firstName: updated.firstName,
      lastName: updated.lastName,
      email: updated.email,
      phone: updated.phone,
      interest: updated.interest,
      destinations: updated.destinations,
      message: updated.message,
      createdAt: updated.createdAt,
      reviewedBy: updated.reviewedBy,
    },
  });
});

export default router;
