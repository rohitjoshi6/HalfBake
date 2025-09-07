import type { Request, Response, NextFunction } from "express";
import client from "prom-client";

export const register = new client.Registry();


client.collectDefaultMetrics({ register });

const httpDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.025, 0.05, 0.1, 0.3, 0.5, 1, 2, 5]
});
register.registerMetric(httpDuration);

function routeLabel(req: Request) {
  const raw = (req.route?.path || req.path || "");
  return raw.replace(/\/\d+/g, "/:id").replace(/[a-f0-9]{24}/gi, ":hexid");
}


export function metricsMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = process.hrtime.bigint();
  res.on("finish", () => {
    const diff = Number(process.hrtime.bigint() - start) / 1e9; // seconds
    httpDuration.labels(req.method, routeLabel(req), String(res.statusCode)).observe(diff);
  });
  next();
}

export async function metricsHandler(_req: Request, res: Response) {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
}
