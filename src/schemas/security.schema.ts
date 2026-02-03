import { z } from "zod";

export const passwordSchema = z.object({
    currentPassword: z.string()
        .min(8, 'Password must be at least 8 characters'),
    newPassword: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least 1 uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least 1 number'),
    confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Both password must match",
    path: ['confirmPassword']
})

export type  PasswordSchema = z.infer<typeof passwordSchema>