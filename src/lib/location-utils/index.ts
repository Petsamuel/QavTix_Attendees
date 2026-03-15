'use server'

import { cookies } from 'next/headers'
import { COOKIE_KEYS } from '@/components-data/cookie-keys'
import { Currency, Region } from '../redux/slices/settingsSlice';
import { DEFAULT_LOCATION } from '@/components-data/settings.data';

export async function setLocationAction(data: { region?: Region; currency?: Currency }) {
  const cookieStore = await cookies()
  const { region, currency } = data

  const options = {
    maxAge: 365 * 24 * 60 * 60,
    path: '/',
    sameSite: 'lax' as const,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  }

  if (region) {
    cookieStore.set(COOKIE_KEYS.USER_REGION, JSON.stringify(region), options)
  }
  
  if (currency) {
    cookieStore.set(COOKIE_KEYS.USER_CURRENCY, JSON.stringify(currency), options)
  }

  return { success: true }
}



export async function getOrDetectLocation() {
  const cookieStore = await cookies()

  const regionStr = cookieStore.get(COOKIE_KEYS.USER_REGION)?.value
  const currencyStr = cookieStore.get(COOKIE_KEYS.USER_CURRENCY)?.value

  try {
    return {
      region: regionStr ? JSON.parse(regionStr) : DEFAULT_LOCATION.region,
      currency: currencyStr ? JSON.parse(currencyStr) : DEFAULT_LOCATION.currency,
    }
  } catch (e) {
    return DEFAULT_LOCATION
  }
}