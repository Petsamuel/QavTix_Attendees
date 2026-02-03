"use client"

import TransferTicketFormModal from "@/components/modals/my-tickets/TransferTicketFormModal";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { openConfirmation, resetConfirmationStatus } from "@/lib/redux/slices/confirmationSlice";
import { CONFIRMATION_ACTION_TYPES } from "@/components/modals/resources/confirmationActions";
import { openSuccessModal } from "@/lib/redux/slices/successModalSlice";

export default function TransferTicket({ className }:{ className?: string }){

    const dispatch = useAppDispatch()
    const [showTransferTicketModal, setShowTransferTicketModal] = useState(false)
    const [recipientEmail, setRecipientEmail] = useState("")
    const { isConfirmed, lastConfirmedAction } = useAppSelector(state => state.confirmation)

    const handleTransferInitiation = (email: string) => {
        setRecipientEmail(email)
        
        setShowTransferTicketModal(false)

        dispatch(
            openConfirmation({
                actionType: CONFIRMATION_ACTION_TYPES.TRANSFER_TICKET,
                title: "Confirm Transfer",
                description: "Are you sure you want to transfer this ticket to the selected recipient?",
                cancelText: "Cancel",
                confirmText: "Yes, I am",
            })
        )
    }

    useEffect(() => {
        if (isConfirmed && lastConfirmedAction === CONFIRMATION_ACTION_TYPES.TRANSFER_TICKET){
            dispatch(openSuccessModal({
                autoClose: false,
                title: "Transfer Successful!",
                description: "Your Ticket Transfer was successful. Thank you for choosing QavTix."
            }))
            dispatch(resetConfirmationStatus())
        }
    },[dispatch, isConfirmed, lastConfirmedAction])

    return (
        <>
            <button 
                onClick={() => setShowTransferTicketModal(true)} 
                className={cn("flex items-center gap-1 hover:underline underline-offset-4 whitespace-nowrap hover:text-brand-primary-5 transition-colors ease-linear duration-100 focus:underline focus:text-brand-primary-5", className)}
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