"use client";

import { AnimatedDialog } from "@/components/custom-utils/dialogs/AnimatedDialog";
import { DialogTitle } from "@/components/ui/dialog";
import { Icon } from "@iconify/react";
import { Dispatch, SetStateAction, useState } from "react";


interface ResellTicketProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    eventData: IEvent
    onResell: (price: string) => void;
}

export default function TicketResellFormModal({ 
    open, 
    setOpen, 
    eventData, 
    onResell 
}: ResellTicketProps) {
    const [price, setPrice] = useState("")
    const [error, setError] = useState("")

    const handleClose = () => {
        setPrice("")
        setError("")
        setOpen(false)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!price || parseFloat(price) <= 0) {
            setError("Please enter a valid resale price")
            return;
        }
        onResell(price)
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
                    List Ticket on Marketplace to resell
                </p>
            </div>

            {/* Event Info Card */}
            <div className="bg-white border border-brand-neutral-2 rounded-2xl p-5 mb-6 shadow-sm">
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className="font-bold text-brand-secondary-9 text-sm">5ive Tour</h4>
                        <p className="text-[11px] text-brand-secondary-9">Entertainment Event</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[11px] text-brand-secondary-4">Orig. Price</p>
                        <p className="font-bold text-sm text-brand-secondary-9">
                            N5,700.00
                        </p>
                    </div>
                </div>
                <p className="text-[11px] text-brand-secondary-4 mt-1 tracking-wider">
                    Ticket ID: <span className="uppercase">TKT-001-VIP-12345</span>
                </p>

                {/* Price Input Area */}
                <div className="mt-6 flex gap-2 border-b border-b-neutral-5">
                    <div className="border-e pe-3 pb-2 border-e-neutral-5">
                        <Icon icon="mdi:currency-ngn" className="text-brand-secondary-8 text-xl" />
                    </div>
                    <input
                        type="text"
                        onChange={(e) => {
                            setPrice(e.target.value)
                            if (error) setError("")
                        }}
                        placeholder="Enter Resell Price"
                        className="flex-1 text-base pb-2 ps-5 text-gray-700 placeholder:text-sm placeholder:text-brand-secondary-3 outline-none bg-transparent"
                    />
                    {error && <p className="text-[10px] text-red-500 mt-1 absolute">{error}</p>}
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