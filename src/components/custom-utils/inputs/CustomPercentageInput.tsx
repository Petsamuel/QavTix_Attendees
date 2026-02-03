import { cn } from "@/lib/utils"
import { forwardRef } from "react"

interface PercentageInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    label?: string
    error?: string
    required?: boolean
    helperText?: string
    inputContainerStyles?: string
    onChange?: (value: string) => void
}

export const CustomPercentageInput = forwardRef<HTMLInputElement, PercentageInputProps>(
    ({ 
        label, 
        error, 
        required, 
        helperText,
        inputContainerStyles, 
        className = '', 
        onChange,
        ...props 
    }, ref) => {
        
        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            // Only allow numbers, max 100
            let value = e.target.value.replace(/[^0-9]/g, '');
            if (parseInt(value) > 100) value = '100';
            if (onChange) {
                onChange(value);
            }
        };

        return (
            <div className="w-full space-y-2">
                {label && (
                    <label className="block text-sm font-medium text-brand-secondary-9 mb-2">
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                
                <div className={cn(inputContainerStyles, "relative flex items-center overflow-hidden")}>
                    {/* Input Field */}
                    <input
                        ref={ref}
                        type="text"
                        inputMode="numeric"
                        maxLength={3}
                        onChange={handleInputChange}
                        className={`
                            w-full pr-16 pl-4 py-3 text-sm rounded-lg h-14 transition-all
                            ${error 
                                ? 'border border-red-400 focus:border-red-500' 
                                : 'border border-brand-secondary-5 focus:border-[1.5px] focus:border-brand-accent-4 hover:border-brand-secondary-6'
                            }
                            outline-none bg-white text-brand-neutral-9 placeholder:text-brand-secondary-5
                            ${className}
                        `}
                        {...props}
                    />
                    
                    {/* % Icon */}
                    <div className="absolute right-[1.5px] h-[95%] w-[3em] justify-center rounded-e-lg text-center flex items-center bg-brand-neutral-3">
                        <span className="text-brand-secondary-5">%</span>
                    </div>
                </div>

                {helperText && !error && (
                    <p className='text-brand-secondary-5 text-[10px]'>{helperText}</p>
                )}
                {error && (
                    <p className="text-xs text-red-500 ml-1">{error}</p>
                )}
            </div>
        )
    }
)

export default CustomPercentageInput;