import { Router, type IRouter } from "express";
import { ActivityService } from "../models/ActivityService";
import { ActivityOperation } from "../models/ActivityOperation";
import { TeamMember } from "../models/TeamMember";

const router: IRouter = Router();

router.get("/activities/services", async (_req, res) => {
  const list = await ActivityService.find({ active: true })
    .sort({ createdAt: -1 })
    .limit(200)
    .lean();
  res.json({
    services: list.map((row) => ({
      id: String((row as any)._id),
      service: String((row as any).service ?? ""),
      description: String((row as any).description ?? ""),
      images: ((row as any).images ?? []) as string[],
      active: Boolean((row as any).active),
    })),
  });
});

router.get("/activities/operations", async (_req, res) => {
  const list = await ActivityOperation.find({ active: true })
    .sort({ createdAt: -1 })
    .limit(300)
    .lean();
  res.json({
    operations: list.map((row) => ({
      id: String((row as any)._id),
      description: String((row as any).description ?? ""),
      images: ((row as any).images ?? []) as string[],
      active: Boolean((row as any).active),
    })),
  });
});

router.get("/team", async (_req, res) => {
  const list = await TeamMember.find({ active: true }).sort({ createdAt: -1 }).limit(200).lean();
  res.json({
    members: list.map((row) => ({
      id: String((row as any)._id),
      name: String((row as any).name ?? ""),
      title: String((row as any).title ?? ""),
      description: String((row as any).description ?? ""),
      image: String((row as any).image ?? ""),
    })),
  });
});

export default router;

