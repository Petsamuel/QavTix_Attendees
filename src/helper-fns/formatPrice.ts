// * Formats a price amount with proper currency formatting
export function formatPrice(
  amount: number,
  country: "NG" | "US" | "GB" | "EU" | string = "NG",
  useSymbol: boolean = true
): string {
  const currencyMap: Record<string, string> = {
    NG: "NGN",
    US: "USD",
    GB: "GBP",
    EU: "EUR",
  }

  const localeMap: Record<string, string> = {
    NG: "en-NG",
    US: "en-US",
    GB: "en-GB",
    EU: "en-IE",
  }

  const upperCountry = country.toUpperCase()
  const currency = currencyMap[upperCountry] || upperCountry
  const locale = localeMap[upperCountry] || "en-US"

  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
    currencyDisplay: useSymbol ? "symbol" : "code",
  })

  return formatter.format(amount)
}
