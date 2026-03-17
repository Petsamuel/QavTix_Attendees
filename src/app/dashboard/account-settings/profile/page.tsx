import { getProfile } from "@/actions/settings/profile"
import ProfileInformationForm from "@/components/forms/ProfileInformationForm"

export default async function AccountSettingsPage() {

    const result = await getProfile()

    if (!result.success || !result.data) {
        throw new Error(result.message ?? "Failed to load profile.")
    }

    return (
        <ProfileInformationForm profile={result.data} />
    )
}