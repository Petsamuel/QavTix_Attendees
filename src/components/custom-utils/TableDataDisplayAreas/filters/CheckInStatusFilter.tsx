'use client'


import { useState } from 'react'
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import EventFilterTypeBtn from './buttons-and-inputs/EventFilterTypeBtn'

const checkInStatusOptions = [
  { value: 'pending', label: 'Pending', color: 'bg-amber-400' },
  { value: 'checked_in', label: 'Checked In', color: 'bg-green-500' },
  { value: 'duplicate', label: 'Duplicate', color: 'bg-orange-600' },
  { value: 'invalid', label: 'Invalid', color: 'bg-red-500' },
] as const

interface CheckInStatusFilterProps {
  value?: string[]
  onChange: (value: string[]) => void
  icon: string
}

export function CheckInStatusFilter({ value, onChange, icon }: CheckInStatusFilterProps) {

  const [isOpen, setIsOpen] = useState(false)
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(value || [])

  const handleToggle = (statusValue: string) => {
    const next = selectedStatuses.includes(statusValue)
      ? selectedStatuses.filter(v => v !== statusValue)
      : [...selectedStatuses, statusValue]
    
    setSelectedStatuses(next)
    onChange(next)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <EventFilterTypeBtn
          icon={icon}
          displayText="Check-In Status"
          onClick={() => setIsOpen(true)}
          hasActiveFilter={selectedStatuses.length > 0}
        />
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="start" 
        sideOffset={5}
        className={cn(
          "w-56 z-50 p-4 rounded-xl shadow-[0px_3.69px_14.76px_0px_rgba(51,38,174,0.08)] bg-white border border-brand-neutral-2",
        )}
      >
        <p className="px-2 py-1.5 text-[10px] uppercase tracking-wider font-bold text-brand-neutral-5">
          Filter by Check-In
        </p>
        
        {checkInStatusOptions.map(status => {
          const isSelected = selectedStatuses.includes(status.value)
          return (
            <DropdownMenuItem
              key={status.value}
              onSelect={(e) => {
                e.preventDefault()
                handleToggle(status.value)
              }}
              className={cn(
                "flex items-center gap-2.5 px-2 py-2 rounded-lg cursor-pointer transition-colors outline-none",
                "focus:bg-brand-neutral-1 active:scale-[0.98]",
                isSelected ? "bg-brand-primary-1/40" : ""
              )}
            >
              <div className={cn("size-1.5 rounded-full shrink-0 shadow-sm", status.color)} />
              <span className={cn(
                "text-xs flex-1",
                isSelected ? "font-semibold text-brand-primary-9" : "text-brand-secondary-8"
              )}>
                {status.label}
              </span>
              {isSelected && (
                <Icon icon="iconamoon:check-bold" className="text-brand-primary-6 size-3" />
              )}
            </DropdownMenuItem>
          )
        })}
        
        {selectedStatuses.length > 0 && (
          <>
            <DropdownMenuSeparator className="my-1 bg-brand-neutral-2" />
            <button 
              onClick={(e) => {
                e.stopPropagation()
                setSelectedStatuses([])
                onChange([])
              }}
              className="w-full text-center py-1.5 text-[11px] font-medium text-brand-neutral-6 hover:text-red-500 transition-colors"
            >
              Reset Filters
            </button>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
