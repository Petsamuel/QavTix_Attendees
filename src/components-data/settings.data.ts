import { LocationData } from "@/lib/redux/slices/settingsSlice"

export const REGION_CURRENCY_MAP: Record<string, LocationData> = {
  NG: {
    region: { code: 'NG', label: 'Nigeria', flag: '🇳🇬' },
    currency: { code: 'NGN', label: 'Naira', symbol: '₦' }
  },
  US: {
    region: { code: 'US', label: 'United States', flag: '🇺🇸' },
    currency: { code: 'USD', label: 'Dollar', symbol: '$' }
  },
  GB: {
    region: { code: 'GB', label: 'United Kingdom', flag: '🇬🇧' },
    currency: { code: 'GBP', label: 'Pound', symbol: '£' }
  }
}

export const DEFAULT_LOCATION: LocationData = {
  region: { code: 'NG', label: 'Nigeria', flag: '🇳🇬' },
  currency: { code: 'NGN', label: 'Naira', symbol: '₦' }
}

export const regions = Object.values(REGION_CURRENCY_MAP)
  .map(({ region }) => region)
  .filter(
    (region, index, self) =>
    index === self.findIndex(r => r.code === region.code)
)


export const currencies = Object.values(REGION_CURRENCY_MAP)
  .map(({ currency }) => currency)
  .filter(
    (currency, index, self) =>
      index === self.findIndex(c => c.code === currency.code)
  )
