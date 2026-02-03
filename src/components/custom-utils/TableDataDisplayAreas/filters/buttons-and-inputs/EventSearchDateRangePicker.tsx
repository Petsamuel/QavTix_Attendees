'use client'

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { formatDate, isValidDate } from "@/helper-fns/date-utils"
import { Icon } from "@iconify/react"
import { useEffect, useState } from "react"
import { DateRange } from "react-day-picker"

interface DatePickerInputProps {
    label: string
    value: Date | undefined
    onChange: (date: Date | undefined) => void
    placeholder?: string
    id?: string
}

export function DatePickerInput({
    value,
    onChange,
    placeholder = "Select date",
    id = "date"
}: DatePickerInputProps) {
    const [open, setOpen] = useState(false)
    const [month, setMonth] = useState<Date | undefined>(value || new Date())
    const [inputValue, setInputValue] = useState<string>("")

    // Sync input value when external value changes
    useEffect(() => {
        if (value && isValidDate(value)) {
            setInputValue(formatDate(value, 'full'))
            setMonth(value)
        } else {
            setInputValue("")
        }
    }, [value])

    const handleSelect = (date: Date | undefined) => {
        onChange(date)
        setOpen(false)
        // Input will update via useEffect
    }

    return (
        <div className="flex flex-col gap-3 flex-1">
            <div className="relative">
                {/* Calendar Icon Button - Triggers Popover */}
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 size-8 p-0 hover:bg-transparent"
                        >
                            <Icon
                                icon="hugeicons:calendar-03"
                                width="30"
                                height="30"
                                className="text-secondary-9 size-5"
                            />
                            <span className="sr-only">Open calendar</span>
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent
                        className="w-auto p-0 overflow-hidden text-xs z-100"
                        align="start"
                        sideOffset={8}
                    >
                        <Calendar
                            mode="single"
                            selected={value}
                            month={month}
                            onMonthChange={setMonth}
                            onSelect={handleSelect}
                            captionLayout="dropdown"
                            classNames={{
                                caption_dropdowns: "flex gap-1 font-medium! items-center text-xs",
                            }}
                        />
                    </PopoverContent>
                </Popover>

                {/* Text Input */}
                <Input
                    id={id}
                    value={inputValue}
                    onFocus={() => setOpen(true)}
                    readOnly
                    placeholder={placeholder}
                    className="pl-9 h-12 text-xs! placeholder:text-xs! rounded-2xl border border-neutral-6 focus:border-primary bg-background"
                    onKeyDown={(e) => {
                        if (e.key === "ArrowDown") {
                            e.preventDefault()
                            setOpen(true)
                        }
                    }}
                />
            </div>
        </div>
    )
}

interface DateRangePickerProps {
    value: DateRange
    onChange: (range: DateRange) => void
    fromLabel?: string
    toLabel?: string
    fromPlaceholder?: string
    toPlaceholder?: string
}

export function EventSearchDateRangePicker({
    value,
    onChange,
    fromLabel = "Start Date",
    toLabel = "End Date",
    fromPlaceholder = "Select start date",
    toPlaceholder = "Select end date"
}: DateRangePickerProps) {
    return (
        <div className="flex flex-col text-xs sm:flex-row sm:items-center gap-2">
            <DatePickerInput
                label={fromLabel}
                value={value.from}
                onChange={(date) => onChange({ ...value, from: date })}
                placeholder={fromPlaceholder}
                id="from-date"
            />

            <div className="flex items-center justify-center gap-1 text-neutral-6 pb-2 sm:pb-0">
                <span aria-hidden="true">—</span>
                <span className="">to</span>
                <span aria-hidden="true">—</span>
            </div>

            <DatePickerInput
                label={toLabel}
                value={value.to}
                onChange={(date) => onChange({ ...value, to: date })}
                placeholder={toPlaceholder}
                id="to-date"
            />
        </div>
    )
}