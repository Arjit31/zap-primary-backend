import { Router } from "express";
import { authMiddleware } from "../authMiddleware";
import { ZapCreateSchema } from "../types";
import { prisma } from "../db";

const router = Router();

router.post("/", authMiddleware, async (req, res) => {
    // @ts-ignore
    const userId = req.id;
    const body = req.body;
    const parsedData = ZapCreateSchema.safeParse(body);
    if(!parsedData.success){
        return res.status(400).json({
            message: "Invalid Input"
        })
    }
    
    const zap = await prisma.$transaction(async tx => {
        const zap = await tx.zap.create({
            data:{
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
        })
        return zap;
    })
    return res.json({zap})
})

router.get("/", authMiddleware, async (req, res) => {
    // @ts-ignore
    const userId = req.id;
    const zaps = await prisma.zap.findMany({
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
    return res.json({zaps});
    
})

router.get("/:zapId", authMiddleware, async (req, res) => {
    // @ts-ignore
    const userId = req.id;
    const zapId = req.params.zapId;
    const zap = await prisma.zap.findMany({
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
    return res.json({zap});

})

export const zapRouter = router;