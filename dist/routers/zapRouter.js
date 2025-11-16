"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zapRouter = void 0;
const express_1 = require("express");
const authMiddleware_1 = require("../authMiddleware");
const router = (0, express_1.Router)();
router.post("/", authMiddleware_1.authMiddleware, (req, res) => {
    console.log("zap post router");
});
router.get("/", authMiddleware_1.authMiddleware, (req, res) => {
    console.log("all zap get router");
});
router.get("/:zapId", authMiddleware_1.authMiddleware, (req, res) => {
    console.log("zap get router");
});
exports.zapRouter = router;
