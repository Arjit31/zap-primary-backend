import express from "express"
import {userRouter} from "./routers/userRouter"
import { zapRouter } from "./routers/zapRouter";
import { triggerRouter } from "./routers/triggerRouter";
import { actionRouter } from "./routers/actionRouter";
import cors from "cors"
import dotenv from "dotenv"

const app = express();
dotenv.config()

app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
    console.log("root");
    res.json("root")
})

app.use("/api/v1/user", userRouter)
app.use("/api/v1/zap", zapRouter)
app.use("/api/v1/trigger", triggerRouter)
app.use("/api/v1/action", actionRouter)

app.listen(5000, () => {
    console.log("primary-backend running on 5000");
});