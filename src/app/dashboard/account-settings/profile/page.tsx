import { getProfile } from "@/actions/settings/profile/index"
import ProfileInformationForm from "@/components/forms/ProfileInformationForm"
import { ATTENDEE_PAGE_METADATA } from "@/lib/metadata"
import type { Metadata } from "next"


export const metadata: Metadata = ATTENDEE_PAGE_METADATA.PROFILE;


import { cookies } from "next/headers"

export default async function AccountSettingsPage() {
    const cookieStore = await cookies()
    const token = cookieStore.get("access_token")?.value

    const result = await getProfile(token)

    if (!result.success || !result.data) {
        throw new Error(result.message ?? "Failed to load profile.")
    }
    
    return (
        <ProfileInformationForm profile={result.data} />
    )
}