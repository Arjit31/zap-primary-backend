import { Router } from "express";
import { authMiddleware } from "../authMiddleware";
import { prisma } from "../db";

const router = Router();

router.get("/available", async (req, res) => {
    const availableTriggers = await prisma.availableTrigger.findMany({});
    res.json(availableTriggers);
})

export const triggerRouter = router;