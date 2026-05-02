import { handleApiError } from "@/helper-fns/handleApiErrors"
import { GET_GROUPS_ENDPOINT } from "@/endpoints"
import { CACHE_TAGS } from "@/cache-tags"

export interface GroupMemberItem {
    email: string
}

export interface Group {
    id: string
    name: string
    member_count: string
    members: GroupMemberItem[]
}

interface GroupsResult {
    success: boolean
    data?: Group[]
    message?: string
}

export async function getGroups(token: string | undefined): Promise<GroupsResult> {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${GET_GROUPS_ENDPOINT}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                next: { tags: [CACHE_TAGS.GROUPS], revalidate: 300 }
            }
        )

        if (!res.ok) {
            const json = await res.json()
            return { success: false, message: handleApiError(json) }
        }

        const json = await res.json()
        const raw = json.data ?? json
        const groups = Array.isArray(raw) ? raw : []

        return { success: true, data: groups }
    } catch (error: any) {
        return { success: false, message: "Failed to load groups." }
    }
}