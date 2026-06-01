export type StatusStylesRecord = Record<
  EventStatus,
  { bg: string; text: string; label: string }
>

export const statusStyles: StatusStylesRecord = {
  "filling_fast": {
    bg: "bg-warning-tertiary",
    text: "text-brand-secondary-9",
    label: "Filling Fast",
  },
  "fast_selling": {
    bg: "bg-transparent",
    text: "text-brand-accent-9",
    label: "Fast Selling",
  },
  "fast_filling": {
    bg: "bg-warning-tertiary",
    text: "text-brand-secondary-9",
    label: "Fast Filling",
  },
  "selling_fast": {
    bg: "bg-transparent",
    text: "text-brand-accent-9",
    label: "Selling Fast",
  },

  "near_capacity": {
    bg: "bg-danger-tertiary",
    text: "text-brand-secondary-9",
    label: "Near capacity",
  },
  new: {
    bg: "bg-brand-primary",
    text: "text-white",
    label: "New",
  },
  normal: {
    bg: "bg-brand-secondary-1",
    text: "text-brand-secondary-6",
    label: "On Sale",
  },
  "on_sale": {
    bg: "bg-brand-secondary-1",
    text: "text-brand-secondary-6",
    label: "On Sale",
  },
  "sold_out": {
    bg: "bg-brand-neutral-1 border border-brand-neutral-4",
    text: "text-red-600",
    label: "Sold out",
  },
  "starts_soon": {
    bg: "bg-brand-primary-1",
    text: "text-brand-primary-9",
    label: "Starts soon",
  },
  started: {
    bg: "bg-brand-primary-1",
    text: "text-brand-primary-9",
    label: "Started",
  },
  draft: {
    bg: "bg-brand-secondary-1",
    text: "text-brand-secondary-6",
    label: "Draft",
  },
  active: {
    bg: "bg-brand-primary-1",
    text: "text-brand-primary-9",
    label: "Active",
  },
  ended: {
    bg: "bg-brand-secondary-1",
    text: "text-brand-secondary-6",
    label: "Ended",
  },
  cancelled: {
    bg: "bg-danger-tertiary border border-danger-default/20",
    text: "text-danger-default",
    label: "Cancelled",
  },
  banned: {
    bg: "bg-danger-tertiary border border-danger-default/20",
    text: "text-danger-default",
    label: "Banned",
  },
};