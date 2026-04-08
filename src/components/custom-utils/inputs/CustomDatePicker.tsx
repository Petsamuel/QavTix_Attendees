'use client'

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { delay } from "@/helper-fns/delay"

interface CustomDatePickerProps {
    label:        string
    value?:       Date | null
    onChange:     (date?: Date) => void
    error?:       string
    placeholder?: string
    icon?:        LucideIcon
    className?:   string
    disabled?:    boolean
    showRequired?:    boolean
    fromYear?:    number
    toYear?:      number
}

export default function CustomDatePicker({
    label,
    value,
    onChange,
    error,
    showRequired = false,
    placeholder = "DD/MM/YYYY",
    icon: Icon   = CalendarIcon,
    className,
    disabled,
    toYear       = new Date().getFullYear(),
}: CustomDatePickerProps) {

    const [open, setOpen] = React.useState(false)

    const handleSelect = async (date?: Date) => {
        onChange(date) 
        await delay(200)
        setOpen(false)
    }

    return (
        <div className={cn("w-full space-y-2.75", className)}>
            <label className="block text-sm font-medium text-brand-secondary-9 mb-2">
                {label}
                {showRequired && (
                    <span className="text-red-500 ml-0.5">*</span>
                )}
            </label>

            <Popover open={open} onOpenChange={disabled ? undefined : setOpen}>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        disabled={disabled}
                        className={cn(
                            "w-full h-14 px-4 flex items-center justify-between text-sm rounded-lg transition-all outline-none bg-white",
                            error
                                ? "border border-red-400 focus:border-red-500"
                                : "border border-brand-secondary-5 focus:border-[1.5px] focus:border-brand-accent-4 hover:border-brand-secondary-6",
                            !value ? "text-brand-secondary-5" : "text-brand-neutral-9",
                            disabled && "opacity-60 cursor-not-allowed"
                        )}
                    >
                        <span>
                            {value ? format(value, "PPP") : placeholder}
                        </span>
                        <Icon className="size-4 opacity-50" />
                    </button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={value ?? undefined}
                        onSelect={handleSelect}
                        captionLayout="dropdown"
                        defaultMonth={value ?? new Date(toYear - 25, 0)}
                    />
                </PopoverContent>
            </Popover>

            {error && (
                <p className="text-xs text-red-500 ml-1 mt-1">{error}</p>
            )}
        </div>
    )
}