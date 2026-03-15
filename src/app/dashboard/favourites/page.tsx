import { getFavourites } from "@/actions/favourites"
import { getCategories } from "@/actions/filters"
import FavouritesPageCW from "@/components/page-content-wrappers/FavouritesPageMC"

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