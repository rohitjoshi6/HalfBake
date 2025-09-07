// import express from "express";
// import helmet from "helmet";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import rateLimit from "express-rate-limit";
// import pinoHttp from "pino-http";
// import { router as auth } from "./routes/auth.js";
// import { router as ideas } from "./routes/ideas.js";

// export function createServer() {
//   const app = express();
//   app.use(helmet());
//   app.use(express.json());
//   app.use(cookieParser());
//   app.use(pinoHttp());
//   app.use(cors({
//     origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
//     credentials: true,
//   }));
//   app.use(rateLimit({ windowMs: 60_000, max: 120 }));

//   app.get("/health", (_req, res) => res.json({ ok: true }));

//   app.use("/api/auth", auth);
//   app.use("/api/ideas", ideas);

//   app.use((_req, res) => res.status(404).json({ error: "Not found" }));
//   app.use((err: any, _req: any, res: any, _next: any) => {
//     console.error(err);
//     res.status(500).json({ error: "Internal Server Error" });
//   });

//   return app;
// }

// server/src/server.ts
import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import pinoHttp from "pino-http";
import { router as auth } from "./routes/auth.js";
import { router as ideas } from "./routes/ideas.js";
// ADD:
import { metricsMiddleware, metricsHandler } from "./metrics.js";

export function createServer() {
  const app = express();
  app.use(helmet());
  app.use(express.json());
  app.use(cookieParser());
  app.use(pinoHttp());
  app.use(cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  }));
  app.use(rateLimit({ windowMs: 60_000, max: 120 }));

  // ADD: metrics
  app.use(metricsMiddleware);
  app.get("/metrics", metricsHandler);

  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.use("/api/auth", auth);
  app.use("/api/ideas", ideas);

  app.use((_req, res) => res.status(404).json({ error: "Not found" }));
  app.use((err: any, _req: any, res: any, _next: any) => {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  });

  return app;
}
