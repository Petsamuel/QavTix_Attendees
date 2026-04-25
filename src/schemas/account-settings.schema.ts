import * as z from "zod";

export const profileSchema = z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.email("Invalid email address"),
    phoneNumber: z.string().min(7, "Phone number is required"),
    dob: z.date({ error: "Date of birth is required" }),
    gender: z.string().min(1, "Gender is required"),
    country: z.string().min(1, "Country is required"),
    state: z.string().min(1, "State is required"),
    city: z.string().min(1, "City is required"),
    // Accepts a File (new upload) or a string URL (existing from server)
    profileImage: z.union([z.instanceof(File), z.string()]).optional(),
})

export type ProfileFormValues = z.infer<typeof profileSchema>;