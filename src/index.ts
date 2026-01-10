import express, { NextFunction, Request, Response } from "express";
import { userRouter } from "./routers/userRouter";
import { zapRouter } from "./routers/zapRouter";
import { triggerRouter } from "./routers/triggerRouter";
import { actionRouter } from "./routers/actionRouter";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();

console.log(process.env.FRONTEND_URL);

const corsOptions = {
    credentials: true,
    origin: process.env.FRONTEND_URL,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

app.get("/", (req, res) => {
    console.log("pinged");
    console.log(process.env.FRONTEND_URL)
    res.status(200).send("OK");
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/zap", zapRouter);
app.use("/api/v1/trigger", triggerRouter);
app.use("/api/v1/action", actionRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send("Internal Server Error");
});

app.listen(5000, () => {
    console.log("primary-backend running on 5000");
});
