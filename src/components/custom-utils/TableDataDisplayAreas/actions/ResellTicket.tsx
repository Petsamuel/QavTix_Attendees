"use client"

import TicketResellFormModal from "@/components/modals/my-tickets/TicketResellFormModa";
import { CONFIRMATION_ACTION_TYPES } from "@/components/modals/resources/confirmationActions";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { openConfirmation, resetConfirmationStatus } from "@/lib/redux/slices/confirmationSlice";
import { openSuccessModal } from "@/lib/redux/slices/successModalSlice";
import { cn } from "@/lib/utils";
import { mockMyTicketsTableData } from "@/mock-data";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

export default function ResellTicket({ className }:{ className?: string }){

    const [showResellTicket, setShowResellTicket] = useState(false)
    const [price, setPrice] = useState("")
    const dispatch = useAppDispatch()
    const { isConfirmed, lastConfirmedAction } = useAppSelector(state => state.confirmation)


    const handleOnResell = (price: string) => {
        setPrice(price)
        
        setShowResellTicket(false)

        dispatch(
            openConfirmation({
                actionType: CONFIRMATION_ACTION_TYPES.TRANSFER_TICKET,
                title: "Confirm Resell",
                description: "Are you sure you want to resell this ticket on the marketplace?",
                cancelText: "Cancel",
                confirmText: "Yes, I am",
            })
        )
    }

    useEffect(() => {
        if (isConfirmed && lastConfirmedAction === CONFIRMATION_ACTION_TYPES.TRANSFER_TICKET){
            dispatch(openSuccessModal({
                autoClose: false,
                title: "Resell Successful!",
                description: "Your Ticket was successfully listed. Thank you for choosing QavTix.."
            }))
            dispatch(resetConfirmationStatus())
        }
    },[dispatch, isConfirmed, lastConfirmedAction])

    return (
        <>
            <button onClick={() => setShowResellTicket(true)} className={cn("flex items-center gap-1 hover:underline underline-offset-4 whitespace-nowrap hover:text-brand-primary-5 transition-colors ease-linear duration-100 focus:underline focus:text-brand-primary-5", className)}>
                Resell <Icon icon="lucide:arrow-right" className="size-3" />
            </button>

            <TicketResellFormModal 
                open={showResellTicket} 
                setOpen={setShowResellTicket} 
                eventData={mockMyTicketsTableData[0].event as any}
                onResell={handleOnResell}
            />
        </>
    )
}