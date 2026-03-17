import SecurityPageForm from "@/components/forms/SecurityPageForm"
import { INITIAL_PROVIDERS } from "@/components-data/auth-providers"
import { get2FASettings } from "@/actions/settings/security"

export default async function SecurityPage() {
    const result = await get2FASettings()

    // Fall back to the static initial providers if fetch fails
    const providers = result.success && result.data
        ? result.data
        : INITIAL_PROVIDERS

    return <SecurityPageForm initialProviders={providers} />
}