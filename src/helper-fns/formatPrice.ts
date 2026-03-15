import { Currency } from "@/lib/redux/slices/settingsSlice"

const localeMap: Record<string, string> = {
  NGN: "en-NG",
  USD: "en-US",
  GBP: "en-GB",
  EUR: "en-IE",
}

export function formatPrice(
  amount:    number,
  currency:  Currency,
  useSymbol: boolean = true
): string {
  const locale = localeMap[currency.code] ?? "en-US"

  return new Intl.NumberFormat(locale, {
    style:   "currency",
    currency: currency.code,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
    currencyDisplay: useSymbol ? "symbol" : "code",
  }).format(amount)
}