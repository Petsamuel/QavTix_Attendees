"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Icon } from "@iconify/react"
import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { buildUpcomingEventActions } from "./resources/upcoming-events-actions"
import ShareEventModal from "@/components/modals/ShareEventModal"
import { useAppDispatch } from "@/lib/redux/hooks"
import { showAlert } from "@/lib/redux/slices/alertSlice"
import { EVENT_DETAILS_LINK, EXPLORE_EVENT_LINK } from "@/enums/navigation"
import DownloadReceipt from "@/components/receipts/DownloadReceipt"

interface EventsItemDropdownProps {
    ticket: EventTicket
    disabled?: boolean
}

export default function EventsItemDropdown({ ticket, disabled = false }: EventsItemDropdownProps) {

    const dispatch = useAppDispatch()

    const [loadingAction, setLoadingAction] = useState<string | null>(null)
    const [isOpen, setIsOpen] = useState(false)
    const [showShare, setShowShare] = useState(false)
    const [receiptData, setReceiptData] = useState<TicketReceipt | null>(null)

    // Centralised error dispatcher — used by action callbacks AND the catch below
    const dispatchError = (title: string, description: string) => {
        dispatch(showAlert({ variant: "destructive", title, description }))
    }

    const actions = useMemo(
        () => buildUpcomingEventActions(
            ticket,
            () => setShowShare(true),
            (receipt) => setReceiptData(receipt),
            (msg) => dispatchError("Receipt Error", msg),
        ),
        [ticket]
    )

    const handleAction = async (action: ReturnType<typeof buildUpcomingEventActions>[number]) => {
        if (loadingAction) return
        setLoadingAction(action.id)
        try {
            await action.onClick?.()
        } catch (err) {
            // Catches unexpected throws (network crash, runtime error, etc.)
            // that weren't already handled inside the action's own onClick
            console.error(`Action "${action.label}" failed:`, err)
            dispatchError(
                "Something went wrong",
                `Could not complete "${action.label}". Please try again.`
            )
        } finally {
            setLoadingAction(null)
            setIsOpen(false)
        }
    }

    return (
        <>
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild disabled={disabled} className="h-fit flex justify-center items-center">
                    <button
                        className={cn(
                            "p-1 border border-brand-neutral-5 rounded-md transition-colors",
                            disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-brand-neutral-2"
                        )}
                        disabled={disabled}
                    >
                        <Icon icon="tabler:dots" className="w-5 h-5 text-brand-secondary-9 hidden md:inline-block" />
                        <Icon icon="ix:context-menu" className="w-5 h-5 text-brand-secondary-9 md:hidden" />
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-52 text-brand-secondary-9 space-y-1.5">
                    {actions.map((action) => {
                        const isActionLoading = loadingAction === action.id
                        const isActionDisabled = loadingAction !== null && !isActionLoading

                        return (
                            <DropdownMenuItem
                                key={action.id}
                                asChild
                                onSelect={(e) => e.preventDefault()}
                            >
                                <button
                                    type="button"
                                    disabled={isActionDisabled}
                                    onClick={() => { if (!isActionDisabled) handleAction(action) }}
                                    className={cn(
                                        "w-full text-left flex items-center text-xs gap-2 font-normal cursor-pointer transition-colors px-2 py-1.5 rounded-sm",
                                        "hover:bg-brand-neutral-4 focus:bg-brand-neutral-4 focus:outline-none",
                                        action.variant === 'danger' && "text-red-600 hover:bg-red-50 focus:bg-red-50",
                                        isActionDisabled && "opacity-40 cursor-not-allowed",
                                    )}
                                >
                                    {isActionLoading
                                        ? <Icon icon="eos-icons:three-dots-loading" className="size-4" />
                                        : <Icon icon={action.icon} className="size-4.5" />
                                    }
                                    {action.label}
                                </button>
                            </DropdownMenuItem>
                        )
                    })}
                </DropdownMenuContent>
            </DropdownMenu>

            <ShareEventModal
                isOpen={showShare}
                onClose={() => setShowShare(false)}
                shareUrl={`${EVENT_DETAILS_LINK.replace("[event_id]", ticket.event_id)}`}
                title={ticket.event_name}
            />

            {receiptData && (
                <DownloadReceipt
                    receipt={receiptData}
                    onDone={() => setReceiptData(null)}
                    onError={(msg) => {
                        setReceiptData(null)
                        dispatchError("Download Failed", msg)
                    }}
                />
            )}
        </>
    )
}