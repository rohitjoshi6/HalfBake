import type { Request, Response, NextFunction } from "express";
import jwt, { Secret, JwtPayload } from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: { id: number; email: string };
}

interface Payload extends JwtPayload {
  sub?: string;         // user id as string
  email?: string;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const bearer = req.headers.authorization?.split(" ")[1];
  const token = req.cookies?.token || bearer;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const secret: Secret = process.env.JWT_SECRET || "dev_secret";
    const decoded = jwt.verify(token, secret) as Payload | string;

    if (typeof decoded === "string" || !decoded.sub || !decoded.email) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = { id: Number(decoded.sub), email: decoded.email };
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}
