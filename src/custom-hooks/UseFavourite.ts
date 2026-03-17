"use client"

import { useRef, useState } from "react"
import { addFavourite, removeFavourite } from "@/actions/favourites"
import { useAppDispatch } from "@/lib/redux/hooks"
import { showAlert } from "@/lib/redux/slices/alertSlice"

export function useFavourite(eventId: string | number, initialState = false) {

    const [isFavourite,   setIsFavourite]   = useState(initialState)
    const [feedbackMsg,   setFeedbackMsg]   = useState<string | null>(null)
    const isPending     = useRef(false)
    const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
    const dispatch      = useAppDispatch()

    const showFeedback = (msg: string) => {
        if (feedbackTimer.current) clearTimeout(feedbackTimer.current)
        setFeedbackMsg(msg)
        feedbackTimer.current = setTimeout(() => setFeedbackMsg(null), 1200)
    }

    const toggle = async () => {
        if (isPending.current) return
        isPending.current = true

        let snapshot = false
        setIsFavourite(prev => {
            snapshot = prev
            return !prev  // optimistic flip
        })

        const result = snapshot
            ? await removeFavourite(eventId)
            : await addFavourite(eventId)

        if (result.success) {
            // Only show feedback after confirmed success
            showFeedback(snapshot ? "Removed" : "Saved!")
        } else {
            // Revert + error toast, no feedback
            setIsFavourite(snapshot)
            dispatch(showAlert({
                variant:     "destructive",
                title:       "Could not update favourites",
                description: result.message ?? "Please try again.",
            }))
        }

        isPending.current = false
    }

    return { isFavourite, toggle, feedbackMsg }
}