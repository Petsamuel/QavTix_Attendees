"use client"

import TransferTicketFormModal from "@/components/modals/my-tickets/TransferTicketFormModal"
import { cn } from "@/lib/utils"
import { Icon } from "@iconify/react"
import { useEffect, useRef, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { openConfirmation, finishConfirmAction, resetConfirmationStatus, parseConfirmationSession } from "@/lib/redux/slices/confirmationSlice"
import { CONFIRMATION_ACTION_TYPES } from "@/components/modals/resources/confirmationActions"
import { openSuccessModal } from "@/lib/redux/slices/successModalSlice"
import { transferTicket } from "@/actions/marketplace/client"
import { useRevalidate } from "@/custom-hooks/UseRevalidate"
import { showAlert } from "@/lib/redux/slices/alertSlice"

// Module-level: survives React StrictMode unmount/remount cycles
// Cleared when resetConfirmationStatus runs (sessionId becomes null)
const handledSessions = new Set<string>()

export default function TransferTicket({ className, ticketID }: { className?: string; ticketID: string }) {

    const dispatch = useAppDispatch()
    const { trigger } = useRevalidate("tickets")
    const [showTransferTicketModal, setShowTransferTicketModal] = useState(false)

    const recipientEmailRef = useRef("")

    const { isConfirmed, lastConfirmedAction, sessionId } =
        useAppSelector(state => state.confirmation)

    const handleTransferInitiation = (email: string) => {
        recipientEmailRef.current = email
        setShowTransferTicketModal(false)

        dispatch(openConfirmation({
            actionType: CONFIRMATION_ACTION_TYPES.TRANSFER_TICKET,
            targetId: ticketID,
            title: "Confirm Transfer",
            description: "Are you sure you want to transfer this ticket to the selected recipient?",
            cancelText: "Cancel",
            confirmText: "Yes, Transfer",
        }))
    }

    useEffect(() => {
        if (!isConfirmed || !sessionId) return
        if (lastConfirmedAction !== CONFIRMATION_ACTION_TYPES.TRANSFER_TICKET) return
        if (handledSessions.has(sessionId)) return  // survives remounts

        const { parsedTargetId } = parseConfirmationSession(sessionId)
        if (parsedTargetId?.toString() !== ticketID.toString()) return

        handledSessions.add(sessionId)  // locked globally — no remount can bypass this

        const run = async () => {
            const result = await transferTicket({
                ticket_id: ticketID,
                recipient_email: recipientEmailRef.current,
            })

            dispatch(finishConfirmAction())
            dispatch(resetConfirmationStatus())

            if (result.success) {
                trigger()
                recipientEmailRef.current = ""
                dispatch(openSuccessModal({
                    autoClose: false,
                    title: "Transfer Successful!",
                    description: "Your ticket transfer was successful. Thank you for choosing QavTix.",
                }))
            } else {
                dispatch(showAlert({
                    variant: "destructive",
                    title: "Transfer Failed",
                    description: result.message || "An error occurred while transferring the ticket. Please try again.",
                }))
            }
        }

        run()
    }, [isConfirmed, lastConfirmedAction, sessionId])

    return (
        <>
            <button
                onClick={() => setShowTransferTicketModal(true)}
                className={cn(
                    "flex items-center gap-1 hover:underline underline-offset-4 whitespace-nowrap hover:text-brand-primary-5 transition-colors ease-linear duration-100 focus:underline focus:text-brand-primary-5",
                    className
                )}
            >
                Transfer <Icon icon="lucide:arrow-right" className="size-3" />
            </button>

            <TransferTicketFormModal
                open={showTransferTicketModal}
                setOpen={setShowTransferTicketModal}
                onTransfer={handleTransferInitiation}
            />
        </>
    )
}