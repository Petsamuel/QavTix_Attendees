'use client'

import { forwardRef } from 'react'
import { Icon } from '@iconify/react'
import { cn } from '@/lib/utils'

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string
    error?: string
    required?: boolean
    helperText?: string

    // Props for profile update use
    verified?: boolean
    verifiedMessage?: string
}

const CustomInput2 = forwardRef<HTMLInputElement, FormInputProps>(
    ({ label, error, required, helperText, verified, verifiedMessage, className = '', ...props }, ref) => {
        return (
            <div className="w-full space-y-2.75">
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-brand-secondary-9">
                        {label}
                    </label>


                    {/* Verified Message displayed above the input on the right */}
                    {verified && verifiedMessage && !error && (
                        <span className="text-sm text-[#04802E] animate-in fade-in duration-300">
                            {verifiedMessage}
                        </span>
                    )}
                </div>

                <div className="relative">
                    <input
                        ref={ref}
                        className={cn(
                            `w-full px-4 py-3 text-sm rounded-lg border h-14 transition-all
                            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                            outline-none bg-white text-brand-neutral-9 placeholder:text-brand-secondary-5`,
                            error 
                                ? 'border-red-400 focus:border-red-500' 
                                : verified 
                                    ? 'border-[#5FC381] focus:border-green-600'
                                    : 'border-brand-secondary-5 focus:border-[1.5px] focus:border-brand-accent-4 hover:border-brand-secondary-6',
                            verified && "pr-10", // Extra padding so text doesn't hit the icon
                            className
                        )}
                        {...props}
                    />

                    {/* Verified Check Icon */}
                    {verified && !error && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                            <Icon 
                                icon="ei:check" 
                                className="text-[#04802E]" 
                                width="20" 
                                height="20" 
                            />
                        </div>
                    )}
                </div>

                {helperText && (
                    <p className='text-brand-secondary-5 text-[10px]'>{helperText}</p>
                )}
                
                {error && (
                    <p className="text-xs text-red-500 ml-1">
                        {error}
                    </p>
                )}
            </div>
        )
    }
)

export default CustomInput2;