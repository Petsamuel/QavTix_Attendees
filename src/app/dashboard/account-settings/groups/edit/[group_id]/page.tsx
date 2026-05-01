import { notFound } from "next/navigation"
import EditGroupForm from "@/components/forms/EditGroupForm"
import { space_grotesk } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { getGroups } from "@/actions/groups/index"
import { cookies } from "next/headers"


interface Props {
    params: Promise<{ group_id: string }>
}

export default async function EditGroupPage({ params }: Props) {

    const { group_id } = await params;
    const cookieStore = await cookies()
    const token = cookieStore.get("access_token")?.value

    const result = await getGroups(token)

    if (!result.success || !result.data) {
        notFound()
    }

    const group = result.data.find(v => v.id === group_id)

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