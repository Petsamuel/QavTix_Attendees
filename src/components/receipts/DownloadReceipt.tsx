"use client"

// Same silent-capture pattern as DownloadTicket.
// Renders TicketReceiptDocument off-screen, captures with html2canvas-pro, saves as PDF.

import { useRef, useEffect } from "react"
import html2canvas from "html2canvas-pro"
import jsPDF from "jspdf"
import TicketReceiptDocument from "../../lib/features/export/receipt/TicketReceiptDocument"

interface DownloadReceiptProps {
    receipt:    TicketReceipt
    onDone:     () => void   // called when capture completes (success or error)
    onError?:   (msg: string) => void
}

export default function DownloadReceipt({ receipt, onDone, onError }: DownloadReceiptProps) {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = containerRef.current
        if (!el) return

        let cancelled = false

        const capture = async () => {
            try {
                const canvas = await html2canvas(el, {
                    scale:            2,
                    useCORS:          true,
                    allowTaint:       false,
                    backgroundColor:  "#ffffff",
                    logging:          false,
                })

                if (cancelled) return

                const imgData = canvas.toDataURL("image/png")
                const pdf     = new jsPDF({ orientation: "landscape", unit: "px", format: [canvas.width / 2, canvas.height / 2] })

                pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2)
                pdf.save(`receipt-${receipt.issued_ticket_id}-${receipt.event.event_name.replace(/\s+/g, "-")}.pdf`)

            } catch (err) {
                console.error("[DownloadReceipt] capture failed:", err)
                onError?.("Failed to generate receipt. Please try again.")
            } finally {
                if (!cancelled) onDone()
            }
        }

        // Small delay so the DOM fully paints before capture
        const timer = setTimeout(capture, 150)
        return () => {
            cancelled = true
            clearTimeout(timer)
        }
    }, [])

    return (
        // Fixed off-screen — never visible to the user
        <div
            ref={containerRef}
            style={{
                position: "fixed",
                top:      "-9999px",
                left:     "-9999px",
                width:    "1100px",
                zIndex:   -1,
            }}
            aria-hidden="true"
        >
            <TicketReceiptDocument receipt={receipt} />
        </div>
    )
}