import { getMarketplace } from "@/actions/marketplace/index"
import { getCategories } from "@/actions/filters/index"
import MarketplaceCW from "@/components/page-content-wrappers/MarketplaceCW"
import { ATTENDEE_PAGE_METADATA } from "@/lib/metadata"
import type { Metadata } from "next"

export const metadata: Metadata = ATTENDEE_PAGE_METADATA.MARKETPLACE;

import { cookies } from "next/headers"

export default async function MarketplacePage() {
    const cookiesStore = await cookies()
    const token = cookiesStore.get("access_token")?.value

    const [result, categoriesRes] = await Promise.all([
        getMarketplace(token, { page: 1 }),
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