import { Router, type IRouter } from "express";
import { z } from "zod";
import { ContactInquiry } from "../models/ContactInquiry";

const router: IRouter = Router();

const bodySchema = z.object({
  firstName: z.string().min(1).max(120),
  lastName: z.string().min(1).max(120),
  email: z.string().email(),
  phone: z.string().max(40).optional().default(""),
  interest: z.string().min(1).max(80),
  destinations: z.string().max(500).optional().default(""),
  message: z.string().max(8000).optional().default(""),
});

router.post("/", async (req, res) => {
  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "invalid_body", details: parsed.error.flatten() });
    return;
  }
  const doc = await ContactInquiry.create(parsed.data);
  res.status(201).json({
    id: doc._id.toString(),
    message: "created",
  });
});

export default router;
