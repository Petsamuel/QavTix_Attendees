import { getPrivacySettings } from "@/actions/privacy"
import PrivacySettingsPageCW from "@/components/page-content-wrappers/settings/PrivacyPageCW"

const DEFAULT_SETTINGS = {
    show_events:    true,
    show_favorites: false,
}

export default async function PrivacyPage() {
    const result = await getPrivacySettings()

    const settings = result.success && result.data
        ? result.data
        : DEFAULT_SETTINGS

    return <PrivacySettingsPageCW initialSettings={settings} />
}