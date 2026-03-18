import { notFound } from "next/navigation"
import EditGroupForm from "@/components/forms/EditGroupForm"
import { space_grotesk } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { getGroups } from "@/actions/groups"

interface Props {
    params: Promise<{ group_id: string }>
}

export default async function EditGroupPage({ params }: Props) {

    const { group_id } = await params;
    const result = await getGroups()

    if (!result.success || !result.data) {
        notFound()
    }

    const group = result.data.results.find(v => v.id === group_id)

    if (!group) {
        notFound()
    }

    const initialData = {
        name:    group.name,
        members: group.members.map(m => m.email),
    }

    return (
        <main className="w-full pt-8 pb-16 space-y-12">
            <h2 className={cn(space_grotesk.className, "text-lg font-bold text-brand-secondary-9")}>
                Edit Group
            </h2>
            <EditGroupForm groupID={group.id!} initialData={initialData!} />
        </main>
    )
}