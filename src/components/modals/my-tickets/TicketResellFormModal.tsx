"use client";

import { AnimatedDialog } from "@/components/custom-utils/dialogs/AnimatedDialog";
import { DialogTitle } from "@/components/ui/dialog";
import { Icon } from "@iconify/react";
import { Dispatch, SetStateAction, useState } from "react";
import { useAppSelector } from "@/lib/redux/hooks";
import { formatPrice } from "@/helper-fns/formatPrice";
import { getCurrencySymbol } from "@/components-data/currencies";

interface ResellTicketProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    ticket: EventTicket;
    onResell: (price: string) => void;
}

export default function TicketResellFormModal({ open, setOpen, ticket, onResell }: ResellTicketProps) {
    const [displayValue, setDisplayValue] = useState("")  // formatted: "1,500,000"
    const [rawValue, setRawValue] = useState("")  // numeric string sent to API: "1500000"
    const [error, setError] = useState("")

    const { user } = useAppSelector(state => state.authUser)

    const handleClose = () => {
        setDisplayValue("")
        setRawValue("")
        setError("")
        setOpen(false)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!rawValue || isNaN(parseFloat(rawValue)) || parseFloat(rawValue) <= 0) {
            setError("Please enter a valid resale price")
            return
        }
        onResell(rawValue)
        handleClose()
    }

    return (
        <AnimatedDialog
            showCloseButton={false}
            className="md:max-w-md p-0 overflow-hidden"
            open={open}
            onOpenChange={handleClose}
        >
            <div className="flex justify-center items-center flex-col text-center mb-6">
                <DialogTitle className="text-xl font-bold text-brand-secondary-8">
                    Resell Ticket
                </DialogTitle>
                <p className="text-xs text-brand-secondary-6 mt-1">
                    List ticket on marketplace to resell
                </p>
            </div>

            {/* Event Info Card */}
            <div className="bg-white border border-brand-neutral-2 rounded-2xl p-5 mb-6 shadow-sm">
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className="font-bold text-brand-secondary-9 text-sm">{ticket.event_name}</h4>
                        <p className="text-[11px] capitalize text-brand-secondary-9">{ticket.category}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[11px] text-brand-secondary-4">Orig. Price</p>
                        <p className="font-bold text-sm text-brand-secondary-9">
                            {formatPrice(parseInt(ticket.original_price), user?.currency)}
                        </p>
                    </div>
                </div>
                <p className="text-[11px] text-brand-secondary-4 mt-1 tracking-wider">
                    Ticket ID: <span className="uppercase">{ticket.id}</span>
                </p>

                {/* Price Input */}
                <div className="mt-6 relative">
                    <div className="flex gap-2 border-b border-b-neutral-5">
                        <div className="border-e pe-3 pb-2 border-e-neutral-5">
                            <p className="text-brand-secondary-8 text-xl">
                                {getCurrencySymbol(user?.currency)}
                            </p>
                        </div>
                        <input
                            type="text"
                            inputMode="decimal"
                            value={displayValue}
                            onChange={(e) => {
                                // Strip everything except digits and one decimal point
                                const stripped = e.target.value.replace(/[^0-9.]/g, "")
                                // Prevent multiple decimal points
                                const parts = stripped.split(".")
                                const cleaned = parts.length > 2
                                    ? `${parts[0]}.${parts.slice(1).join("")}`
                                    : stripped
                                // Limit to 2 decimal places
                                const limited = cleaned.includes(".")
                                    ? `${cleaned.split(".")[0]}.${cleaned.split(".")[1].slice(0, 2)}`
                                    : cleaned
                                // Format integer part with commas
                                const [intPart, decPart] = limited.split(".")
                                const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                    + (decPart !== undefined ? `.${decPart}` : "")
                                setDisplayValue(formatted)
                                setRawValue(limited)        // clean number for API
                                if (error) setError("")
                            }}
                            placeholder="Enter Resell Price"
                            className="flex-1 text-base pb-2 ps-5 text-gray-700 placeholder:text-sm placeholder:text-brand-secondary-3 outline-none bg-transparent"
                        />
                    </div>
                    {error && (
                        <p className="text-[10px] text-red-500 mt-1">{error}</p>
                    )}
                </div>

                {/* Service Charge Notice */}
                <div className="mt-4 bg-[#FFF4ED] border border-[#FFD9C3] rounded-sm p-1">
                    <p className="text-[11px] text-[#FF7A1A] text-center font-medium">
                        All ticket sales processed are subject to a 15% service charge.
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 h-12 md:h-14 rounded-full border border-brand-secondary-6 text-brand-secondary-8 font-semibold text-sm hover:bg-brand-neutral-3 transition-all"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    onClick={handleSubmit}
                    className="flex-1 h-12 md:h-14 rounded-full bg-brand-primary text-white font-semibold text-sm hover:bg-brand-primary-7 shadow-md transition-all active:scale-[0.98]"
                >
                    List on Marketplace
                </button>
            </div>
        </AnimatedDialog>
    )
}