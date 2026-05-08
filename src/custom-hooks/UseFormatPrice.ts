import { useCallback } from "react"
import { useIsMounted } from "./UseIsMounted"
import { formatPrice } from "@/helper-fns/formatPrice"

/**
 * Standardizes currency formatting across the platform.
 * Ensures the UI is stable during hydration by only showing currency symbols
 * after the component has mounted on the client.
 */
export function useFormatPrice() {
    const isMounted = useIsMounted()

    return useCallback(
        (amount: number, currency?: string, useSymbol: boolean = true) => {
            return formatPrice(amount, currency, useSymbol, isMounted)
        },
        [isMounted]
    )
}
