'use client'

import { useState } from "react"
import EventFilterTypeBtn from "./buttons-and-inputs/EventFilterTypeBtn"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

interface SortOption {
    value: string
    label: string
    icon: string
    description: string
}

const sortOptions: SortOption[] = [
    {
        value: 'date-newest',
        label: 'Newest First',
        icon: 'mdi:arrow-down',
        description: 'Most recent events'
    },
    {
        value: 'date-oldest',
        label: 'Oldest First',
        icon: 'mdi:arrow-up',
        description: 'Earliest events'
    },
    {
        value: 'name-asc',
        label: 'Name (A-Z)',
        icon: 'mdi:sort-alphabetical-ascending',
        description: 'Alphabetically ascending'
    },
    {
        value: 'name-desc',
        label: 'Name (Z-A)',
        icon: 'mdi:sort-alphabetical-descending',
        description: 'Alphabetically descending'
    },
    {
        value: 'sales-high',
        label: 'Highest Sales',
        icon: 'mdi:trending-up',
        description: 'Best performing first'
    },
    {
        value: 'sales-low',
        label: 'Lowest Sales',
        icon: 'mdi:trending-down',
        description: 'Lowest performing first'
    },
    {
        value: 'attendees-high',
        label: 'Most Attendees',
        icon: 'mdi:account-group',
        description: 'Largest events first'
    },
    {
        value: 'attendees-low',
        label: 'Least Attendees',
        icon: 'mdi:account-outline',
        description: 'Smallest events first'
    }
]

interface SortByFilterProps {
    value?: string
    onChange: (value: string) => void
    icon: string
}

export function SortByFilter({ value = 'date-newest', onChange, icon }: SortByFilterProps) {

    const [isOpen, setIsOpen] = useState(false)
    const [selectedSort, setSelectedSort] = useState<string>(value)

    const handleSelect = (sortValue: string) => {
        setSelectedSort(sortValue)
        onChange(sortValue)
    }

    const handleReset = () => {
        setSelectedSort('date-newest')
        onChange('date-newest')
    }

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <EventFilterTypeBtn
                    icon={icon}
                    displayText="Sort By"
                    onClick={() => setIsOpen(true)}
                    hasActiveFilter={selectedSort !== 'date-newest'}
                />
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="start"
                sideOffset={5}
                className={cn(
                    "w-64 z-200! p-4 rounded-xl shadow-[0px_3.69px_14.76px_0px_rgba(51,38,174,0.08)]",
                    // Open animation
                    "data-[state=open]:animate-in",
                    "data-[state=open]:fade-in-0",
                    "data-[state=open]:duration-500 data-[state=open]:ease-[cubic-bezier(0.16,1,0.3,1)]",
                    "data-[state=open]:zoom-in-90",
                    "data-[state=open]:slide-in-from-top-4",
                    // Close animation
                    "data-[state=closed]:animate-out",
                    "data-[state=closed]:fade-out-0",
                    "data-[state=closed]:duration-400 data-[state=closed]:ease-in",
                    "data-[state=closed]:zoom-out-90",
                    "data-[state=closed]:slide-out-to-top-4"
                )}
            >
                <p className="px-2 py-1.5 text-[10px] uppercase tracking-wider font-bold text-brand-neutral-5">
                    Sort Events
                </p>

                {sortOptions.map((option) => {
                    const isSelected = selectedSort === option.value
                    return (
                        <DropdownMenuItem
                            key={option.value}
                            onSelect={(e) => {
                                e.preventDefault()
                                handleSelect(option.value)
                            }}
                            className={cn(
                                "flex items-center gap-2.5 px-2 py-2.5 rounded-lg cursor-pointer transition-colors outline-none",
                                "focus:bg-brand-neutral-1 active:scale-[0.98]",
                                isSelected ? "bg-brand-primary-1/40" : ""
                            )}
                        >
                            <div className={cn(
                                "size-8 rounded-lg flex items-center justify-center shrink-0",
                                isSelected ? "bg-brand-primary-6" : "bg-brand-neutral-2"
                            )}>
                                <Icon
                                    icon={option.icon}
                                    className={cn('size-4', isSelected ? 'text-white' : 'text-brand-neutral-7')}
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={cn(
                                    'text-xs font-medium',
                                    isSelected ? 'text-brand-primary-8' : 'text-brand-secondary-9'
                                )}>
                                    {option.label}
                                </p>
                                <p className="text-[10px] text-brand-neutral-6 truncate">{option.description}</p>
                            </div>
                            {isSelected && (
                                <Icon icon="iconamoon:check-bold" className="text-brand-primary-6 size-3 shrink-0" />
                            )}
                        </DropdownMenuItem>
                    )
                })}

                {selectedSort !== 'date-newest' && (
                    <>
                        <DropdownMenuSeparator className="my-2 bg-brand-neutral-2" />
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                handleReset()
                            }}
                            className="w-full text-center py-1.5 text-[11px] font-medium text-brand-neutral-6 hover:text-red-500 transition-colors"
                        >
                            Reset to Default
                        </button>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}