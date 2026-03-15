import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type Region = {
    code: string
    label: string
    flag: string
}

export type Currency = {
    code: string
    label: string
    symbol: string
}


export type LocationData = {
  region: Region,
  currency: Currency
}

type SettingsState = {
    region: Region
    currency: Currency
    isInitialized: boolean
}

const DEFAULT_REGION: Region = {
    code: 'NG',
    label: 'Nigeria',
    flag: '🇳🇬',
}

const DEFAULT_CURRENCY: Currency = {
    code: 'NGN',
    label: 'Naira',
    symbol: '₦',
}

const initialState: SettingsState = {
    region: DEFAULT_REGION,
    currency: DEFAULT_CURRENCY,
    isInitialized: false
}

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setRegion(state, action: PayloadAction<Region>) {
            state.region = action.payload
            state.isInitialized = true
        },
        setCurrency(state, action: PayloadAction<Currency>) {
            state.currency = action.payload
            state.isInitialized = true
        },
        resetSettings(state) {
            state.region = DEFAULT_REGION
            state.currency = DEFAULT_CURRENCY
            state.isInitialized = false
        },
    },
})

export const {
    setRegion,
    setCurrency,
    resetSettings,
} = settingsSlice.actions

export default settingsSlice.reducer