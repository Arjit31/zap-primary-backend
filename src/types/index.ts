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