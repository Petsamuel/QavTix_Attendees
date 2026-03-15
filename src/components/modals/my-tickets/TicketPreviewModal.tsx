"use client"

import { AnimatedDialog } from "../../custom-utils/dialogs/AnimatedDialog"
import { Dispatch, SetStateAction, useRef, useState } from "react"
import { DialogTitle } from "../../ui/dialog"
import { Icon } from "@iconify/react"
import TicketCard from "@/components/cards/TicketCard"

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

export default function TicketPreviewModal({
    open,
    setOpen,
    ticket,
}: {
    ticket:  EventTicket
    open:    boolean
    setOpen: Dispatch<SetStateAction<boolean>>
}) {
    const ticketRef      = useRef<HTMLDivElement>(null)
    const downloadBtnRef = useRef<HTMLDivElement>(null)
    const [isDownloading, setIsDownloading] = useState(false)

    const handleDownload = async () => {
        if (!ticketRef.current || !downloadBtnRef.current) return
        setIsDownloading(true)
        downloadBtnRef.current.style.display = "none"
        try {
            await downloadTicketAsPDF(ticketRef.current, `qavtix-ticket-${ticket.id}`)
        } finally {
            downloadBtnRef.current.style.display = ""
            setIsDownloading(false)
        }
    }

    return (
        <AnimatedDialog
            open={open}
            showCloseButton={false}
            className="md:max-w-[26em] lg:max-w-[60em]"
            childrenContainerStyles="p-0"
        >
            <DialogTitle className="sr-only">Preview</DialogTitle>

            <button
                onClick={() => setOpen(false)}
                className="absolute right-4 size-6 flex justify-center items-center top-6 z-50 rounded-full p-1 bg-[#BFBFBF] hover:bg-brand-neutral-5 text-white transition-colors"
            >
                <Icon icon="iconamoon:close-duotone" width="24" height="24" className="size-5" />
            </button>

            <div ref={ticketRef}>
                <TicketCard
                    ticket={ticket}
                    downloadSlot={
                        <div ref={downloadBtnRef} className="w-full">
                            <button
                                onClick={handleDownload}
                                disabled={isDownloading}
                                className="w-full bg-brand-primary-6 h-11 text-white px-3 rounded-full font-medium text-xs md:text-sm flex items-center justify-center gap-2 hover:bg-brand-primary-7 transition-colors disabled:opacity-60"
                            >
                                {isDownloading && <Icon icon="lucide:loader-2" className="size-4 animate-spin" />}
                                {isDownloading ? "Preparing..." : "Download Ticket"}
                            </button>
                        </div>
                    }
                />
            </div>
        </AnimatedDialog>
    )
}