import { Router, type IRouter, type Request } from "express";
import { ActivityService } from "../models/ActivityService";
import { ActivityOperation } from "../models/ActivityOperation";
import { TeamMember } from "../models/TeamMember";
import { CareerPost } from "../models/CareerPost";
import { Project } from "../models/Project";

function toPublicUrl(req: Request, src: string) {
  const url = String(src ?? "").trim();
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  const host = req.get("host") ?? "127.0.0.1:8080";
  const protocol = req.protocol || "http";
  return `${protocol}://${host}${url}`;
}

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

export default router;

