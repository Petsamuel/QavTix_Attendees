import { getGroups } from "@/actions/groups/index"
import GroupSettingsCW from "@/components/forms/GroupSettings"
import { ATTENDEE_PAGE_METADATA } from "@/lib/metadata"
import type { Metadata } from "next"
import { cookies } from "next/headers"


export const metadata: Metadata = ATTENDEE_PAGE_METADATA.GROUPS;


export default async function GroupSettingsPage() {
    const cookieStore = await cookies()
    const token = cookieStore.get("access_token")?.value

    const result = await getGroups(token)

    const groups = result.success && result.data
        && result.data ? result.data 
        : []

    return <GroupSettingsCW initialGroups={groups} />
}