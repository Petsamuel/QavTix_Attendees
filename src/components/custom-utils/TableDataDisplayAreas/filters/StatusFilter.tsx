'use client'

import { useState } from 'react'
import { AnimatedDialog } from "../../dialogs/AnimatedDialog"
import EventFilterTypeBtn from "./buttons-and-inputs/EventFilterTypeBtn"
import { Icon } from "@iconify/react"
import FilterButtonsActions1 from "./buttons-and-inputs/FilterActionButtons1"
import { cn } from "@/lib/utils"

const statusOptions = [
  { value: 'live',       label: 'Live',       color: 'bg-green-500',   icon: 'mdi:circle',           description: 'Currently happening' },
  { value: 'upcoming',   label: 'Upcoming',   color: 'bg-blue-500',    icon: 'mdi:clock-outline',    description: 'Scheduled for future' },
  { value: 'ended',      label: 'Ended',      color: 'bg-gray-500',    icon: 'mdi:check-circle',     description: 'Already completed' },
  { value: 'cancelled',  label: 'Cancelled',  color: 'bg-red-500',     icon: 'mdi:close-circle',     description: 'Event cancelled' },
  { value: 'draft',      label: 'Draft',      color: 'bg-yellow-500',  icon: 'mdi:pencil-outline',   description: 'Not yet published' },
] as const

interface StatusFilterProps {
  value?: string[]
  onChange: (value: string[]) => void
  icon: string
}

export function StatusFilter({ value = [], onChange, icon }: StatusFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(value)

  const handleToggle = (statusValue: string) => {
    if (selectedStatuses.length){
      setSelectedStatuses(prev =>
        prev.includes(statusValue)
           ? prev.filter(v => v !== statusValue)
          : [statusValue]
      )
    }
    else {
      setSelectedStatuses([statusValue])
    }
  }

  const handleApply = () => {
    onChange(selectedStatuses)
    setIsOpen(false)
  }

  const handleClear = () => {
    setSelectedStatuses([])
    onChange([])
  }

  return (
    <AnimatedDialog
      open={isOpen}
      onOpenChange={setIsOpen}
      title="Event Status"
      trigger={
        <EventFilterTypeBtn
          icon={icon}
          onClick={() => setIsOpen(true)}
          displayText="Status"
          hasActiveFilter={selectedStatuses?.length > 0}
        />
      }
    >
      <div className="space-y-2 overflow-x-hidden p-4 pb-16 overflow-y-auto relative max-h-[20em]">
        {statusOptions.map(status => {
          const isSelected = selectedStatuses?.includes(status.value)

          return (
            <button
              key={status.value}
              onClick={() => handleToggle(status.value)}
              className={cn(
                'w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-sm',
                isSelected
                  ? 'border-brand-primary-6 bg-brand-primary-1/50 shadow-sm'
                  : 'border-brand-neutral-3 hover:border-brand-neutral-5'
              )}
            >
              <div className={cn('w-2.5 h-2.5 rounded-full shrink-0', status.color)} />
              <Icon icon={status.icon} className="w-4 h-4 text-brand-neutral-7 shrink-0" />
              <div className="flex-1 text-left min-w-0">
                <p className="font-medium text-brand-secondary-9 truncate">{status.label}</p>
                <p className="text-xs text-brand-neutral-6 truncate">{status.description}</p>
              </div>
              {isSelected && (
                <Icon icon="mdi:check-circle" className="w-5 h-5 text-primary-6 shrink-0" />
              )}
            </button>
          )
        })}
        <div className='fixed rounded-b-3xl left-0 ps-4 bottom-0 w-full h-[5em] bg-white'>
          <FilterButtonsActions1 onApply={handleApply} onClear={handleClear} />
        </div>
      </div>
    </AnimatedDialog>
  )
}