"use client"

import TicketCard from "@/components/cards/TicketCard"
import { cn } from "@/lib/utils"
import { Icon } from "@iconify/react"
import { useRef, useState } from "react"

async function downloadTicketAsPDF(node: HTMLElement, filename: string) {
    const html2canvas = (await import("html2canvas-pro")).default
    const { jsPDF }   = await import("jspdf")

    const canvas  = await html2canvas(node, {
        useCORS:         true,
        allowTaint:      false,
        backgroundColor: "#ffffff",
        scale:           2,
        logging:         false,
    })

    const imgData = canvas.toDataURL("image/png")
    const imgW    = canvas.width  / 2
    const imgH    = canvas.height / 2

    const pdf = new jsPDF({
        orientation: imgW > imgH ? "landscape" : "portrait",
        unit:        "px",
        format:      [imgW, imgH],
    })

    pdf.addImage(imgData, "PNG", 0, 0, imgW, imgH)
    pdf.save(`${filename}.pdf`)
}

export default function DownloadTicket({ className, ticket }: { className?: string; ticket: EventTicket }) {
    const hiddenTicketRef                   = useRef<HTMLDivElement>(null)
    const [isDownloading, setIsDownloading] = useState(false)

    const handleDownload = async () => {
        if (!hiddenTicketRef.current) return
        setIsDownloading(true)
        try {
            await downloadTicketAsPDF(hiddenTicketRef.current, `qavtix-ticket-${ticket.id}`)
        } finally {
            setIsDownloading(false)
        }
    }

    return (
        <>
            <button
                onClick={handleDownload}
                disabled={isDownloading}
                className={cn(
                    "flex items-center gap-1 hover:underline underline-offset-4 whitespace-nowrap hover:text-brand-primary-5 transition-colors ease-linear duration-100 focus:underline focus:text-brand-primary-5 disabled:opacity-60",
                    className
                )}
            >
                {isDownloading
                    ? <Icon icon="lucide:loader-2" className="size-3 animate-spin" />
                    : <Icon icon="hugeicons:download-01" className="size-3" />
                }
                {isDownloading ? "Preparing..." : "Download Ticket"}
            </button>

            {/*
                Hidden off-screen ticket — in the DOM so html2canvas can read it,
                but completely invisible to the user.
                hideActions=true removes links so they don't appear in the PDF.
                Fixed width ensures a consistent PDF layout regardless of screen size.
            */}
            <div
                ref={hiddenTicketRef}
                aria-hidden="true"
                style={{
                    position:      "fixed",
                    top:           "-9999px",
                    left:          "-9999px",
                    width:         "900px",
                    zIndex:        -1,
                    pointerEvents: "none",
                }}
            >
                <TicketCard ticket={ticket} hideActions={true} />
            </div>
        </>
    )
}