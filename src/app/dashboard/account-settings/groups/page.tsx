import { getGroups } from "@/actions/groups"
import GroupSettingsCW from "@/components/forms/GroupSettings"

export default async function GroupSettingsPage() {
    const result = await getGroups()

    const groups = result.success && result.data
        && result.data.results ? result.data.results 
        : []

    return <GroupSettingsCW initialGroups={groups} />
}