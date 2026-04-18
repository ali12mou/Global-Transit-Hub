import jwt from "jsonwebtoken";

const cookieName = "gtt_auth";

export function getJwtSecret(): string {
  const s = process.env["JWT_SECRET"];
  if (s && s.length >= 16) return s;
  if (process.env["NODE_ENV"] === "production") {
    throw new Error("JWT_SECRET must be set (min 16 chars) in production");
  }
  return "dev-only-change-me-please";
}

export type JwtPayload = {
  sub: string;
  role: "admin" | "user";
};

export function signAuthToken(payload: JwtPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
}

export function verifyAuthToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, getJwtSecret());
  if (typeof decoded !== "object" || decoded === null) {
    throw new Error("Invalid token");
  }
  const { sub, role } = decoded as Record<string, unknown>;
  if (typeof sub !== "string" || (role !== "admin" && role !== "user")) {
    throw new Error("Invalid token payload");
  }
  return { sub, role };
}

export { cookieName };
