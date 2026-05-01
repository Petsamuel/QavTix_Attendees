import { getPrivacySettings } from "@/actions/settings/privacy/index"
import PrivacySettingsPageCW from "@/components/page-content-wrappers/settings/PrivacyPageCW"
import { ATTENDEE_PAGE_METADATA } from "@/lib/metadata"
import type { Metadata } from "next"
import { cookies } from "next/headers";

export const metadata: Metadata = ATTENDEE_PAGE_METADATA.PRIVACY;


const DEFAULT_SETTINGS = {
    show_events: true,
    show_favorites: false,
}

export default async function PrivacyPage() {
    const cookieStore = await cookies()
    const token = cookieStore.get("access_token")?.value

    const result = await getPrivacySettings(token)

    const settings = result.success && result.data
        ? result.data
        : DEFAULT_SETTINGS

    return <PrivacySettingsPageCW initialSettings={settings} />
}