import { addDays, endOfMonth, endOfWeek, startOfMonth, startOfWeek } from "@/helper-fns/date-utils"
import { cn } from "@/lib/utils"
import { DateRange } from "react-day-picker"

interface QuickDateButtonsProps {
  selectedRange: DateRange
  onSelect: (range: DateRange) => void
}

export function QuickDateButtons({ selectedRange, onSelect }: QuickDateButtonsProps) {
    const today = new Date()
    today.setHours(0, 0, 0, 0) 
    
    const quickDates = [
        {
            label: 'Today',
            getValue: () => {
                const date = new Date()
                date.setHours(0, 0, 0, 0)
                return { from: date, to: date }
            }
        },
        {
            label: 'Tomorrow',
            getValue: () => {
                const tomorrow = addDays(new Date(), 1)
                tomorrow.setHours(0, 0, 0, 0)
                return { from: tomorrow, to: tomorrow }
            }
        },
        {
            label: 'This week',
            getValue: () => ({
                from: startOfWeek(today),
                to: endOfWeek(today)
            })
        },
        {
            label: 'This month',
            getValue: () => ({
                from: startOfMonth(today),
                to: endOfMonth(today)
            })
        }
    ]

    const isSelected = (getValue: () => DateRange) => {
        const range = getValue()
        return (
        selectedRange.from?.toDateString() === range.from?.toDateString() &&
        selectedRange.to?.toDateString() === range.to?.toDateString()
        )
    }

    return (
        <div className="flex flex-wrap gap-3">
            {quickDates.map((option) => (
                <button
                    key={option.label}
                    onClick={() => onSelect(option.getValue())}
                    className={cn(
                        'px-4 py-3 rounded-lg h-10 flex justify-center items-center text-xs font-medium transition-all',
                        isSelected(option.getValue)
                        ? 'bg-brand-primary-1 text-brand-neutral-8 border border-brand-primary-6'
                        : 'bg-white text-brand-neutral-7 border border-brand-neutral-4 hover:border-brand-neutral-6'
                    )}
                >
                    {option.label}
                </button>
            ))}
        </div>
    )
}