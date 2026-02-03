'use client'

import { forwardRef } from 'react'
import { Icon } from '@iconify/react'
import { cn } from '@/lib/utils'

interface EventFilterTypeBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void
  displayText: string
  hasActiveFilter: boolean
  icon?: string
}

const EventFilterTypeBtn = forwardRef<HTMLButtonElement, EventFilterTypeBtnProps>(
    ({ onClick, displayText, hasActiveFilter, icon, className, ...props }, ref) => {
        const baseStyles = 'flex items-center gap-3 transition-colors outline-none'

        const variants = {
            compact: cn(
                'px-2 justify-between text-xs rounded-[11px] h-9 min-w-20 font-medium',
                'bg-white border border-brand-neutral-5',
                'hover:border-brand-primary hover:bg-brand-primary-1'
            )
        }

        return (
            <button
                {...props}
                ref={ref}
                onClick={onClick}
                className={cn(
                baseStyles,
                variants.compact,
                hasActiveFilter ? 'text-brand-neutral-8' : 'text-brand-neutral-7',
                className
                )}
            >
                {icon && (
                <Icon 
                    icon={icon} 
                    width="20" 
                    height="20" 
                    className='shrink-0 text-brand-neutral-8' 
                />
                )}
                
                <span className="truncate">{displayText}</span>
                
                <Icon
                icon="fluent:chevron-down-20-filled"
                className={cn(
                    'size-5 shrink-0 text-brand-neutral-8',
                    'group-hover:text-brand-primary-6'
                )}
                />
            </button>
        )
    }
)

EventFilterTypeBtn.displayName = 'EventFilterTypeBtn'

export default EventFilterTypeBtn