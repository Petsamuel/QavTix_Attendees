"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import { setDefaultPaymentMethod } from "@/actions/payment"
import { useAppDispatch } from "@/lib/redux/hooks"
import { showAlert } from "@/lib/redux/slices/alertSlice"


const BrandIcon = ({ brand }: { brand: string }) => {
    const logos: Record<string, string> = {
        visa:       "/images/vectors/visa.svg",
        mastercard: "/images/vectors/mastercard.svg",
        verve:      "/images/vectors/verve.svg",
        amex:      "/images/vectors/amex.svg",
    }
    const src = logos[brand.toLowerCase().trim()]

    if (!src) {
        return (
            <div className="w-8 h-8 rounded-md bg-brand-neutral-3 flex items-center justify-center">
                <Icon icon="ph:credit-card" className="size-4 text-brand-neutral-6" />
            </div>
        )
    }

    return (
        <div className="w-8 h-8 rounded-md bg-white border border-brand-neutral-3 flex items-center justify-center overflow-hidden shadow-sm">
            <img src={src} alt={brand} className="h-4 w-auto object-contain" />
        </div>
    )
}

interface Props {
    open:         boolean
    onOpenChange: (open: boolean) => void
    methods:      PaymentMethod[]
    onSaved:      (methods: PaymentMethod[]) => void
}

export default function ChangeDefaultCardModal({ open, onOpenChange, methods, onSaved }: Props) {

    const dispatch   = useAppDispatch()
    const currentDefault = methods.find(m => m.is_default)

    const [selectedId, setSelectedId] = useState<string>(
        String(currentDefault?.id ?? methods[0]?.id ?? "")
    )
    const [isSaving,   setIsSaving]   = useState(false)

    const handleSave = async () => {
        const id = parseInt(selectedId)
        if (isNaN(id) || id === currentDefault?.id) {
            onOpenChange(false)
            return
        }

        setIsSaving(true)
        const result = await setDefaultPaymentMethod(id)
        setIsSaving(false)

        if (result.success) {
            const updated = methods.map(m => ({ ...m, is_default: m.id === id }))
            onSaved(updated)
            onOpenChange(false)
            dispatch(showAlert({
                variant:     "default",
                title:       "Default card updated",
                description: `Card ending in ${methods.find(m => m.id === id)?.last4} is now your default.`,
            }))
        } else {
            dispatch(showAlert({
                variant:     "destructive",
                title:       "Could not update default card",
                description: result.message ?? "Please try again.",
            }))
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-88 rounded-2xl p-6">
                <div className="text-center mb-6">
                    <DialogTitle className="text-brand-secondary-9 font-bold text-base">
                        Select Default Card
                    </DialogTitle>
                    <DialogDescription className="text-xs text-brand-secondary-5 mt-1">
                        Choose your default card for quick payments
                    </DialogDescription>
                </div>

                <RadioGroup
                    value={selectedId}
                    onValueChange={setSelectedId}
                    className="space-y-3"
                >
                    {methods.map(method => {
                        const expiry = `${String(method.exp_month).padStart(2, "0")}/${method.exp_year}`
                        const isSelected = selectedId === String(method.id)

                        return (
                            <Label
                                key={method.id}
                                htmlFor={String(method.id)}
                                className={cn(
                                    "flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer",
                                    isSelected
                                        ? "border-brand-primary-4 bg-brand-primary-1/30"
                                        : "border-brand-neutral-3 hover:bg-brand-neutral-1"
                                )}
                            >
                                <BrandIcon brand={method.brand} />

                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-brand-secondary-9 font-mono tracking-wider">
                                        •••• •••• •••• {method.last4}
                                    </p>
                                    <p className="text-[10px] text-brand-secondary-5 mt-0.5">{expiry}</p>
                                </div>

                                <RadioGroupItem
                                    value={String(method.id)}
                                    id={String(method.id)}
                                    className="border-[1.5px] shrink-0 data-[state=checked]:border-brand-primary-6 data-[state=checked]:text-brand-primary-6"
                                />
                            </Label>
                        )
                    })}
                </RadioGroup>

                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="mt-6 w-full h-12 rounded-full bg-brand-primary-6 hover:bg-brand-primary-7 text-white font-semibold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isSaving
                        ? <Icon icon="eos-icons:three-dots-loading" className="size-6" />
                        : "Save Changes"
                    }
                </button>
            </DialogContent>
        </Dialog>
    )
}