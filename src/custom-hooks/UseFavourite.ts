"use client"

import { useState } from "react"
import { addFavourite, removeFavourite } from "@/actions/favourites"
import { useAppDispatch } from "@/lib/redux/hooks"
import { showAlert } from "@/lib/redux/slices/alertSlice"

export function useFavourite(eventId: string | number, initialState = false) {
    
    const [isFavourite, setIsFavourite] = useState(initialState)
    const dispatch = useAppDispatch()

    const toggle = async () => {
        const previous = isFavourite

        // Optimistic update
        setIsFavourite(!previous)

        const result = previous
            ? await removeFavourite(eventId)
            : await addFavourite(eventId)

        if (!result.success) {
            setIsFavourite(previous)
            dispatch(showAlert({
                variant:     "destructive",
                title:       "Could not update favourites",
                description: result.message ?? "Please try again.",
            }))
        }
    }

    return { isFavourite, toggle }
}