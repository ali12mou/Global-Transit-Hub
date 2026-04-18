import mongoose from "mongoose";
import type { Request } from "express";
import { Upload } from "../models/Upload";
import { toPublicUrl } from "./publicUrl";

type UploadLean = { _id: mongoose.Types.ObjectId; path: string };

/** Accepte /uploads/x, uploads/x ou URL absolue vers /uploads/… */
export function normalizeStoragePath(s: string): string {
  const t = String(s ?? "").trim();
  if (!t) return "";
  if (t.startsWith("/uploads/")) return t.split("?")[0];
  if (t.startsWith("http://") || t.startsWith("https://")) {
    try {
      const u = new URL(t);
      if (u.pathname.startsWith("/uploads/")) return u.pathname.split("?")[0];
    } catch {
      return "";
    }
  }
  if (t.startsWith("uploads/")) return `/${t.split("?")[0]}`;
  return "";
}

export async function ensureUploadForPath(
  path: string,
  meta?: { originalName?: string; mimeType?: string; size?: number },
): Promise<mongoose.Types.ObjectId> {
  const p = normalizeStoragePath(path);
  if (!p.startsWith("/uploads/")) {
    throw new Error("invalid_upload_path");
  }
  const existing = (await Upload.findOne({ path: p }).lean()) as UploadLean | null;
  if (existing?._id) return existing._id;
  try {
    const doc = await Upload.create({
      path: p,
      originalName: meta?.originalName ?? "",
      mimeType: meta?.mimeType ?? "application/octet-stream",
      size: meta?.size ?? 0,
    });
    return doc._id as mongoose.Types.ObjectId;
  } catch (e: unknown) {
    const code = (e as { code?: number })?.code;
    if (code === 11000) {
      const again = (await Upload.findOne({ path: p }).lean()) as UploadLean | null;
      if (again?._id) return again._id;
    }
    throw e;
  }
}

/** Tableau d’URL / chemins (admin) → ObjectIds Upload */
export async function pathsToUploadIds(paths: string[]): Promise<mongoose.Types.ObjectId[]> {
  const ids: mongoose.Types.ObjectId[] = [];
  for (const raw of paths) {
    const p = normalizeStoragePath(String(raw));
    if (!p) continue;
    ids.push(await ensureUploadForPath(p, {}));
  }
  return ids;
}

/** Valeurs en base : ObjectId et/ou chaînes legacy → URLs publiques */
export async function expandUploadRefsToUrls(req: Request, raw: unknown): Promise<string[]> {
  const list = Array.isArray(raw) ? raw : [];
  const out: string[] = [];
  for (const item of list) {
    if (item == null) continue;
    if (mongoose.isValidObjectId(item)) {
      const u = (await Upload.findById(item).lean()) as UploadLean | null;
      if (u?.path) out.push(toPublicUrl(req, u.path));
      continue;
    }
    const str = String(item).trim();
    if (!str) continue;
    if (mongoose.isValidObjectId(str)) {
      const u = (await Upload.findById(str).lean()) as UploadLean | null;
      if (u?.path) out.push(toPublicUrl(req, u.path));
      continue;
    }
    const p = normalizeStoragePath(str);
    if (p.startsWith("/uploads/")) out.push(toPublicUrl(req, p));
  }
  return out;
}

/** Un seul champ image (équipe, projet) */
export async function expandUploadRefToUrl(req: Request, raw: unknown): Promise<string> {
  if (raw == null || raw === "") return "";
  if (mongoose.isValidObjectId(raw)) {
    const u = (await Upload.findById(raw).lean()) as UploadLean | null;
    return u?.path ? toPublicUrl(req, u.path) : "";
  }
  const str = String(raw).trim();
  if (mongoose.isValidObjectId(str)) {
    const u = (await Upload.findById(str).lean()) as UploadLean | null;
    return u?.path ? toPublicUrl(req, u.path) : "";
  }
  const p = normalizeStoragePath(str);
  return p.startsWith("/uploads/") ? toPublicUrl(req, p) : "";
}

export async function pathToUploadIdOrEmpty(path: string): Promise<mongoose.Types.ObjectId | null> {
  const p = normalizeStoragePath(path);
  if (!p.startsWith("/uploads/")) return null;
  try {
    return await ensureUploadForPath(p, {});
  } catch {
    return null;
  }
}
