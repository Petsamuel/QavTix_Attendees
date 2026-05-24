'use client'

import React from 'react'
import PhoneInput, { getCountryCallingCode, Country, parsePhoneNumber } from 'react-phone-number-input'
import flags from 'react-phone-number-input/flags'
import 'react-phone-number-input/style.css'
import { cn } from '@/lib/utils'
import { ChevronDown, Search } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { inter } from '@/lib/fonts'


interface CountrySelectProps {
    value?: Country
    onChange: (value?: Country) => void
    options: { value?: Country; label: string }[]
    disabled?: boolean
    defaultCountry?: Country
}

interface NumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    country?: string;
    international?: boolean;
    withCountryCallingCode?: boolean;
}

interface PhoneNumberInputProps {
    value?: string
    onChange: (value: string | undefined) => void
    onCountryChange?: (country: Country | undefined) => void
    error?: string
    placeholder?: string
    defaultCountry?: Country
    showRequired: boolean
    label?: string
    className?: string
    disabled?: boolean
    readOnly?: boolean
}

const CustomInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
    ({ country, international, withCountryCallingCode, ...rest }, ref) => {
        return (
            <input
                {...rest}
                ref={ref}
                autoComplete="off"
                data-lpignore="true"
                data-form-type="other"
                data-1p-ignore="true"
                className={cn(
                    inter.className,
                    "flex-1 px-4 py-3 text-sm outline-none bg-white text-brand-neutral-9 placeholder:text-brand-secondary-5 h-full"
                )}
            />
        )
    }
)

const CustomCountrySelect = ({ value, onChange, options, disabled, defaultCountry }: CountrySelectProps) => {
    const [searchQuery, setSearchQuery] = React.useState('')
    const [open, setOpen] = React.useState(false)

    const displayCountry = value || defaultCountry || 'NG';
    const Flag = flags[displayCountry as Country]

    const filteredOptions = React.useMemo(() => {
        return options.filter(opt => {
            if (!opt.value) return false;
            const name = opt.label.toLowerCase();
            const code = opt.value.toLowerCase();
            const query = searchQuery.toLowerCase();
            return name.includes(query) || code.includes(query);
        });
    }, [options, searchQuery]);

    return (
        <div className="relative flex items-center h-full">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        disabled={disabled}
                        className="flex items-center gap-2 px-4 h-full cursor-pointer hover:bg-neutral-50 transition-colors disabled:cursor-not-allowed select-none outline-none"
                    >
                        {Flag && (
                            <span className="size-7 overflow-hidden rounded-sm shrink-0 inline-flex">
                                <Flag title={displayCountry} />
                            </span>
                        )}
                        <ChevronDown className="size-4 text-secondary-5" />
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="start" sideOffset={8}>
                    <div className="flex items-center border-b px-3 py-2 bg-neutral-50 rounded-t-lg">
                        <Search className="size-4 mr-2 text-neutral-400 shrink-0" />
                        <input
                            type="text"
                            placeholder="Search country..."
                            className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400 text-brand-neutral-9 py-1"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <ul className="max-h-64 overflow-y-auto py-1">
                        {filteredOptions.length === 0 ? (
                            <li className="px-4 py-3 text-sm text-neutral-400 text-center">
                                No country found
                            </li>
                        ) : (
                            filteredOptions.map(({ value: optValue, label: optLabel }) => {
                                const OptFlag = optValue ? flags[optValue] : null;
                                const isSelected = optValue === value;
                                return (
                                    <li key={optValue || 'ZZ'}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                onChange(optValue);
                                                setOpen(false);
                                                setSearchQuery('');
                                            }}
                                            className={cn(
                                                "flex items-center gap-3 w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 transition-colors",
                                                isSelected && "bg-neutral-100 font-medium text-brand-accent-6"
                                            )}
                                        >
                                            {OptFlag && (
                                                <span className="size-6 overflow-hidden rounded-sm shrink-0 inline-flex">
                                                    <OptFlag title={optLabel} />
                                                </span>
                                            )}
                                            <span className="flex-1 truncate text-xs">{optLabel}</span>
                                            <span className="text-xs text-neutral-400 font-normal">
                                                +{getCountryCallingCode(optValue as Country)}
                                            </span>
                                        </button>
                                    </li>
                                )
                            })
                        )}
                    </ul>
                </PopoverContent>
            </Popover>
            <div className="h-8 w-px bg-secondary-4" />
        </div>
    )
}

export default function PhoneNumberInput({
    value,
    onChange,
    onCountryChange,
    error,
    placeholder = '1234567890',
    defaultCountry = 'NG',
    label = "Phone Number (Optional)",
    className,
    showRequired,
    disabled,
    readOnly
}: PhoneNumberInputProps) {
    const isInteractable = !disabled && !readOnly;

    // Ensure we always have a country code to display even if value is empty
    // We derive it from the value (if it exists) or fall back to defaultCountry
    const currentCountry = (value && value.startsWith('+'))
        ? undefined // The library will handle deriving it from the string
        : defaultCountry;

    // Fix E.164 warning: if value is local (e.g. '080...'), convert it using the default country.
    // If it's invalid or empty, pass undefined to avoid console errors.
    let safeValue: string | undefined = undefined;
    if (value) {
        if (value.startsWith('+')) safeValue = value;
        else {
            try {
                const parsed = parsePhoneNumber(value, defaultCountry as Country);
                safeValue = parsed?.number || undefined;
            } catch {
                safeValue = undefined;
            }
        }
    }

    const CountrySelect = React.useMemo(() => (props: CountrySelectProps) => (
        <CustomCountrySelect {...props} defaultCountry={defaultCountry} />
    ), [defaultCountry])

    return (
        <div className={cn("w-full space-y-2", className)}>
            <label className="block text-sm font-medium text-secondary-9">
                {label} {showRequired && <span className="text-red-500">*</span>}
            </label>

            <div className={cn(
                inter.className,
                "flex items-center w-full h-14 overflow-hidden text-sm rounded-lg border bg-white transition-all focus-within:ring-[1.5px] focus-within:border-none focus-within:ring-brand-accent-4",
                error ? "border-red-400" : "border-brand-secondary-5 hover:border-brand-secondary-6",
                !isInteractable && "bg-brand-neutral-1 opacity-80 pointer-events-none"
            )}>
                <PhoneInput
                    defaultCountry={defaultCountry}
                    value={safeValue}
                    onChange={onChange}
                    onCountryChange={onCountryChange}
                    disabled={!isInteractable}
                    placeholder={placeholder}
                    autoComplete="off"
                    className="flex w-full h-full custom-phone-input"

                    countrySelectComponent={CountrySelect}
                    inputComponent={CustomInput}
                />
            </div>

            {error && (
                <p className="text-xs text-red-500 ml-1">{error}</p>
            )}
        </div>
    )
}