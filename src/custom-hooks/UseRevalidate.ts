"use client"

import { useCallback, useEffect, useRef } from "react"

// Module-level — lives outside React, shared across all hook instances in this app
const revalidateCallbacks: Partial<Record<RevalidateTarget, Set<() => void>>> = {}

/**
 * Returns a `trigger` function that fires every `useOnRevalidate` listener
 * registered for the same `target`.
 *
 * Usage:
 *   const { trigger } = useRevalidate("favourites")
 *   // call trigger() after an unfavourite action to refresh any mounted list
 */
export function useRevalidate(target: RevalidateTarget) {
    const trigger = useCallback(() => {
        revalidateCallbacks[target]?.forEach(cb => cb())
    }, [target])

    return { trigger }
}

/**
 * Registers a callback that runs whenever `useRevalidate(target).trigger()` is called.
 * The callback is automatically cleaned up on unmount.
 */
export function useOnRevalidate(target: RevalidateTarget, cb: () => void) {
    const cbRef = useRef(cb)
    cbRef.current = cb

    useEffect(() => {
        if (!revalidateCallbacks[target]) {
            revalidateCallbacks[target] = new Set()
        }
        const handler = () => cbRef.current()
        revalidateCallbacks[target]!.add(handler)
        return () => { revalidateCallbacks[target]?.delete(handler) }
    }, [target])
}
