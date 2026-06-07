import { CACHE_TAGS } from "@/cache-tags"
import { MARKETPLACE_LIST_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"

interface GetMarketplaceParams {
    page?: number
    search?: string
    category?: string
    start_date?: string
    end_date?: string
    min_price?: string
    max_price?: string
}

interface GetMarketplaceResult {
    success: boolean
    data?: PaginatedResponse<MarketplaceEvent>
    message?: string
}

export async function getMarketplace(token: string | undefined, params: GetMarketplaceParams = {}): Promise<GetMarketplaceResult> {
    try {
        const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${MARKETPLACE_LIST_ENDPOINT}`)
        Object.entries(params).forEach(([k, v]) => {
            if (v != null) url.searchParams.set(k, String(v))
        })

        const res = await fetch(url.toString(), {
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            // next: { tags: [CACHE_TAGS.MARKETPLACE], revalidate: 300 }
        })

        if (!res.ok) {
            const json = await res.json()
            return { success: false, message: handleApiError(json) }
        }

        const json = await res.json()
        return { success: true, data: json.data }

    } catch (error: any) {
        return { success: false, message: "Failed to load marketplace." }
    }
}