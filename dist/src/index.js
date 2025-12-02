"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRouter_1 = require("./routers/userRouter");
const zapRouter_1 = require("./routers/zapRouter");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get("/", (req, res) => {
    console.log("root");
    res.json("root");
});
app.use("/api/v1/user", userRouter_1.userRouter);
app.use("/api/v1/zap", zapRouter_1.zapRouter);
app.listen(5000, () => {
    console.log("primary-backend running on 5000");
});
