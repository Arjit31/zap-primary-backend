"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SigninSchema = exports.SignupSchema = void 0;
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
