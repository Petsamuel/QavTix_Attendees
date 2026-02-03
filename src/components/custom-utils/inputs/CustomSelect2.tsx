'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface FormSelectProps extends React.HTMLAttributes<HTMLDivElement> {
    label: string
    error?: string
    required?: boolean
    options: readonly { value: string; label: string }[]
    value?: string
    onValueChange?: (value: string) => void
    disabled?: boolean
}

const CustomSelect2 = ({
    label,
    error,
    disabled,
    options,
    value,
    onValueChange,
    className = '',
    ...props
}: FormSelectProps) => {
    return (
        <div className={`w-full ${className}`} {...props}>
            <Label className="block text-sm font-medium text-brand-neutral-9 mb-2">
                {label}
            </Label>


            <Select value={value} onValueChange={onValueChange} disabled={disabled}>
                <SelectTrigger
                    className={cn(
                        "w-full px-4 py-3 text-sm rounded-lg shadow-none min-h-14 h-14 border transition-all outline-none bg-white",
                        error 
                            ? 'border-red-400 focus:border-red-500' 
                            : 'border-brand-secondary-5 focus:border-[1.5px] focus:border-brand-accent-4 hover:border-brand-neutral-6',
                        disabled && "bg-gray-50/50 border-transparent opacity-100 cursor-not-allowed" 
                    )}
                >
                    <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                    {options.map(option => (
                        <SelectItem key={option.value} value={option.value} className='text-xs'>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {error && <p className="text-xs text-red-500 mt-1.5 ml-1">{error}</p>}
        </div>
    )
}


export default CustomSelect2;