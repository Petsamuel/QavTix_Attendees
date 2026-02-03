"use client"

import TicketPreviewModal from "@/components/modals/my-tickets/TicketPreviewModal";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { useState } from "react";

export default function ViewTicket({ className }:{ className?: string }){

    const [showTicket, setShowTicket] = useState(false)

    return (
        <>
            <button onClick={() => setShowTicket(true)} className={cn("flex items-center gap-1 hover:underline underline-offset-4 whitespace-nowrap hover:text-brand-primary-5 transition-colors ease-linear duration-100 focus:underline focus:text-brand-primary-5", className)}>
                View Ticket <Icon icon="lucide:arrow-right" className="size-3" />
            </button>

            <TicketPreviewModal open={showTicket} setOpen={setShowTicket} />
        </>
    )
}