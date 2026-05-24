
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

/** Fetch attendees_count from the public search endpoint for a set of event IDs.
 *  Returns a map of eventId → attendees_count. */
async function fetchPublicAttendeeCounts(eventIds: string[]): Promise<Record<string, number>> {
    if (eventIds.length === 0) return {}
    try {
        const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/public/search/`)
        url.searchParams.set("limit", "100")
        const res = await fetch(url.toString(), { cache: "no-store" })
        if (!res.ok) return {}
        const json = await res.json()
        const results: { id: string; attendees_count: number }[] = json?.data?.results ?? []
        const map: Record<string, number> = {}
        const idSet = new Set(eventIds)
        for (const event of results) {
            if (idSet.has(event.id)) {
                map[event.id] = event.attendees_count
            }
        }
        return map
    } catch {
        return {}
    }
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
        const data: PaginatedResponse<FavouriteEvent> = json.data

        // Enrich attendees_count from the public search endpoint so avatars are accurate
        if (data?.results?.length) {
            const ids = data.results.map((e) => e.id)
            const countMap = await fetchPublicAttendeeCounts(ids)
            data.results = data.results.map((e) => ({
                ...e,
                attendees_count: countMap[e.id] ?? e.attendees_count,
            }))
        }

        return { success: true, data }
    } catch {
        return { success: false, message: "Failed to load favourites." }
    }
}