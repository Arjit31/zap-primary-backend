"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const authMiddleware_1 = require("../authMiddleware");
const types_1 = require("../types");
const db_1 = require("../db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const router = (0, express_1.Router)();
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const parsedData = types_1.SignupSchema.safeParse(body);
    if (!parsedData.success) {
        res.status(400).json({ message: "invalid input" });
        return;
    }
    const isUserExist = yield db_1.prisma.user.findFirst({
        where: {
            email: parsedData.data.email,
        },
    });
    if (isUserExist) {
        res.status(400).json({ message: "user exists" });
        return;
    }
    yield db_1.prisma.user.create({
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
}));
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const parsedData = types_1.SigninSchema.safeParse(body);
    if (!parsedData.success) {
        res.status(400).json({ message: "invalid input" });
        return;
    }
    const user = yield db_1.prisma.user.findFirst({
        where: {
            email: parsedData.data.email,
            password: parsedData.data.password,
        },
    });
    if (!user) {
        res.status(400).json({ message: "wrong credentials" });
        return;
    }
    const token = jsonwebtoken_1.default.sign({
        id: user.id,
    }, config_1.JWT_PASSWORD);
    return res.json({
        token: token,
        message: "signin successful",
    });
}));
router.get("/", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const id = req.id;
    const user = yield db_1.prisma.user.findFirst({
        where: {
            id: id
        },
        select: {
            email: true,
            name: true
        }
    });
    return res.json(user);
}));
exports.userRouter = router;
