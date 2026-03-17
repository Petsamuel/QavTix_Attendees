export type StatusStylesRecord = Record<
  EventStatus,
  { bg: string; text: string; label: string }
>

export const statusStyles: StatusStylesRecord = {
  "filling-fast": {
    bg: "bg-warning-tertiary",
    text: "text-brand-secondary-9",
    label: "Filling fast",
  },
  "selling-fast": {
    bg: "bg-warning-tertiary",
    text: "text-brand-secondary-9",
    label: "Selling fast",
  },
  "near-capacity": {
    bg: "bg-danger-tertiary",
    text: "text-brand-secondary-9",
    label: "Near capacity",
  },
  new: {
    bg: "bg-red-400",
    text: "text-white",
    label: "New",
  },
  "sold-out": {
    bg: "bg-white border border-red-200",
    text: "text-red-600",
    label: "Sold out",
  },
  "starts-soon": {
    bg: "bg-brand-primary-1",
    text: "text-brand-primary-9",
    label: "Starts soon",
  },
  draft: {
    bg: "bg-gray-100",
    text: "text-gray-600",
    label: "Draft",
  },
  active: {
    bg: "bg-positive-tertiary",
    text: "text-brand-secondary-2",
    label: "Active",
  },
  ended: {
    bg: "bg-gray-100",
    text: "text-gray-600",
    label: "Ended",
  },
  cancelled: {
    bg: "bg-white border border-red-200",
    text: "text-red-600",
    label: "Cancelled",
  },
  banned: {
    bg: "bg-white border border-red-200",
    text: "text-red-600",
    label: "Banned",
  },
};