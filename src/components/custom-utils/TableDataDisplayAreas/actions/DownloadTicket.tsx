"use client"

import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";

export default function DownloadTicket({ className }:{ className?: string }){


    return (
        <button className={cn("flex items-center gap-1 hover:underline underline-offset-4 whitespace-nowrap hover:text-brand-primary-5 transition-colors ease-linear duration-100 focus:underline focus:text-brand-primary-5", className)}>
            <Icon icon="hugeicons:download-01" className="size-3" /> Download Ticket
        </button>
    )
}