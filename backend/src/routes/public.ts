import { Router, type IRouter } from "express";
import { ActivityService } from "../models/ActivityService";
import { ActivityOperation } from "../models/ActivityOperation";
import { TeamMember } from "../models/TeamMember";
import { CareerPost } from "../models/CareerPost";
import { Project } from "../models/Project";

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

router.get("/careers", async (_req, res) => {
  const list = await CareerPost.find({ active: true }).sort({ createdAt: -1 }).limit(200).lean();
  res.json({
    careers: list.map((row) => ({
      id: String((row as any)._id),
      title: String((row as any).title ?? ""),
      location: String((row as any).location ?? ""),
      contractType: String((row as any).contractType ?? ""),
      description: String((row as any).description ?? ""),
      applyEmail: String((row as any).applyEmail ?? ""),
      createdAt: (row as any).createdAt,
    })),
  });
});

router.get("/projects", async (_req, res) => {
  const list = await Project.find({ active: true }).sort({ createdAt: -1 }).limit(300).lean();
  res.json({
    projects: list.map((row) => ({
      id: String((row as any)._id),
      title: String((row as any).title ?? ""),
      category: String((row as any).category ?? ""),
      description: String((row as any).description ?? ""),
      image: String((row as any).image ?? ""),
      featured: Boolean((row as any).featured),
      createdAt: (row as any).createdAt,
    })),
  });
});

export default router;

