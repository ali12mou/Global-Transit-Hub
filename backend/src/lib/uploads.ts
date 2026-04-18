import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentFilePath = fileURLToPath(import.meta.url);
const currentFileDir = path.dirname(currentFilePath);

export function getUploadsDir(): string {
  if (process.env["UPLOAD_DIR"]?.trim()) {
    return path.resolve(process.env["UPLOAD_DIR"]!.trim());
  }
  // Default to backend/uploads relative to this file,
  // even if the process is started from a different cwd.
  return path.resolve(currentFileDir, "../../uploads");
}

export function ensureUploadsDir(): string {
  const dir = getUploadsDir();
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

