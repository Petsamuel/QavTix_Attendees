'use client'

import { useState } from 'react'
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import EventFilterTypeBtn from './buttons-and-inputs/EventFilterTypeBtn'
import { eventTypeOptions } from "../resources/event-type-filter"
import FilterButtonsActions1 from "./buttons-and-inputs/FilterActionButtons1"

interface EventTypeFilterProps {
    value?: string[]
    onChange: (value: string[]) => void
    icon?: string
}

export function EventTypeFilter({ value = [], onChange, icon }: EventTypeFilterProps) {

    const [isOpen, setIsOpen] = useState(false)
    const [selectedTypes, setSelectedTypes] = useState<string[]>(value)

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open)
        if (open) {
            setSelectedTypes(value)
        }
    }

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
    }

    const hasActiveFilter = value.length > 0
    const displayText = hasActiveFilter ? `${value.length} selected` : 'Event Type'

    return (
        <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
            <DropdownMenuTrigger asChild>
                <EventFilterTypeBtn
                    icon={icon}
                    displayText={displayText}
                    hasActiveFilter={hasActiveFilter}
                />
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="start"
                sideOffset={8}
                className="w-80 md:w-112.5 p-3 rounded-xl shadow-xl border border-brand-neutral-2 bg-white z-100"
            >
                <div className="space-y-3">
                    {/* Header */}
                    <div className="px-1">
                        <h3 className="font-bold text-brand-secondary-9">Event Type</h3>
                        <p className="text-xs text-brand-neutral-6 mt-0.5">
                            Select one or more event types
                        </p>
                    </div>

                    {/* Grid of Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 max-h-100 overflow-y-auto">
                        {eventTypeOptions.map((type) => {
                            const isSelected = selectedTypes.includes(type.value)
                            return (
                                <DropdownMenuItem
                                    key={type.value}
                                    onSelect={(e) => {
                                        e.preventDefault()
                                        handleToggle(type.value)
                                    }}
                                    className={cn(
                                        "flex items-center gap-2.5 p-2 rounded-lg cursor-pointer transition-all outline-none",
                                        "focus:bg-brand-neutral-1",
                                        isSelected
                                            ? "bg-brand-accent-1 border border-brand-accent-6"
                                            : "bg-brand-neutral-3 hover:bg-brand-neutral-4!"
                                    )}
                                >
                                    <div className={cn(
                                        "size-7 rounded-lg flex items-center justify-center shrink-0 transition-colors"
                                    )}>
                                        <Icon icon={type.icon} className="size-4 text-brand-neutral-7" />
                                    </div>
                                    
                                    <span className={cn(
                                        "text-xs md:text-sm font-medium flex-1 truncate",
                                        isSelected ? "text-brand-accent-5" : "text-brand-secondary-8"
                                    )}>
                                        {type.label}
                                    </span>

                                    {isSelected && 
                                        <Icon 
                                            icon="iconamoon:check-bold" 
                                            className="size-3 text-brand-accent-5 shrink-0" 
                                        />
                                    }
                                </DropdownMenuItem>
                            )
                        })}
                    </div>

                    <div className="pt-2 border-t border-brand-neutral-2">
                        <FilterButtonsActions1 onApply={handleApply} onClear={handleClear} />
                    </div>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}