import { getFavourites } from "@/actions/favourites"
import { getCategories } from "@/actions/filters"
import FavouritesPageCW from "@/components/page-content-wrappers/FavouritesPageMC"
import { ATTENDEE_PAGE_METADATA } from "@/metadata"
import type { Metadata } from "next"


export const metadata: Metadata = ATTENDEE_PAGE_METADATA.FAVOURITES;


export default async function FavouritesPage() {
    const [result, categoriesRes] = await Promise.all([
        getFavourites({ page: 1 }),
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