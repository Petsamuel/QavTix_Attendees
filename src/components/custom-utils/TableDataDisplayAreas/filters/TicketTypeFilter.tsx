import { useState } from "react"
import { AnimatedDialog } from "../../dialogs/AnimatedDialog"
import EventFilterTypeBtn from "./buttons-and-inputs/EventFilterTypeBtn"
import { Icon } from "@iconify/react"
import FilterButtonsActions1 from "./buttons-and-inputs/FilterActionButtons1"
import { cn } from "@/lib/utils"



interface TicketTypeOption {
    value: string
    label: string
    icon: string
    description: string
}

const ticketTypeOptions: TicketTypeOption[] = [
    {
        value: 'free',
        label: 'Free',
        icon: 'mdi:gift-outline',
        description: 'No cost to attend'
    },
    {
        value: 'paid',
        label: 'Paid',
        icon: 'mdi:currency-usd',
        description: 'Requires payment'
    },
    {
        value: 'donation',
        label: 'Donation',
        icon: 'mdi:hand-heart',
        description: 'Pay what you can'
    }
]

interface TicketTypeFilterProps {
    value?: string[]
    onChange: (value: string[]) => void
    icon: string
}

export function TicketTypeFilter({ value = [], onChange, icon }: TicketTypeFilterProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedTypes, setSelectedTypes] = useState<string[]>(value)

    const handleToggle = (typeValue: string) => {
        setSelectedTypes((prev) =>
            prev.includes(typeValue)
                ? prev.filter((v) => v !== typeValue)
                : [...prev, typeValue]
        )
    }

    const handleApply = () => {
        onChange(selectedTypes)
        setIsOpen(false)
    }

    const handleClear = () => {
        setSelectedTypes([])
        onChange([])
    }

    return (
        <AnimatedDialog
            onOpenChange={setIsOpen}
            open={isOpen}
            title='Ticket Type'
            trigger={
                <EventFilterTypeBtn
                    icon={icon}
                    onClick={() => setIsOpen(true)}
                    displayText="Ticket Type"
                    hasActiveFilter={selectedTypes.length > 0}
                />
            }
        >
            <div className="space-y-6">
                <div className="grid grid-cols-1 gap-3">
                    {ticketTypeOptions.map((type) => {
                        const isSelected = selectedTypes.includes(type.value)
                        return (
                            <button
                                key={type.value}
                                onClick={() => handleToggle(type.value)}
                                className={cn(
                                    'flex items-center gap-4 p-5 rounded-2xl border-2 transition-all',
                                    isSelected
                                        ? 'border-brand-primary-6 bg-linear-to-br from-primary-1 to-primary-2 shadow-md'
                                        : 'border-neutral-3 hover:border-brand-primary-3 hover:bg-brand-neutral-1'
                                )}
                            >
                                <div className={cn(
                                    'w-12 h-12 rounded-xl flex items-center justify-center transition-colors',
                                    isSelected ? 'bg-brand-primary-6' : 'bg-brand-neutral-2'
                                )}>
                                    <Icon
                                        icon={type.icon}
                                        className={cn('w-6 h-6', isSelected ? 'text-white' : 'text-brand-neutral-7')}
                                    />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className={cn('font-semibold', isSelected ? 'text-brand-primary-8' : 'text-brand-secondary-9')}>
                                        {type.label}
                                    </p>
                                    <p className="text-sm text-brand-neutral-6">{type.description}</p>
                                </div>
                                {isSelected && (
                                    <Icon icon="mdi:check-circle" className="w-6 h-6 text-brand-primary-6" />
                                )}
                            </button>
                        )
                    })}
                </div>
                <FilterButtonsActions1 onApply={handleApply} onClear={handleClear} />
            </div>
        </AnimatedDialog>
    )
}
