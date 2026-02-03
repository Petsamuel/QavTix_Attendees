"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { AnimatedDialog } from "../../custom-utils/dialogs/AnimatedDialog";
import { DialogTitle } from "../../ui/dialog";
import CustomInput2 from "../../custom-utils/inputs/CustomInput2";
import { validateEmail } from "@/helper-fns/validateEmail";

interface TransferTicketProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    onTransfer: (email: string) => void;
}

export default function TransferTicketFormModal({ open, setOpen, onTransfer }: TransferTicketProps) {
    
    
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")

    const handleClose = () => {
        setEmail("")
        setError("")
        setOpen(false)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const validationError = validateEmail(email)
        
        if (validationError) {
            setError(validationError)
            return;
        }

        onTransfer(email)
        handleClose()
    }

    return (
        <AnimatedDialog 
            showCloseButton={false} 
            className="md:max-w-sm py-2 overflow-hidden" 
            open={open} 
            onOpenChange={handleClose}
        >
            <div className="flex justify-center items-center flex-col text-center">
                <DialogTitle className="text-lg md:text-xl font-bold text-brand-secondary-8">
                    Transfer Ticket
                </DialogTitle>
                <p className="text-xs md:text-sm text-brand-secondary-6 mt-1">
                    Enter Recipient Email Address
                </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-8">
                <CustomInput2
                    label="Recipient"
                    placeholder="Enter Recipient's Email"
                    value={email}
                    error={error}
                    onChange={(e) => {
                        setEmail(e.target.value)
                        if (error) setError("")
                    }}
                    className="bg-brand-neutral-4! h-12! focus:border-brand-primary-4"
                />

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="flex-1 h-12 md:h-14 rounded-full border border-brand-secondary-6 text-brand-secondary-8 font-semibold text-sm hover:bg-brand-neutral-3 transition-all"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="flex-1 h-12 md:h-14 rounded-full bg-brand-primary text-white font-semibold text-sm hover:bg-brand-primary-7 shadow-md transition-all active:scale-[0.98]"
                    >
                        Transfer Ticket
                    </button>
                </div>
            </form>
        </AnimatedDialog>
    )
}