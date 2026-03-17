// Maps common Nigerian bank names (lowercase) to their official domain
// Used to fetch logos via a public logo API

const NIGERIAN_BANK_DOMAINS: Record<string, string> = {
    // Tier 1
    "access bank":               "accessbankplc.com",
    "access":                    "accessbankplc.com",
    "first bank":                "firstbanknigeria.com",
    "first bank nigeria":        "firstbanknigeria.com",
    "gtbank":                    "gtbank.com",
    "guaranty trust bank":       "gtbank.com",
    "guaranty trust":            "gtbank.com",
    "gt bank":                   "gtbank.com",
    "zenith bank":               "zenithbank.com",
    "zenith":                    "zenithbank.com",
    "uba":                       "ubagroup.com",
    "united bank for africa":    "ubagroup.com",

    // Tier 2
    "ecobank":                   "ecobank.com",
    "fidelity bank":             "fidelitybank.ng",
    "fidelity":                  "fidelitybank.ng",
    "fcmb":                      "fcmb.com",
    "first city monument bank":  "fcmb.com",
    "heritage bank":             "heritagebankplc.com",
    "keystone bank":             "keystonebankng.com",
    "polaris bank":              "polarisbanklimited.com",
    "sterling bank":             "sterlingbank.com",
    "sterling":                  "sterlingbank.com",
    "stanbic ibtc":              "stanbicibtc.com",
    "stanbic ibtc bank":         "stanbicibtc.com",
    "union bank":                "unionbankng.com",
    "union bank nigeria":        "unionbankng.com",
    "unity bank":                "unitybankng.com",
    "wema bank":                 "wemabank.com",
    "wema":                      "wemabank.com",

    // Fintechs / Digital banks
    "opay":                      "opayweb.com",
    "palmpay":                   "palmpay.com",
    "moniepoint":                "moniepoint.com",
    "monie point":               "moniepoint.com",
    "kuda":                      "kuda.com",
    "kuda bank":                 "kuda.com",
    "carbon":                    "getcarbon.co",
    "carbon bank":               "getcarbon.co",
    "fairmoney":                 "fairmoney.africa",
    "vfd":                       "vbank.ng",
    "vfd microfinance bank":     "vbank.ng",
    "vbank":                     "vbank.ng",
    "rubies bank":               "rubies.bank",
    "rubies":                    "rubies.bank",
    "coronation bank":           "coronationbank.com.ng",
    "jaiz bank":                 "jaizbankplc.com",
    "lotus bank":                "lotusbank.com.ng",
    "providus bank":             "providusbank.com",
    "suntrust bank":             "suntrustng.com",
}


export function getBankLogoUrl(bankName: string): string | null {
    const key    = bankName.toLowerCase().trim()
    const domain = NIGERIAN_BANK_DOMAINS[key]

    // Exact match
    if (domain) return `https://logo.clearbit.com/${domain}`

    // Partial match — find the first key that the bank name contains or is contained by
    const partialKey = Object.keys(NIGERIAN_BANK_DOMAINS).find(
        k => key.includes(k) || k.includes(key)
    )
    if (partialKey) return `https://logo.clearbit.com/${NIGERIAN_BANK_DOMAINS[partialKey]}`

    // Unknown bank — Clearbit may still have it by guessing the domain
    // Return null so caller shows placeholder
    return null
}