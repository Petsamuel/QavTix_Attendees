import { useState } from "react"
import { AnimatedDialog } from "../../dialogs/AnimatedDialog"
import EventFilterTypeBtn from "./buttons-and-inputs/EventFilterTypeBtn"
import { Icon } from "@iconify/react"
import FilterButtonsActions1 from "./buttons-and-inputs/FilterActionButtons1"
import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"


interface SalePerformanceFilterProps {
    value?: { min: number; max: number }
    onChange: (value: { min: number; max: number }) => void
    icon: string
}

export function SalePerformanceFilter({ value, onChange, icon }: SalePerformanceFilterProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [range, setRange] = useState<[number, number]>(
        value ? [value.min, value.max] : [0, 100]
    )

    const performanceLevels = [
        { label: 'Low', value: [0, 30], color: 'bg-red-500' },
        { label: 'Medium', value: [30, 70], color: 'bg-yellow-500' },
        { label: 'High', value: [70, 100], color: 'bg-green-500' }
    ]

    const handleApply = () => {
        onChange({ min: range[0], max: range[1] })
        setIsOpen(false)
    }

    const handleClear = () => {
        setRange([0, 100])
        onChange({ min: 0, max: 100 })
    }

    const handlePresetSelect = (min: number, max: number) => {
        setRange([min, max])
    }

    return (
        <AnimatedDialog
            onOpenChange={setIsOpen}
            open={isOpen}
            title='Sale Performance'
            trigger={
                <EventFilterTypeBtn
                    icon={icon}
                    onClick={() => setIsOpen(true)}
                    displayText="Performance"
                    hasActiveFilter={value ? (value.min > 0 || value.max < 100) : false}
                />
            }
        >
            <div className="space-y-6">
                {/* Quick Presets */}
                <div className="space-y-3">
                    <p className="text-sm font-medium text-brand-neutral-7">Quick Select</p>
                    <div className="grid grid-cols-3 gap-2">
                        {performanceLevels.map((level) => (
                            <button
                                key={level.label}
                                onClick={() => handlePresetSelect(level.value[0], level.value[1])}
                                className={cn(
                                    'flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all',
                                    range[0] === level.value[0] && range[1] === level.value[1]
                                        ? 'border-brand-primary-6 bg-brand-primary-1'
                                        : 'border-neutral-3 hover:border-neutral-4'
                                )}
                            >
                                <div className={cn('w-8 h-2 rounded-full', level.color)} />
                                <span className="text-xs font-medium text-brand-secondary-9">{level.label}</span>
                                <span className="text-xs text-brand-neutral-6">{level.value[0]}-{level.value[1]}%</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Range Slider */}
                <div className="space-y-4 pt-4">
                    <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-brand-neutral-7">Custom Range</p>
                        <p className="text-sm font-semibold text-brand-primary-6">
                            {range[0]}% - {range[1]}%
                        </p>
                    </div>
                    <Slider
                        value={range}
                        onValueChange={(val) => setRange(val as [number, number])}
                        min={0}
                        max={100}
                        step={5}
                        className="w-full"
                    />
                    <div className="flex justify-between text-xs text-brand-neutral-6">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                    </div>
                </div>

                {/* Visual Indicator */}
                <div className="bg-brand-neutral-2 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <Icon icon="mdi:chart-line" className="w-8 h-8 text-brand-primary-6" />
                        <div>
                            <p className="text-sm font-medium text-brand-secondary-9">
                                Filtering: {range[0]}% - {range[1]}%
                            </p>
                            <p className="text-xs text-brand-neutral-6">
                                Shows events with ticket sales in this range
                            </p>
                        </div>
                    </div>
                </div>

                <FilterButtonsActions1 onApply={handleApply} onClear={handleClear} />
            </div>
        </AnimatedDialog>
    )
}
