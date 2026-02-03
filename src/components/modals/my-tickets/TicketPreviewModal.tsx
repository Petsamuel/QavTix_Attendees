"use client";

import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react"; 
import { space_grotesk } from "@/lib/fonts";
import { AnimatedDialog } from "../../custom-utils/dialogs/AnimatedDialog";
import { Dispatch, SetStateAction } from "react";
import { DialogTitle } from "../../ui/dialog";




export default function TicketPreviewModal({ open, setOpen }:{ open: boolean, setOpen: Dispatch<SetStateAction<boolean>> }) {

    
    const ticketId = "TKT-001-VIP-12345";

    return (
        <AnimatedDialog open={open} showCloseButton={false} className="md:max-w-[26em] lg:max-w-[60em]" childrenContainerStyles="p-0">
            <DialogTitle className="sr-only">Preview</DialogTitle>

            <button
                onClick={() => setOpen(false)}
                className="absolute right-4 size-6 flex justify-center items-center top-6 z-50 rounded-full p-1 bg-[#BFBFBF] hover:bg-brand-neutral-5 text-white transition-colors"
            >
                <Icon icon="iconamoon:close-duotone" width="24" height="24" className="size-5" />
            </button>
            
            <div className="overflow-hidden relative flex flex-col lg:flex-row">
                
                <div className="w-full lg:w-[35%] h-64 lg:h-auto relative">
                    <Image 
                        src="/images/demo-images/event-detail-img.png" 
                        alt="Event Cover" 
                        className="w-full h-full object-cover"
                        fill
                        priority
                    />
                </div>

                {/* Right: Ticket Content */}
                <div className="w-full flex-1 relative flex flex-col px-4 pt-9 pb-2 lg:ps-8 lg:pe-14">
                    <div className={cn(
                        "bg-brand-accent-6 p-4 flex items-center justify-between text-white rounded-lg h-16",
                        // Mobile: Absolute positioning
                        "absolute -top-8 left-1/2 -translate-x-1/2 w-[92%] z-10",
                        // Desktop: Reset to natural flow
                        "lg:relative lg:top-0 lg:left-0 lg:translate-x-0 lg:w-full lg:mx-0 lg:mb-6"
                    )}>
                        <div className="flex-1 border-r border-white/40 px-2 min-w-0">
                            <p className="text-[7.5px] md:text-[10px] uppercase text-brand-accent-2 font-semibold">Date & Time</p>
                            <p className="text-[10.5px] md:text-sm font-medium leading-tight">November 15th | 6:00 PM</p>
                        </div>
                        
                        <div className="flex-1 px-3 md:px-4 min-w-0">
                            <p className="text-[7.5px] md:text-[10px] uppercase text-brand-accent-2 font-semibold">Location</p>
                            <p className="text-[10.5px] md:text-sm max-w-50 font-medium leading-tight truncate wrap-break-words">
                                Doo & Shima, Elegushi Beach
                            </p>
                        </div>
                    </div>

                    {/* Main Ticket Details */}
                    <div className="flex flex-col lg:flex-row flex-1 py-4 gap-8 gap-y-4">
                        {/* Info Section */}
                        <div className="flex-1 space-y-4">
                            <div>
                                <h2 className={cn(space_grotesk.className, "text-2xl md:text-3xl font-bold text-[#0046AD] leading-tight")}>
                                    5ive Tour Concert
                                </h2>
                                <p className="text-brand-secondary-6 text-base font-light md:text-lg">Music Festival</p>
                            </div>

                            <div className="grid grid-cols-2 gap-y-5">
                                <div>
                                    <p className="text-[10px] text-[#AAAAAA] uppercase font-semibold tracking-[12%]">Ticket Holder</p>
                                    <p className="text-sm font-medium text-gray-900">Dominic Evans</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-[#AAAAAA] uppercase font-semibold tracking-[12%]">Ticket Type</p>
                                    <p className="text-sm font-medium text-gray-900">VIP Pass</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-[10px] text-[#AAAAAA] uppercase font-semibold tracking-[12%]">Ticket ID</p>
                                    <p className="text-sm font-medium text-gray-900 tracking-wider">{ticketId}</p>
                                    <p className="text-[10px] text-black/50 mt-3">Do not screenshot - use app at venue | Invalid if transferred</p>
                                </div>
                            </div>

                            <div className="flex items-center flex-wrap gap-6 pt-2">
                                <button className="flex items-center gap-1 text-xs font-bold text-brand-secondary-9 hover:underline">
                                    View venue map <Icon icon="lucide:arrow-right" className="size-3" />
                                </button>
                                <button className="flex items-center gap-1 text-xs font-bold text-brand-secondary-9 hover:underline">
                                    Contact Organizer <Icon icon="lucide:arrow-right" className="size-3" />
                                </button>
                            </div>
                        </div>

                        {/* Mobile Seperator  */}
                        <div className="w-full lg:hidden h-px border-b-[1.5px] border-dashed border-brand-neutral-7" />

                        <div className="hidden lg:block w-px border-l-[1.5px] border-dashed border-brand-neutral-7 self-stretch" />

                        <div className="flex lg:flex-col gap-4 lg:items-center justify-center space-y-4 min-w-45">
                            <div>
                                <div className="p-2 border border-brand-neutral-2 rounded-xl">
                                    <QRCodeSVG 
                                        value={ticketId} 
                                        size={140}
                                        level="H"
                                    />
                                </div>
                                <p className="text-[11px] text-brand-secondary-6 text-center">Show this code at entrance</p>
                            </div>
                            
                            <button className="w-full bg-brand-primary-6 h-12 text-white p-3 rounded-full font-medium text-xs md:text-sm flex items-center justify-center gap-2 hover:bg-brand-primary-7 transition-colors">
                                Download Ticket
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </AnimatedDialog>
    )
}