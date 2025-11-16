import express from "express"
import {userRouter} from "./routers/userRouter"
import { zapRouter } from "./routers/zapRouter";
import cors from "cors"

const app = express();

app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
    console.log("root");
    res.json("root")
})
app.use("/api/v1/user", userRouter)
app.use("/api/v1/zap", zapRouter)

app.listen(5000, () => {
    console.log("primary-backend running on 5000");
});