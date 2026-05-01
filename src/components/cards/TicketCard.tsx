"use client"

import { cn } from "@/lib/utils"
import Image from "next/image"
import { QRCodeSVG } from "qrcode.react"
import { space_grotesk } from "@/lib/fonts"
import Link from "next/link"
import { Icon } from "@iconify/react"
import { HOST_PROFILE_LINK } from "@/enums/navigation"
import { useAppSelector } from "@/lib/redux/hooks"

const buildMapsUrl = (location: EventTicket["event_location"]) => {
    const query = encodeURIComponent(
        `${location.venue_name}, ${location.address}, ${location.city}, ${location.state}`
    )
    return `https://www.google.com/maps/search/?api=1&query=${query}`
}

interface TicketCardProps {
    ticket: EventTicket
    hideActions?: boolean   // true during silent download — hides links & download btn
    // Slot for the download button (injected by parent so each use case controls it)
    downloadSlot?: React.ReactNode
}

export default function TicketCard({ ticket, hideActions = false, downloadSlot }: TicketCardProps) {

    const { user } = useAppSelector(store => store.authUser)
    const mapsUrl = buildMapsUrl(ticket.event_location)

    return (
        <div className="overflow-hidden relative flex flex-col lg:flex-row bg-white">

            <div className="w-full lg:w-[35%] h-64 lg:h-auto relative">
                <Image
                    src={ticket.event_image}
                    alt="Event Cover"
                    className="w-full h-full object-cover"
                    fill
                    priority
                    crossOrigin="anonymous"
                />
            </div>

            {/* Right: Ticket Content */}
            <div className="w-full flex-1 relative flex flex-col px-4 pt-9 pb-2 lg:ps-8 lg:pe-14">
                <div className={cn(
                    "bg-brand-accent-6 p-4 flex items-center justify-between text-white rounded-lg h-16",
                    "absolute -top-8 left-1/2 -translate-x-1/2 w-[92%] z-10",
                    "lg:relative lg:top-0 lg:left-0 lg:translate-x-0 lg:w-full lg:mx-0 lg:mb-6"
                )}>
                    <div className="flex-1 border-r border-white/40 px-2 min-w-0">
                        <p className="text-[7.5px] md:text-[10px] uppercase text-brand-accent-2 font-semibold">Date & Time</p>
                        <p className="text-[10.5px] md:text-sm font-medium leading-tight">
                            {new Date(ticket.event_datetime).toLocaleDateString("en-GB", { day: "numeric", month: "long" })} |{" "}
                            {new Date(ticket.event_datetime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                    </div>

                    <div className="flex-1 px-3 md:px-4 min-w-0">
                        <p className="text-[7.5px] md:text-[10px] uppercase text-brand-accent-2 font-semibold">Location</p>
                        <p className="text-[10.5px] md:text-sm max-w-50 font-medium leading-tight truncate">
                            {ticket.event_location.venue_name}, {ticket.event_location.city}
                        </p>
                    </div>
                </div>

                {/* Main Ticket Details */}
                <div className="flex flex-col lg:flex-row flex-1 py-4 gap-8 gap-y-4">
                    <div className="flex-1 space-y-4">
                        <div>
                            <h2 className={cn(space_grotesk.className, "text-2xl md:text-3xl font-bold text-[#0046AD] leading-tight")}>
                                {ticket.event_name}
                            </h2>
                            <p className="text-brand-secondary-6 text-base capitalize font-light md:text-lg">{ticket.category}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-y-5">
                            <div>
                                <p className="text-[10px] text-[#AAAAAA] uppercase font-semibold tracking-[12%]">Ticket Holder</p>
                                <p className="text-sm font-medium text-gray-900">{user?.full_name.split(" ")[0]}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-[#AAAAAA] uppercase font-semibold tracking-[12%]">Ticket Type</p>
                                <p className="text-sm font-medium text-gray-900">{ticket.ticket_type}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-[10px] text-[#AAAAAA] uppercase font-semibold tracking-[12%]">Ticket ID</p>
                                <p className="text-sm font-medium text-gray-900 tracking-wider">{ticket.id}</p>
                                <p className="text-[10px] text-black/50 mt-3">
                                    Do not screenshot - use app at venue | Invalid if transferred
                                </p>
                            </div>
                        </div>

                        {/* Links hidden during silent download capture */}
                        {!hideActions && (
                            <div className="flex items-center flex-wrap gap-6 pt-2">
                                <Link
                                    href={mapsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-xs font-bold text-brand-secondary-9 hover:underline"
                                >
                                    View venue map <Icon icon="lucide:arrow-right" className="size-3" />
                                </Link>

                                <Link
                                    href={HOST_PROFILE_LINK.replace("[host_id]", ticket.host.toString())}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-xs font-bold text-brand-secondary-9 hover:underline"
                                >
                                    Contact Organizer <Icon icon="lucide:arrow-right" className="size-3" />
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="w-full lg:hidden h-px border-b-[1.5px] border-dashed border-brand-neutral-7" />
                    <div className="hidden lg:block w-px border-l-[1.5px] border-dashed border-brand-neutral-7 self-stretch" />

                    <div className="flex lg:flex-col gap-4 lg:items-center justify-center space-y-4 min-w-45">
                        <div>
                            <div className="p-2 border border-brand-neutral-2 rounded-xl">
                                <QRCodeSVG
                                    value={ticket.qrcode_token}
                                    size={140}
                                    level="H"
                                />
                            </div>
                            <p className="text-[11px] text-brand-secondary-6 text-center mt-1">
                                Show this code at entrance
                            </p>
                        </div>

                        {/* Download button slot — injected by parent */}
                        {downloadSlot}
                    </div>
                </div>
            </div>
        </div>
    )
}