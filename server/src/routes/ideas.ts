import { Router } from "express";
import { prisma } from "../utils/db.js";
import { z } from "zod";
import { requireAuth, AuthRequest } from "../middleware/auth.js";

export const router = Router();

const ideaSchema = z.object({
  title: z.string().min(3),
  summary: z.string().min(10),
  description: z.string().optional(),
  repoUrl: z.string().url().optional(),
  tags: z.array(z.string()).default([]),
  status: z.enum(["DRAFT", "LOOKING_FOR_HELP", "IN_PROGRESS", "COMPLETED"]).optional()
});

router.get("/", async (req, res) => {
  const q = String(req.query.q || "");
  const tag = String(req.query.tag || "");
  const where: any = {};
  if (q) where.OR = [{ title: { contains: q } }, { summary: { contains: q } }];
  if (tag) where.tags = { some: { tag: { name: tag } } };
  const ideas = await prisma.idea.findMany({
    where,
    include: { tags: { include: { tag: true } }, owner: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
    take: 50
  });
  res.json(ideas);
});

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const idea = await prisma.idea.findUnique({
    where: { id },
    include: { tags: { include: { tag: true } }, owner: { select: { id: true, name: true } }, comments: { include: { author: true } } }
  });
  if (!idea) return res.status(404).json({ error: "Not found" });
  res.json(idea);
});

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  const parsed = ideaSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { title, summary, description, tags, status, repoUrl } = parsed.data;
  const created = await prisma.idea.create({
    data: {
      title, summary, description, repoUrl, status: status || "LOOKING_FOR_HELP", ownerId: req.user!.id,
      tags: {
        create: await Promise.all((tags || []).map(async (name) => ({
          tag: { connectOrCreate: { where: { name }, create: { name } } }
        })))
      }
    },
    include: { tags: { include: { tag: true } } }
  });
  res.status(201).json(created);
});

router.post("/:id/upvote", requireAuth, async (req: AuthRequest, res) => {
  const id = Number(req.params.id);
  const updated = await prisma.idea.update({ where: { id }, data: { upvotes: { increment: 1 } } });
  res.json({ ok: true, upvotes: updated.upvotes });
});
