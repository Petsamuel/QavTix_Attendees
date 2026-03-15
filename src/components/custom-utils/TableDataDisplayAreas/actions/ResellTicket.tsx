"use client"

import TicketResellFormModal from "@/components/modals/my-tickets/TicketResellFormModal"
import { CONFIRMATION_ACTION_TYPES } from "@/components/modals/resources/confirmationActions"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { openConfirmation, finishConfirmAction, resetConfirmationStatus, parseConfirmationSession } from "@/lib/redux/slices/confirmationSlice"
import { openSuccessModal } from "@/lib/redux/slices/successModalSlice"
import { showAlert } from "@/lib/redux/slices/alertSlice"
import { cn } from "@/lib/utils"
import { Icon } from "@iconify/react"
import { useEffect, useRef, useState } from "react"
import { resellTicket } from "@/actions/marketplace"

// Module-level: survives React StrictMode unmount/remount cycles
const handledSessions = new Set<string>()

export default function ResellTicket({ className, ticket }: { className?: string; ticket: EventTicket }) {

    const dispatch = useAppDispatch()
    const [showResellTicket, setShowResellTicket] = useState(false)

    const priceRef = useRef("")

    const { isConfirmed, lastConfirmedAction, sessionId } =
        useAppSelector(state => state.confirmation)

    const handleOnResell = (price: string) => {
        priceRef.current = price
        setShowResellTicket(false)

        dispatch(openConfirmation({
            actionType:  CONFIRMATION_ACTION_TYPES.RESELL_TICKET,
            targetId:    ticket.id,
            title:       "Confirm Resell",
            description: "Are you sure you want to resell this ticket on the marketplace?",
            cancelText:  "Cancel",
            confirmText: "Yes, List It",
        }))
    }

    useEffect(() => {
        if (!isConfirmed || !sessionId) return
        if (lastConfirmedAction !== CONFIRMATION_ACTION_TYPES.RESELL_TICKET) return
        if (handledSessions.has(sessionId)) return

        const { parsedTargetId } = parseConfirmationSession(sessionId)
        if (parsedTargetId?.toString() !== ticket.id.toString()) return

        handledSessions.add(sessionId)

        const run = async () => {
            const result = await resellTicket({
                ticket_id: ticket.id,
                price:     priceRef.current,
            })

            dispatch(finishConfirmAction())
            dispatch(resetConfirmationStatus())

            if (result.success) {
                priceRef.current = ""
                dispatch(openSuccessModal({
                    autoClose:   false,
                    title:       "Listing Successful!",
                    description: "Your ticket has been listed on the marketplace. Thank you for choosing QavTix.",
                }))
            } else {
                dispatch(showAlert({
                    variant:     "destructive",
                    title:       "Resell Failed",
                    description: result.message || "An error occurred while listing your ticket. Please try again.",
                }))
            }
        }

        run()
    }, [isConfirmed, lastConfirmedAction, sessionId])

    return (
        <>
            <button
                onClick={() => setShowResellTicket(true)}
                className={cn(
                    "flex items-center gap-1 hover:underline underline-offset-4 whitespace-nowrap hover:text-brand-primary-5 transition-colors ease-linear duration-100 focus:underline focus:text-brand-primary-5",
                    className
                )}
            >
                Resell <Icon icon="lucide:arrow-right" className="size-3" />
            </button>

            <TicketResellFormModal
                open={showResellTicket}
                setOpen={setShowResellTicket}
                ticket={ticket}
                onResell={handleOnResell}
            />
        </>
    )
}