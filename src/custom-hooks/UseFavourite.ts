"use client"

import { useRef, useState } from "react"
import { addFavourite, removeFavourite } from "@/actions/favourites/client"
import { useAppDispatch } from "@/lib/redux/hooks"
import { showSnackbar } from "@/lib/redux/slices/snackbarSlice"
import { useRevalidate } from "./UseRevalidate"

interface UseFavouriteOptions {
    /** When true, router.refresh() is called after a successful removeFavourite.
     *  Use this on the Favourites page so the server-side list re-fetches. */
    refreshOnRemove?: boolean
    /** Optional callback fired after a successful toggle (either direction). */
    onSuccess?: (wasFavourite: boolean) => void
}

export function useFavourite(
    eventId: string | number,
    initialState = false,
    options: UseFavouriteOptions = {},
) {
    const { refreshOnRemove = false, onSuccess } = options

    const [isFavourite, setIsFavourite] = useState(initialState)
    const isPending = useRef(false)
    const dispatch = useAppDispatch()
    const { trigger: triggerFav } = useRevalidate("favourites")
    const { trigger: triggerMarketplace } = useRevalidate("marketplace")

    const toggle = async () => {
        if (isPending.current) return
        isPending.current = true

        let snapshot = false
        setIsFavourite(prev => {
            snapshot = prev
            return !prev  // optimistic flip
        })

        // Show a loading snackbar
        dispatch(showSnackbar({
            message: snapshot ? "Removing from favourites..." : "Adding to favourites...",
            variant: "loading",
        }))

        const result = snapshot
            ? await removeFavourite(eventId)
            : await addFavourite(eventId)

        if (result.success) {
            dispatch(showSnackbar({
                message: snapshot ? "Removed from favourites" : "Added to favourites",
                variant: "success",
            }))

            onSuccess?.(snapshot)
            triggerFav()
            triggerMarketplace()
        } else {
            // Revert + error toast
            setIsFavourite(snapshot)
            dispatch(showSnackbar({
                message: result.message ?? "Could not update favourites. Please try again.",
                variant: "error",
            }))
        }

        isPending.current = false
    }

    return { isFavourite, toggle }
}