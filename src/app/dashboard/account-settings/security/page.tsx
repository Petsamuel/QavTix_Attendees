import SecurityPageForm from "@/components/forms/SecurityPageForm"
import { INITIAL_PROVIDERS } from "@/components-data/auth-providers"
import { get2FASettings } from "@/actions/settings/security"

export default async function SecurityPage() {
    const result = await get2FASettings()

    const providers = INITIAL_PROVIDERS.map((provider) => {
        if (!result.success || !result.data) return provider

        const apiData = result.data as Record<string, boolean>

        // IF THE PROVIDER EXISTS IN THE API RESPONSE, MAP ITS BOOLEAN TO A STATUS
        if (provider.id in apiData) {
            return {
                ...provider,
                status: apiData[provider.id] ? "connected" : "disconnected",
            } satisfies typeof provider
        }

        return provider
    })

    return <SecurityPageForm initialProviders={providers} />
}