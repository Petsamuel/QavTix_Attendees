import { useState } from "react"
import { AnimatedDialog } from "../../dialogs/AnimatedDialog"
import EventFilterTypeBtn from "./buttons-and-inputs/EventFilterTypeBtn"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import FilterButtonsActions1 from "./buttons-and-inputs/FilterActionButtons1"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

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

export function SortBy_Filter({ value = 'date-newest', onChange, icon }: SortByFilterProps) {

    const [isOpen, setIsOpen] = useState(false)
    const [selectedSort, setSelectedSort] = useState<string>(value)

    const handleApply = () => {
        onChange(selectedSort)
        setIsOpen(false)
    }

    const handleClear = () => {
        setSelectedSort('date-newest')
        onChange('date-newest')
    }

    const currentSort = sortOptions.find(opt => opt.value === selectedSort)

    return (
        <AnimatedDialog
            onOpenChange={setIsOpen}
            open={isOpen}
            title='Sort Events'
            trigger={
                <EventFilterTypeBtn
                    icon={icon}
                    onClick={() => setIsOpen(true)}
                    displayText="Sort By"
                    hasActiveFilter={selectedSort !== 'date-newest'}
                />
            }
        >
            <div className="space-y-6">
                <RadioGroup value={selectedSort} onValueChange={setSelectedSort}>
                    <div className="space-y-2">
                        {sortOptions.map((option) => {
                            const isSelected = selectedSort === option.value
                            return (
                                <label
                                    key={option.value}
                                    className={cn(
                                        'flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all',
                                        isSelected
                                            ? 'border-brand-primary-6 bg-brand-primary-1 shadow-sm'
                                            : 'border-neutral-3 hover:border-neutral-4 hover:bg-brand-neutral-1'
                                    )}
                                >
                                    <RadioGroupItem value={option.value} id={option.value} />
                                    <div className={cn(
                                        'w-10 h-10 rounded-lg flex items-center justify-center',
                                        isSelected ? 'bg-brand-primary-6' : 'bg-brand-neutral-2'
                                    )}>
                                        <Icon
                                            icon={option.icon}
                                            className={cn('w-5 h-5', isSelected ? 'text-white' : 'text-brand-neutral-7')}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className={cn('font-medium', isSelected ? 'text-brand-primary-8' : 'text-brand-secondary-9')}>
                                            {option.label}
                                        </p>
                                        <p className="text-xs text-brand-neutral-6">{option.description}</p>
                                    </div>
                                </label>
                            )
                        })}
                    </div>
                </RadioGroup>

                {/* Current Selection Summary */}
                <div className="bg-linear-to-br from-primary-1 to-primary-2 rounded-xl p-4 border border-brand-primary-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-primary-6 rounded-lg flex items-center justify-center">
                            <Icon icon={currentSort?.icon || 'mdi:sort'} className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-brand-neutral-7">Sorting by</p>
                            <p className="font-semibold text-brand-secondary-9">{currentSort?.label}</p>
                        </div>
                    </div>
                </div>

                <FilterButtonsActions1 onApply={handleApply} onClear={handleClear} />
            </div>
        </AnimatedDialog>
    )
}