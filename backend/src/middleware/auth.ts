import type { Request, Response, NextFunction } from "express";
import { verifyAuthToken, cookieName, type JwtPayload } from "../lib/jwt";

export type AuthedRequest = Request & { auth?: JwtPayload };

function readToken(req: Request): string | undefined {
  const c = req.cookies?.[cookieName];
  if (typeof c === "string" && c.length > 0) return c;
  const h = req.headers.authorization;
  if (h?.startsWith("Bearer ")) return h.slice(7);
  return undefined;
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const token = readToken(req);
  if (!token) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }
  try {
    req.auth = verifyAuthToken(token);
    next();
  } catch {
    res.status(401).json({ error: "invalid_token" });
  }
}

export function requireAdmin(req: AuthedRequest, res: Response, next: NextFunction) {
  const token = readToken(req);
  if (!token) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }
  try {
    const payload = verifyAuthToken(token);
    if (payload.role !== "admin") {
      res.status(403).json({ error: "forbidden" });
      return;
    }
    req.auth = payload;
    next();
  } catch {
    res.status(401).json({ error: "invalid_token" });
  }
}

export function optionalAuth(req: AuthedRequest, _res: Response, next: NextFunction) {
  const token = readToken(req);
  if (!token) {
    next();
    return;
  }
  try {
    req.auth = verifyAuthToken(token);
  } catch {
    /* ignore */
  }
  next();
}
