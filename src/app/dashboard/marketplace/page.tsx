import { getMarketplace } from "@/actions/marketplace"
import { getCategories } from "@/actions/filters"
import MarketplaceCW from "@/components/page-content-wrappers/MarketplaceCW"

export default async function MarketplacePage() {

    const [result, categoriesRes] = await Promise.all([
        getMarketplace({ page: 1 }),
        getCategories(),
    ])

    if (!result.success || !result.data) {
        throw new Error(result.message || "Failed to load marketplace.")
    }

    return (
        <MarketplaceCW
            initialData={result.data}
            categories={categoriesRes.data}
        />
    )
}