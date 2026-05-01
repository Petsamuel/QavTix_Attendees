import { getFavourites } from "@/actions/favourites/index"
import { getCategories } from "@/actions/filters/index"
import FavouritesPageCW from "@/components/page-content-wrappers/FavouritesPageMC"
import { ATTENDEE_PAGE_METADATA } from "@/lib/metadata"
import type { Metadata } from "next"


export const metadata: Metadata = ATTENDEE_PAGE_METADATA.FAVOURITES;


import { cookies } from "next/headers"

export default async function FavouritesPage() {
    const cookiesStore = await cookies()
    const token = cookiesStore.get("access_token")?.value

    const [result, categoriesRes] = await Promise.all([
        getFavourites(token, { page: 1 }),
        getCategories(),
    ])

    if (!result.success || !result.data) {
        throw new Error(result.message || "Failed to load favourites.")
    }

    return (
        <FavouritesPageCW
            initialData={result.data}
            categories={categoriesRes.data}
        />
    )
}