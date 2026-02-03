import * as z from "zod";

export const profileSchema = z.object({
    fullName: z.string().min(3, "Full name must be at least 3 characters"),
    email: z.email("Invalid email address"),
    phoneNumber: z.string().min(10, "Phone number is too short"),
    dob: z.string().min(1, "Date of birth is required"),
    gender: z.string().min(1, "Please select a gender"),
    country: z.string().min(1, "Country is required"),
    state: z.string().min(1, "State is required"),
    city: z.string().min(1, "City is required"),
    profileImage:  z.instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, "Max size is 10MB").optional(),
})

export type ProfileFormValues = z.infer<typeof profileSchema>;