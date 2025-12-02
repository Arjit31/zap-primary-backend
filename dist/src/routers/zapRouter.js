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
Object.defineProperty(exports, "__esModule", { value: true });
exports.zapRouter = void 0;
const express_1 = require("express");
const authMiddleware_1 = require("../authMiddleware");
const types_1 = require("../types");
const db_1 = require("../db");
const router = (0, express_1.Router)();
router.post("/", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const userId = req.id;
    const body = req.body;
    const parsedData = types_1.ZapCreateSchema.safeParse(body);
    if (!parsedData.success) {
        return res.status(400).json({
            message: "Invalid Input"
        });
    }
    const zap = yield db_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const zap = yield tx.zap.create({
            data: {
                userId: userId,
                triggers: {
                    create: {
                        typeId: parsedData.data.availableTriggerId
                    }
                },
                actions: {
                    // if we just use () => {} then we need to explicitly return inside the {} block
                    // but in case of () => ({}) it simply returns the block as an object
                    create: parsedData.data.actions.map((action, ind) => ({
                        typeId: action.actionId,
                        sortOrder: ind
                    }))
                }
            }
        });
        return zap;
    }));
    return res.json({ zap });
}));
router.get("/", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const userId = req.id;
    const zaps = yield db_1.prisma.zap.findMany({
        where: {
            userId: userId
        },
        include: {
            actions: {
                include: {
                    type: true
                }
            }, triggers: {
                include: {
                    type: true
                }
            }
        }
    });
    return res.json({ zaps });
}));
router.get("/:zapId", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const userId = req.id;
    const zapId = req.params.zapId;
    const zap = yield db_1.prisma.zap.findMany({
        where: {
            id: zapId,
            userId: userId
        },
        include: {
            actions: {
                include: {
                    type: true
                }
            }, triggers: {
                include: {
                    type: true
                }
            }
        }
    });
    return res.json({ zap });
}));
exports.zapRouter = router;
