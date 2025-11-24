import {z} from "zod"

export const SignupSchema = z.object({
    email: z.email(),
    password: z.string().min(4),
    name: z.string().min(4)
})

export const SigninSchema = z.object({
    email: z.email(),
    password: z.string()
})

export const ZapCreateSchema = z.object({
    availableTriggerId: z.string(),
    triggerMetadata: z.any().optional(),
    actions: z.array(z.object({
        actionId: z.string(),
        availableActionMetadata: z.any().optional()
    }))
})