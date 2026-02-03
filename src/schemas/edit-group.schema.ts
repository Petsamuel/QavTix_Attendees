import * as z from "zod";

export const editGroupSchema = z.object({
    name: z.string().min(2, "Group name is too short"),
    members: z.array(z.email("Invalid email address"))
        .min(1, "Please add at least one member")
})

export type EditGroupFormValues = z.infer<typeof editGroupSchema>;