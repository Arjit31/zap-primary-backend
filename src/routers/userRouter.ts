import { Router } from "express";
import { authMiddleware } from "../authMiddleware";
import { SigninSchema, SignupSchema } from "../types";
import { prisma } from "../db";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../config";
import bcrypt from "bcryptjs";

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
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(parsedData.data.password, salt);
    await prisma.user.create({
        data: {
            email: parsedData.data.email,
            password: hash,
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
        },
    });
    const isPasswordCorrect = await bcrypt.compare(
        parsedData.data.password,
        user?.password + ""
    );
    if (!user || !isPasswordCorrect) {
        res.status(400).json({ message: "wrong credentials" });
        return;
    }
    const token = jwt.sign(
        {
            id: user.id,
        },
        JWT_PASSWORD
    );
    // res.cookie("token", token, {
    //     httpOnly: true,
    //     secure: true,
    //     sameSite: "none",
    //     maxAge: 24 * 60 * 60 * 1000,
    //     path: "/"
    // });
    res.setHeader(
        'Set-Cookie',
        `token=${token}; HttpOnly; Secure; SameSite=None; Partitioned; Max-Age=${24 * 60 * 60}; Path=/`
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
            id: id,
        },
        select: {
            email: true,
            name: true,
        },
    });
    return res.json(user);
});

router.get("/auth", authMiddleware, async (req, res) => {
    res.json({
        message: "Authorised",
    }).status(200);
});

export const userRouter = router;
