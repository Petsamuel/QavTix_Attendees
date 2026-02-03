import { z } from "zod";

export const addAccountSchema = z.object({
    bank_name: z.string().min(1, "Bank name is required"),
    account_number: z.string().min(1, "Account number is required").length(10, "Account number must be 10 digits"),
    account_name: z.string().min(1, "Account name is required")
})

export type AddAccountSchemaType = z.infer<typeof addAccountSchema>;