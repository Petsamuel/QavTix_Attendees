import Image from "next/image"
import { QRCodeSVG } from "qrcode.react"
import { cn } from "@/lib/utils"
import { inter, space_grotesk } from "@/lib/fonts"
import { formatDateSimple, formatDateTime } from "@/helper-fns/date-utils"
import { capitalize } from "@/helper-fns/stringFormaters"
import { formatPrice } from "@/helper-fns/formatPrice"
import { useAppSelector } from "@/lib/redux/hooks"


const formatLocation = (loc: TicketReceipt["event"]["event_location"]): string => {
    return [loc.venue, loc.address, loc.city, loc.state].filter(Boolean).join(", ")
}

const Label = ({ children }: { children: React.ReactNode }) => {
    return (
        <p className="text-[10px] uppercase tracking-widest text-[#AAAAAA] font-semibold mb-0.5">
            {children}
        </p>
    )
}

const Value = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return (
        <p className={cn("text-sm font-medium text-gray-900", className)}>
            {children}
        </p>
    )
}

function DividerDashed({ vertical }: { vertical?: boolean }) {
    return vertical
        ? <div className="hidden lg:block w-px border-l-[1.5px] border-dashed border-brand-neutral-5 self-stretch mx-4" />
        : <div className="w-full border-t-[1.5px] border-dashed border-brand-neutral-5 my-4" />
}




// ── Main Component─────────────

interface TicketReceiptDocumentProps {
    receipt: TicketReceipt
}

export default function TicketReceiptDocument({ receipt }: TicketReceiptDocumentProps) {

    const { user } = useAppSelector(store => store.authUser)
    const { event, ticket_type, quantity, billed_to, payment } = receipt

    const locationStr = formatLocation(event.event_location)
    const qrValue     = `TICKET-${receipt.issued_ticket_id}-${event.id}`

    return (
        <div
            className={cn(inter.className, "bg-white text-left w-full text-gray-900")}
            style={{ fontFamily: "Inter, sans-serif" }}
        >
            {/* Header */}
            <div className="pb-6 border-b border-brand-neutral-2">
                <p
                    style={{ fontFamily: "Space Grotesk, sans-serif" }}
                    className={cn(space_grotesk.className, "text-lg text-left text-black capitalize font-bold")}>
                    Ticket Order History
                </p>
            </div>

            {/* Top Section: Ticket Card + Billing Panel */}
            <div className="flex flex-col lg:flex-row">

                {/* Left: Ticket body */}
                <div className="flex flex-col sm:flex-row flex-1 gap-0">

                    {/* Event image */}
                    <div className="relative w-full sm:w-60 h-52 sm:h-auto shrink-0">
                        <Image
                            src={"/images/demo-images/event-detail-img.png"}
                            alt={event.event_name}
                            fill
                            className="object-cover"
                            crossOrigin="anonymous"
                            priority
                        />
                    </div>

                    {/* Ticket details */}
                    <div className="flex flex-col sm:flex-row flex-1 gap-6 p-6">

                        {/* Event info */}
                        <div className="flex-1 space-y-4">
                            <div>
                                <h2 className={cn(space_grotesk.className, "text-2xl font-bold text-[#0046AD] leading-tight")}>
                                    {event.event_name}
                                </h2>
                                <p className="text-brand-secondary-6 font-light capitalize mt-0.5">
                                    {event.category}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-y-4">
                                <div>
                                    <Label>Ticket Holder</Label>
                                    <Value>{billed_to.full_name}</Value>
                                </div>
                                <div>
                                    <Label>Ticket Type</Label>
                                    <Value>{ticket_type}</Value>
                                </div>
                                <div className="col-span-2">
                                    <Label>Ticket ID</Label>
                                    <Value className="tracking-wider">
                                        TKT-{String(receipt.issued_ticket_id).padStart(3, "0")}-{ticket_type.toUpperCase().replace(/\s+/g, "-")}
                                    </Value>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs text-brand-secondary-9">
                                    <span className="font-semibold">Location: </span>
                                    {locationStr}
                                </p>
                            </div>
                        </div>

                        {/* QR */}
                        <div className="flex sm:flex-col items-center gap-4 shrink-0">
                            {/* QR code */}
                            <div className="p-2 border border-brand-neutral-2 rounded-xl shrink-0">
                                <QRCodeSVG value={qrValue} size={150} level="H" />
                            </div>
                            <p className="text-[10px] text-brand-secondary-6 text-center">
                                Show this code at entrance
                            </p>
                        </div>
                    </div>
                </div>

                {/* Dashed vertical divider */}
                <DividerDashed vertical />

                {/* Right: Billing + Order info panel */}
                <div className="w-full lg:w-56 shrink-0 p-6 space-y-6">
                    <div>
                        <Label>Billed To</Label>
                        <Value className="font-medium text-sm">{billed_to.full_name}</Value>
                        <p className="text-sm text-brand-neutral-8 mt-0.5">{billed_to.email}</p>
                        {(billed_to.phone_number || billed_to.phone) && (
                            <p className="text-xs text-brand-secondary-6">
                                {billed_to.phone_number ?? billed_to.phone}
                            </p>
                        )}
                    </div>

                    <DividerDashed />

                    <div className="space-y-3">
                        <Label>Order Info</Label>
                        <div>
                            <p className="text-xs text-brand-neutral-8">Payment Date</p>
                            <p className="text-sm font-semibold">
                                {formatDateTime(payment.payment_date)}
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] text-brand-secondary-5">Payment Method</p>
                            <p className="text-sm font-medium capitalize">
                                {capitalize(payment.provider)} Inc.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Line Items Table ─────────────────────── */}
            <div className="mt-4 border-t border-brand-neutral-2">
                <table className="w-full">
                    <thead className="bg-brand-neutral-3 border-b border-brand-neutral-2">
                        <tr>
                            <th className="text-left py-3 px-6 text-sm font-semibold text-brand-secondary-8">
                                Ticket Type
                            </th>
                            <th className="text-center py-3 px-6 text-sm font-semibold text-brand-secondary-8">
                                Quantity
                            </th>
                            <th className="text-right py-3 px-6 text-sm font-semibold text-brand-secondary-8">
                                Price
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-brand-neutral-1">
                            <td className="py-4 px-6 text-sm text-brand-secondary-8">
                                {ticket_type}
                            </td>
                            <td className="py-4 px-6 text-sm text-center text-brand-secondary-8">
                                {quantity}
                            </td>
                            <td className="py-4 px-6 text-sm text-right font-medium text-brand-secondary-9">
                                {formatPrice(parseInt(payment.subtotal), user?.currency)}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end px-6 pb-8 mt-4">
                <div className="w-72 space-y-2">
                    <div className="flex justify-between text-sm text-brand-secondary-9">
                        <span className="font-bold">Subtotal</span>
                        <span>{formatPrice(parseInt(payment.subtotal), user?.currency)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-brand-secondary-9">
                        <span className="font-bold">Service Charge</span>
                        <span>{formatPrice(parseInt(payment.service_charge), user?.currency)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-brand-secondary-9">
                        <span className="font-bold">Tax</span>
                        <span>{formatPrice(parseInt(payment.tax), user?.currency)}</span>
                    </div>
                    {Number(payment.discount) > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                            <span className="font-bold">Discount</span>
                            <span>- {formatPrice(parseInt(payment.discount), user?.currency)}</span>
                        </div>
                    )}
                    <div className="border-t border-brand-neutral-3 pt-2 flex justify-between text-base font-bold text-brand-secondary-9">
                        <span className="font-bold">Total</span>
                        <span>{formatPrice(parseInt(payment.total_amount), user?.currency)}</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-brand-neutral-2 px-6 py-4 flex justify-between items-center">
                <p className="text-[10px] text-brand-neutral-6">
                    Generated by QavTix · {formatDateSimple(new Date().toISOString())}
                </p>
                <p className="text-[10px] text-brand-neutral-6">
                    Do not share · Invalid if transferred without authorization
                </p>
            </div>
        </div>
    )
}