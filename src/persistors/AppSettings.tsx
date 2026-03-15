"use client"

import { useEffect, useRef } from "react"
import { useAppDispatch } from "@/lib/redux/hooks"
import { Currency, Region, setCurrency, setRegion } from "@/lib/redux/slices/settingsSlice"

interface AuthPersistorClientProps {
    region: Region
    currency: Currency
}

export default function AppSettings({ currency, region }: AuthPersistorClientProps) {
    const dispatch = useAppDispatch()
    const initialized = useRef(false)

    useEffect(() => {
        if (initialized.current) return
        initialized.current = true

        // Set region and currency from server
        if (region) {
            dispatch(setRegion(region))
        }
        
        if (currency) {
            dispatch(setCurrency(currency))
        }
    }, [dispatch, region, currency])

    return null
}