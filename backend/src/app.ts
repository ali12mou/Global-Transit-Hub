import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import { ensureUploadsDir } from "./lib/uploads";

const app: Express = express();

app.set("trust proxy", true);

const frontendOrigins = (
  process.env["FRONTEND_ORIGIN"] ?? "http://127.0.0.1:5173,http://localhost:5173"
)
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const isDev = process.env["NODE_ENV"] !== "production";
const localDevOriginRegex = /^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/;

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) {
        cb(null, true);
        return;
      }
      if (frontendOrigins.includes(origin)) {
        cb(null, true);
        return;
      }
      if (isDev && localDevOriginRegex.test(origin)) {
        cb(null, true);
        return;
      }
      cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads (admin CMS images)
const uploadsDir = ensureUploadsDir();
app.use("/uploads", express.static(uploadsDir, { maxAge: "7d", fallthrough: true }));

app.use("/api", router);

export default app;
