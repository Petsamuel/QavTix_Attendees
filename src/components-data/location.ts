import { Country, State } from 'country-state-city'


export const countries = Country.getAllCountries().map(c => ({
    value: c.isoCode,
    label: c.name
}))

export const getStates = (countryCode: string) => 
    State.getStatesOfCountry(countryCode).map(s => ({
        value: s.isoCode,
        label: s.name
    }
))

export const nigeriaStates = getStates("NG").map(v => v.label)