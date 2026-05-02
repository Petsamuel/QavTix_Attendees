
import { CACHE_TAGS } from "@/cache-tags"
import { FAVOURITES_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"

interface GetFavouritesParams {
    page?: number
    search?: string
    category?: string
    start_date?: string
    end_date?: string
    min_price?: string
    max_price?: string
}

interface GetFavouritesResult {
    success: boolean
    data?: PaginatedResponse<FavouriteEvent>
    message?: string
}

export async function getFavourites(token: string | undefined, params: GetFavouritesParams = {}): Promise<GetFavouritesResult> {
    try {
        const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${FAVOURITES_ENDPOINT}`)
        Object.entries(params).forEach(([k, v]) => {
            if (v != null) url.searchParams.set(k, String(v))
        })

        const res = await fetch(url.toString(), {
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            next: { tags: [CACHE_TAGS.MY_FAVOURITES], revalidate: 300 }
        })

        if (!res.ok) {
            const json = await res.json()
            return { success: false, message: handleApiError(json) }
        }

        const json = await res.json()
        return { success: true, data: json.data }
    } catch {
        return { success: false, message: "Failed to load favourites." }
    }
}