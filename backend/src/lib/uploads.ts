import fs from "node:fs";
import path from "node:path";

export function getUploadsDir(): string {
  // When started via `pnpm -C backend`, cwd is backend/
  return process.env["UPLOAD_DIR"] ?? path.resolve(process.cwd(), "uploads");
}

export function ensureUploadsDir(): string {
  const dir = getUploadsDir();
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

