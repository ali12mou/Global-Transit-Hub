import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { User } from "../models/User";
import { signAuthToken, cookieName } from "../lib/jwt";
import { normalizeLoginEmail } from "../lib/adminUser";
import { optionalAuth, type AuthedRequest } from "../middleware/auth";

const router: IRouter = Router();

const loginBody = z.object({
  email: z.string().trim().min(1).max(320),
  password: z.string().min(1),
});

const isProd = process.env["NODE_ENV"] === "production";
const cookieOpts = {
  httpOnly: true,
  secure: isProd,
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

router.post("/login", async (req, res) => {
  const parsed = loginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "invalid_body" });
    return;
  }
  const { email: loginId, password } = parsed.data;
  const email = normalizeLoginEmail(loginId);
  const user = await User.findOne({ email });
  if (!user) {
    res.status(401).json({ error: "invalid_credentials" });
    return;
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    res.status(401).json({ error: "invalid_credentials" });
    return;
  }
  const token = signAuthToken({
    sub: user._id.toString(),
    role: user.role as "admin" | "user",
  });
  res.cookie(cookieName, token, cookieOpts);
  res.json({
    user: { id: user._id.toString(), email: user.email, role: user.role },
  });
});

router.post("/logout", (_req, res) => {
  res.clearCookie(cookieName, { path: "/", httpOnly: true, secure: isProd, sameSite: "lax" });
  res.json({ ok: true });
});

router.get("/me", optionalAuth, async (req: AuthedRequest, res) => {
  if (!req.auth) {
    res.json({ user: null });
    return;
  }
  const u = await User.findById(req.auth.sub).lean();
  if (!u) {
    res.json({ user: null });
    return;
  }
  res.json({
    user: { id: req.auth.sub, email: u.email, role: u.role },
  });
});

export default router;
