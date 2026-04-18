import { getMarketplace } from "@/actions/marketplace"
import { getCategories } from "@/actions/filters"
import MarketplaceCW from "@/components/page-content-wrappers/MarketplaceCW"
import { ATTENDEE_PAGE_METADATA } from "@/lib/metadata"
import type { Metadata } from "next"

export const metadata: Metadata = ATTENDEE_PAGE_METADATA.MARKETPLACE;

export default async function MarketplacePage() {

    const [result, categoriesRes] = await Promise.all([
        getMarketplace({ page: 1 }),
        getCategories(),
    ])

    if (!result.success || !result.data) {
        throw new Error(result.message || "Failed to load marketplace.")
    }

    console.log(result.data)

    return (
        <MarketplaceCW
            initialData={result.data}
            categories={categoriesRes.data}
        />
    )
}