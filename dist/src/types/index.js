"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZapCreateSchema = exports.SigninSchema = exports.SignupSchema = void 0;
const zod_1 = require("zod");
exports.SignupSchema = zod_1.z.object({
    email: zod_1.z.email(),
    password: zod_1.z.string().min(4),
    name: zod_1.z.string().min(4)
});
exports.SigninSchema = zod_1.z.object({
    email: zod_1.z.email(),
    password: zod_1.z.string()
});
exports.ZapCreateSchema = zod_1.z.object({
    availableTriggerId: zod_1.z.string(),
    triggerMetadata: zod_1.z.any().optional(),
    actions: zod_1.z.array(zod_1.z.object({
        actionId: zod_1.z.string(),
        availableActionMetadata: zod_1.z.any().optional()
    }))
});
