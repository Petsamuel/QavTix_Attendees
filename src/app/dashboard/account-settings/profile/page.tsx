import { getProfile } from "@/actions/settings/profile"
import ProfileInformationForm from "@/components/forms/ProfileInformationForm"
import { ATTENDEE_PAGE_METADATA } from "@/metadata"
import type { Metadata } from "next"


export const metadata: Metadata = ATTENDEE_PAGE_METADATA.PROFILE;


export default async function AccountSettingsPage() {

    const result = await getProfile()

    if (!result.success || !result.data) {
        throw new Error(result.message ?? "Failed to load profile.")
    }
    
    return (
        <ProfileInformationForm profile={result.data} />
    )
}