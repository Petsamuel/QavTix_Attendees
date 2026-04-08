import * as z from "zod";

export const profileSchema = z.object({
    fullName:     z.string().min(2, "Full name must be at least 2 characters"),
    email:        z.email("Invalid email address"),
    phoneNumber:  z.string().min(7, "Phone number is too short"),
    dob:          z.date().nullable(),
    gender:       z.string(),
    country:      z.string().min(1, "Country is required"),
    state:        z.string(),
    city:         z.string(),
    // Accepts a File (new upload) or a string URL (existing from server)
    profileImage: z.union([z.instanceof(File), z.string()]).optional(),
})
 
export type ProfileFormValues = z.infer<typeof profileSchema>;