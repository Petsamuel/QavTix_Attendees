'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

interface FormSelectProps extends React.HTMLAttributes<HTMLDivElement> {
    label: string
    error?: string
    required?: boolean
    options: { value: string; label: string }[]
    value?: string
    onValueChange?: (value: string) => void
}

const CustomSelect = ({
    label,
    error,
    required,
    options,
    value,
    onValueChange,
    className = '',
    ...props
}: FormSelectProps) => {
    return (
        <div className={`w-full ${className}`} {...props}>
            <Label className="block text-sm font-medium text-neutral-9 mb-2">
                {label} {required && <span className="">*</span>}
            </Label>
            <Select value={value} onValueChange={onValueChange}>
                <SelectTrigger
                    className={`
                        w-full px-4 py-3 text-sm rounded-lg min-h-14 h-14 border
                        ${error 
                            ? 'border border-red-400 focus:border-red-500' 
                            : 'border-[1.5px] border-brand-neutral-5 focus:border-[1.5px] focus:border-brand-primary-5 hover:border-brand-neutral-6'
                        }
                        outline-none bg-[#F2F2F2] text-brand-neutral-9
                    `}
                >
                    <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                    {options.map(option => (
                        <SelectItem key={option.value} value={option.value} className='hover:bg-brand-primary! hover:text-white!'>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {error && (
                <p className="text-xs text-red-500 mt-1.5 ml-1">
                    {error}
                </p>
            )}
        </div>
    )
}

export default CustomSelect;