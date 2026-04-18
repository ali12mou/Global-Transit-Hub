import bcrypt from "bcryptjs";
import { User } from "../models/User";

const INTERNAL_SUFFIX = "@gtts.local";

/** Identifiant court (ex. globaltransit) → e-mail stocké ; les vrais e-mails restent inchangés. */
export function normalizeLoginEmail(raw: string): string {
  const t = raw.trim().toLowerCase();
  if (!t) return t;
  if (t.includes("@")) return t;
  return `${t}${INTERNAL_SUFFIX}`;
}

export async function upsertAdminFromEnv(): Promise<{ email: string }> {
  const raw = process.env["ADMIN_EMAIL"]?.trim() ?? "globaltransit";
  const email = normalizeLoginEmail(raw);
  const password = process.env["ADMIN_PASSWORD"] ?? "global12@";
  const passwordHash = await bcrypt.hash(password, 12);
  await User.findOneAndUpdate(
    { email },
    { email, passwordHash, role: "admin" },
    { upsert: true, new: true },
  );
  return { email };
}
