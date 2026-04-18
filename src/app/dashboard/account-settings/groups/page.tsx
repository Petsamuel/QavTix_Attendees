import { getGroups } from "@/actions/groups"
import GroupSettingsCW from "@/components/forms/GroupSettings"
import { ATTENDEE_PAGE_METADATA } from "@/lib/metadata"
import type { Metadata } from "next"


export const metadata: Metadata = ATTENDEE_PAGE_METADATA.GROUPS;


export default async function GroupSettingsPage() {
    const result = await getGroups()

    const groups = result.success && result.data
        && result.data ? result.data 
        : []

    return <GroupSettingsCW initialGroups={groups} />
}