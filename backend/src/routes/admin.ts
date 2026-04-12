import { Router, type IRouter } from "express";
import { ContactInquiry } from "../models/ContactInquiry";
import { requireAdmin } from "../middleware/auth";

const router: IRouter = Router();

router.use(requireAdmin);

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

export default router;
