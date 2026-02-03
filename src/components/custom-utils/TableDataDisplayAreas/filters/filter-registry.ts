import { ComponentType } from "react"
import { FilterKey } from "../resources/avaliable-filters"
import CategoryFilter from "./CategoryFilter"
import DateFilter from "./DateFilter"
import { StatusFilter } from "./StatusFilter"
import PriceFilter from "./PriceFilter"

type FilterComponentProps<T> = {
  value: T
  onChange: (value: T) => void
  className?: string
  icon: string
}

type FilterRegistryEntry<T> = {
  component: ComponentType<FilterComponentProps<T>>
  stateKey: keyof FilterValues
}

export const filterRegistry: Partial<Record<FilterKey, FilterRegistryEntry<any>>> = {
  categories: {
    component: CategoryFilter,
    stateKey: 'categories'
  },
  status: {
    component: StatusFilter,
    stateKey: 'status'
  },
  dateRange: {
    component: DateFilter,
    stateKey: 'dateRange'
  },
  priceRange: {
    component: PriceFilter,
    stateKey: 'dateRange'
  },
}