'use client'

import { forwardRef } from 'react'

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string
    error?: string
    required?: boolean
    showAshk?: boolean 
}

const CustomInput1 = forwardRef<HTMLInputElement, FormInputProps>(
    ({ label, error, required, showAshk = true, className = '', ...props }, ref) => {
        return (
            <div className="w-full">
                <label className="block text-sm font-medium text-brand-neutral-9 mb-2">
                    {label} {required && showAshk && <span className="">*</span>}
                </label>
                <input
                    ref={ref}
                    className={`
                        w-full px-4 py-3 text-sm rounded-lg h-14 transition-all
                        ${error 
                            ? 'border border-red-400 focus:border-red-500' 
                            : 'border border-brand-neutral-5 focus:border-[1.5px] focus:border-brand-primary-5 hover:border-brand-neutral-6'
                        }
                        outline-none bg-[#F2F2F2] text-brand-neutral-9 placeholder:text-brand-neutral-6
                        ${className}
                    `}
                    {...props}
                />
                {error && (
                    <p className="text-xs text-red-500 mt-1.5 ml-1">
                        {error}
                    </p>
                )}
            </div>
        )
    }
)


export default CustomInput1;