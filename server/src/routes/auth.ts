import { Router } from "express";
import { prisma } from "../utils/db.js";
import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";
import { z } from "zod";

export const router = Router();

/** Strong password rules with friendly messages */
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[a-z]/, "Password must include a lowercase letter")
  .regex(/[A-Z]/, "Password must include an uppercase letter")
  .regex(/[0-9]/, "Password must include a number")
  .regex(/[^\w\s]/, "Password must include a special character");

const credsSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: passwordSchema,
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
});

/** Use numeric seconds for JWT expiry (avoids TS type complaints) */
function jwtExpiresInSeconds(): number {
  const raw = process.env.JWT_EXPIRES_IN ?? "";
  if (/^\d+$/.test(raw)) return parseInt(raw, 10);
  return 7 * 24 * 60 * 60; // default: 7 days
}

router.post("/register", async (req, res) => {
  const parsed = credsSchema.safeParse(req.body);
  if (!parsed.success) {
    const flat = parsed.error.flatten();
    return res
      .status(400)
      .json({ error: { message: "Validation failed", fieldErrors: flat.fieldErrors } });
  }

  const { email, password, name } = parsed.data;

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(409).json({ error: "Email already in use" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, passwordHash, name: name || email.split("@")[0] },
  });

  return res
    .status(201)
    .json({ id: user.id, email: user.email, name: user.name });
});

router.post("/login", async (req, res) => {
  const parsed = credsSchema
    .pick({ email: true, password: true })
    .safeParse(req.body);

  if (!parsed.success) {
    const flat = parsed.error.flatten();
    return res
      .status(400)
      .json({ error: { message: "Validation failed", fieldErrors: flat.fieldErrors } });
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const secret: Secret = process.env.JWT_SECRET || "dev_secret";

  const token = jwt.sign(
    { sub: String(user.id), email: user.email }, // subject in payload
    secret,
    { expiresIn: jwtExpiresInSeconds() }        // numeric seconds
  );

  // httpOnly cookie for convenience; client can also use Authorization: Bearer
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name },
  });
});
