import { Router } from "express";
import { authMiddleware } from "../authMiddleware";

const router = Router();

router.post("/", authMiddleware, (req, res) => {
    console.log("zap post router")
})

router.get("/", authMiddleware, (req, res) => {
    console.log("all zap get router")
    
})

router.get("/:zapId", authMiddleware, (req, res) => {
    console.log("zap get router")

})

export const zapRouter = router;