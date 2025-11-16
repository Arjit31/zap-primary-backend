import { Router } from "express";
import { authMiddleware } from "../authMiddleware";

const router = Router();

router.post("/signup", (req, res) => {
    console.log("user signup route")
})

router.post("/signin", (req, res) => {
    console.log("user signin route")
})

router.get("/:userId", authMiddleware, (req, res) => {
    console.log("user info route")
    res.json("hi")
})

export const userRouter = router;