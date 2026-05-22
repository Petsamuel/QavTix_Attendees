'use client'

import * as React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { ChevronDown, Search, Check } from 'lucide-react'

interface Option {
    value: string
    label: string
}

interface SearchableSelectProps {
    label: string
    error?: string
    required?: boolean
    showRequired?: boolean
    options: readonly Option[] | Option[]
    value?: string
    onValueChange?: (value: string) => void
    disabled?: boolean
    placeholder?: string
    className?: string
}

export default function SearchableSelect({
    label,
    error,
    required,
    showRequired = false,
    options,
    value,
    onValueChange,
    disabled,
    placeholder,
    className = '',
}: SearchableSelectProps) {
    const [open, setOpen] = React.useState(false)
    const [searchQuery, setSearchQuery] = React.useState('')

    const selectedOption = React.useMemo(() => {
        return options.find(opt => opt.value === value)
    }, [options, value])

    const filteredOptions = React.useMemo(() => {
        return options.filter(opt => {
            const name = opt.label.toLowerCase()
            const val = opt.value.toLowerCase()
            const query = searchQuery.toLowerCase()
            return name.includes(query) || val.includes(query)
        })
    }, [options, searchQuery])

    return (
        <div className={cn("w-full", className)}>
            <Label className="block text-sm font-medium text-brand-secondary-9 mb-2">
                {label}
                {(showRequired || required) && (
                    <span className="text-red-500 ml-0.5">*</span>
                )}
            </Label>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        disabled={disabled}
                        className={cn(
                            "w-full flex items-center justify-between px-4 py-3 text-sm rounded-lg shadow-none min-h-14 h-14 border transition-all outline-none bg-white text-left",
                            error
                                ? 'border-red-400 focus:border-red-500'
                                : 'border-brand-secondary-5 focus:border-[1.5px] focus:border-brand-accent-4 hover:border-brand-neutral-6',
                            disabled && "cursor-not-allowed opacity-80 pointer-events-none"
                        )}
                    >
                        <span className={cn(
                            "block truncate",
                            !selectedOption && "text-brand-secondary-5"
                        )}>
                            {selectedOption ? selectedOption.label : (placeholder || `Select ${label.toLowerCase()}`)}
                        </span>
                        <ChevronDown className="size-4 text-brand-secondary-5 shrink-0 ml-2" />
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 animate-in fade-in-50 slide-in-from-top-1 duration-150" align="start" sideOffset={6}>
                    <div className="flex items-center border-b px-3 py-2 bg-neutral-50 rounded-t-lg">
                        <Search className="size-4 mr-2 text-neutral-400 shrink-0" />
                        <input
                            type="text"
                            placeholder={`Search ${label.toLowerCase()}...`}
                            className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400 text-brand-neutral-9 py-1"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <ul className="max-h-60 overflow-y-auto py-1">
                        {filteredOptions.length === 0 ? (
                            <li className="px-4 py-3 text-sm text-neutral-400 text-center">
                                No options found
                            </li>
                        ) : (
                            filteredOptions.map((option) => {
                                const isSelected = option.value === value
                                return (
                                    <li key={option.value}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (onValueChange) {
                                                    onValueChange(option.value)
                                                }
                                                setOpen(false)
                                                setSearchQuery('')
                                            }}
                                            className={cn(
                                                "flex items-center justify-between w-full px-4 py-2.5 text-left text-sm hover:bg-neutral-50 transition-colors",
                                                isSelected && "bg-neutral-100 font-medium text-brand-accent-6"
                                            )}
                                        >
                                            <span className="truncate flex-1 text-xs">{option.label}</span>
                                            {isSelected && (
                                                <Check className="size-4 text-brand-accent-6 shrink-0 ml-2" />
                                            )}
                                        </button>
                                    </li>
                                )
                            })
                        )}
                    </ul>
                </PopoverContent>
            </Popover>
            {error && <p className="text-xs text-red-500 mt-1.5 ml-1">{error}</p>}
        </div>
    )
}
