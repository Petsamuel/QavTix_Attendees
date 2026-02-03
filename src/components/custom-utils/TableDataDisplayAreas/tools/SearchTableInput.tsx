'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Icon } from '@iconify/react'
import { cn } from '@/lib/utils'

interface SearchTableInputProps {
  placeholder?: string
  className?: string
  minSearchLength?: number
  debounceMs?: number
  onSearch?: (query: string) => void
}

export default function SearchTableInput1({
  placeholder = 'Search event',
  className,
  minSearchLength = 3,
  debounceMs = 500,
  onSearch
}: SearchTableInputProps) {

    const router = useRouter()
    const [isFocused, setIsFocused] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const [isSearching, setIsSearching] = useState(false)

    useEffect(() => {
        if (searchValue.length < minSearchLength) {
            setIsSearching(false)
            return
        }

        setIsSearching(true)
        const timer = setTimeout(() => {
            handleSearch(searchValue)
            setIsSearching(false)
        }, debounceMs)

        return () => clearTimeout(timer)
    }, [searchValue, minSearchLength, debounceMs])

    const handleSearch = useCallback((query: string) => {
        
    }, [onSearch, router])

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchValue.length >= minSearchLength) {
        handleSearch(searchValue)
        }
    }

    return (
        <div className={cn('w-full', className)}>
            <div
                className={cn(
                'relative flex flex-row-reverse  w-full items-center gap-2 px-4 py-3',
                'rounded-lg border h-11 text-sm transition-all duration-200 bg-brand-secondary-1',
                isFocused
                    ? 'border-[1.6px] border-brand-secondary-5'
                    : 'border-[0.5px] border-brand-secondary-3 hover:border-brand-secondary-4'
                )}
            >
                <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={cn(
                        'flex-1 outline-none h-full bg-transparent text-sm text-brand-neutral-9',
                        'placeholder:text-neutral-6'
                    )}
                />

                {isSearching ? (
                    <Icon
                        icon="lucide:loader-2"
                        className="size-6 shrink-0 text-brand-primary-6 animate-spin"
                    />
                    ) : (
                    <Icon
                        icon="lucide:search"
                        className={cn(
                        'size-6 shrink-0 transition-colors',
                        isFocused ? 'text-brand-secondary-5' : 'text-brand-neutral-6'
                        )}
                    />
                )}
            </div>
        </div>
    )
}