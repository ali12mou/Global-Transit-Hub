import { Router, type IRouter, type Request } from "express";
import { ActivityService } from "../models/ActivityService";
import { ActivityOperation } from "../models/ActivityOperation";
import { TeamMember } from "../models/TeamMember";
import { CareerPost } from "../models/CareerPost";
import { Project } from "../models/Project";
import { News } from "../models/News";
import { Client } from "../models/Client";
import { Partner } from "../models/Partner";
import { toPublicUrl } from "../lib/publicUrl";

const router: IRouter = Router();

router.get("/activities/services", async (req, res) => {
  const list = await ActivityService.find({ active: true })
    .sort({ createdAt: -1 })
    .limit(200)
    .lean();
  res.json({
    services: list.map((row) => ({
      id: String((row as any)._id),
      service: String((row as any).service ?? ""),
      description: String((row as any).description ?? ""),
      images: (((row as any).images ?? []) as string[]).map((src) => toPublicUrl(req, src)),
      active: Boolean((row as any).active),
    })),
  });
});

router.get("/activities/operations", async (req, res) => {
  const list = await ActivityOperation.find({ active: true })
    .sort({ createdAt: -1 })
    .limit(300)
    .lean();
  res.json({
    operations: list.map((row) => ({
      id: String((row as any)._id),
      description: String((row as any).description ?? ""),
      images: (((row as any).images ?? []) as string[]).map((src) => toPublicUrl(req, src)),
      active: Boolean((row as any).active),
    })),
  });
});

router.get("/team", async (req, res) => {
  const list = await TeamMember.find({ active: true }).sort({ createdAt: -1 }).limit(200).lean();
  res.json({
    members: list.map((row) => ({
      id: String((row as any)._id),
      name: String((row as any).name ?? ""),
      title: String((row as any).title ?? ""),
      description: String((row as any).description ?? ""),
      image: toPublicUrl(req, String((row as any).image ?? "")),
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

router.get("/projects", async (req, res) => {
  const list = await Project.find({ active: true }).sort({ createdAt: -1 }).limit(300).lean();
  res.json({
    projects: list.map((row) => ({
      id: String((row as any)._id),
      title: String((row as any).title ?? ""),
      category: String((row as any).category ?? ""),
      description: String((row as any).description ?? ""),
      image: toPublicUrl(req, String((row as any).image ?? "")),
      featured: Boolean((row as any).featured),
      createdAt: (row as any).createdAt,
    })),
  });
});

router.get("/clients", async (req, res) => {
  const list = await Client.find({ active: true }).sort({ createdAt: -1 }).limit(300).lean();
  res.json({
    clients: list.map((row) => ({
      id: String((row as any)._id),
      name: String((row as any).name ?? ""),
      images: (((row as any).images ?? []) as string[]).map((src) => toPublicUrl(req, src)),
      createdAt: (row as any).createdAt,
    })),
  });
});

router.get("/partners", async (req, res) => {
  const list = await Partner.find({ active: true }).sort({ type: 1, createdAt: -1 }).limit(300).lean();
  res.json({
    partners: list.map((row) => ({
      id: String((row as any)._id),
      name: String((row as any).name ?? ""),
      type: String((row as any).type ?? ""),
      images: (((row as any).images ?? []) as string[]).map((src) => toPublicUrl(req, src)),
      createdAt: (row as any).createdAt,
    })),
  });
});

router.get("/news", async (req, res) => {
  const list = await News.find({ active: true }).sort({ publishedAt: -1, createdAt: -1 }).limit(200).lean();
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
      createdAt: (row as any).createdAt,
    })),
  });
});

export default router;

