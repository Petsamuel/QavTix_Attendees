'use client'

import { forwardRef } from 'react'

interface DateTimeInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string
    error?: string
}

export const CustomDateTimeInput = forwardRef<HTMLInputElement, DateTimeInputProps>(
    ({ label, error, className = '', ...props }, ref) => {
        return (
            <div className="w-full">
                <label className="block text-sm font-medium text-brand-secondary-9 mb-2">
                    {label}
                </label>
                <div className="relative group max-w-85">
                    <input
                        type="datetime-local"
                        ref={ref}
                        className={`
                            w-full px-4 py-3 text-sm rounded-lg h-14 transition-all
                            appearance-none bg-white text-brand-neutral-9 outline-none
                            scheme-light 
                            ${error 
                                ? 'border border-red-400 focus:border-red-500 ring-1 ring-red-400/20' 
                                : 'border border-brand-secondary-2 focus:border-[1.5px] focus:border-brand-accent-4 hover:border-brand-secondary-6'
                            }
                            ${className}
                        `}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="text-xs text-red-500 mt-1.5 ml-1 font-medium">
                        {error}
                    </p>
                )}
            </div>
        )
    }
)

CustomDateTimeInput.displayName = "CustomDateTimeInput"