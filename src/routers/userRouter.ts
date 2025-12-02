import { Router } from "express";
import { authMiddleware } from "../authMiddleware";
import { SigninSchema, SignupSchema } from "../types";
import { prisma } from "../db";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../config";

const router = Router();

router.post("/signup", async (req, res) => {
    const body = req.body;
    const parsedData = SignupSchema.safeParse(body);
    if (!parsedData.success) {
        res.status(400).json({ message: "invalid input" });
        return;
    }
    console.log(body, parsedData);
    const isUserExist = await prisma.user.findFirst({
        where: {
            email: parsedData.data.email,
        },
    });
    console.log(body, parsedData);
    if (isUserExist) {
        res.status(400).json({ message: "user exists" });
        return;
    }
    await prisma.user.create({
        data: {
            email: parsedData.data.email,
            // hash the password
            password: parsedData.data.password,
            name: parsedData.data.name,
        },
    });
    res.json({
        message: "Please verify your account by your email",
    });
});

router.post("/signin", async (req, res) => {
    const body = req.body;
    const parsedData = SigninSchema.safeParse(body);
    if (!parsedData.success) {
        res.status(400).json({ message: "invalid input" });
        return;
    }
    const user = await prisma.user.findFirst({
        where: {
            email: parsedData.data.email,
            password: parsedData.data.password,
        },
    });
    if (!user) {
        res.status(400).json({ message: "wrong credentials" });
        return;
    }
    const token = jwt.sign(
        {
            id: user.id,
        },
        JWT_PASSWORD
    );

    return res.json({
        token: token,
        message: "signin successful",
    });
});

router.get("/", authMiddleware, async (req, res) => {
    //@ts-ignore
    const id = req.id;
    const user = await prisma.user.findFirst({
        where: {
            id: id
        },
        select: {
            email: true,
            name: true
        }
    })
    return res.json(user);
});

export const userRouter = router;
