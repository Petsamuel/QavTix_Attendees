import { GET_TWO_FACTOR_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"

interface Get2FAResult {
    success: boolean
    data?: {
        "google": false,
        "facebook": true
    }
    message?: string
}

export async function get2FASettings(token: string | undefined): Promise<Get2FAResult> {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${GET_TWO_FACTOR_ENDPOINT}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },

            }
        )

        if (!res.ok) {
            const json = await res.json()
            return { success: false, message: handleApiError(json) }
        }

        const json = await res.json()
        return { success: true, data: json.data ?? json }

    } catch (error: any) {
        return { success: false, message: "Failed to load 2FA settings." }
    }
}