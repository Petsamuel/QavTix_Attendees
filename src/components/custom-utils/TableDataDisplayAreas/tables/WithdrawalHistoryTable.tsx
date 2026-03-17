"use client"

import { useState } from "react"
import { withdrawalStatusConfig } from "../resources/status-config"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Icon } from "@iconify/react"
import PaginationControls from "../tools/PaginationControl"
import { getWithdrawalHistory } from "@/actions/affiliates"
import { formatPrice } from "@/helper-fns/formatPrice"
import { useAppSelector } from "@/lib/redux/hooks"
import TableLoader from "@/components/loaders/TableLoader"

interface Props {
    initialData: PaginatedResponse<WithdrawalHistoryItem>
}

const PAGE_SIZE = 10

export default function WithdrawalHistoryTable({ initialData }: Props) {

    const { currency } = useAppSelector(store => store.settings)

    const [items,       setItems]       = useState<WithdrawalHistoryItem[]>(initialData.results)
    const [isLoading,   setIsLoading]   = useState(false)
    const [isError,     setIsError]     = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages,  setTotalPages]  = useState(initialData.total_pages ?? Math.ceil(initialData.count / PAGE_SIZE))
    const [totalItems,  setTotalItems]  = useState(initialData.count)

    const fetchPage = async (page: number) => {
        setIsLoading(true)
        setIsError(false)
        const res = await getWithdrawalHistory(page)
        if (res.success && res.data) {
            setItems(res.data.results)
            setTotalItems(res.data.count)
            setTotalPages(res.data.total_pages ?? Math.ceil(res.data.count / PAGE_SIZE))
            setCurrentPage(page)
        } else {
            setIsError(true)
        }
        setIsLoading(false)
    }

    const startIndex = (currentPage - 1) * PAGE_SIZE + 1
    const endIndex   = Math.min(currentPage * PAGE_SIZE, totalItems)

    if (isLoading) return <TableLoader />

    if (isError) return (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <div className="p-3 rounded-full bg-red-50">
                <Icon icon="mage:warning-circle" className="size-6 text-red-400" />
            </div>
            <p className="text-sm font-medium text-brand-secondary-8">Something went wrong</p>
            <p className="text-xs text-brand-secondary-5">Could not load withdrawal history.</p>
        </div>
    )

    if (items.length === 0) return (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <div className="p-3 rounded-full bg-brand-neutral-2">
                <Icon icon="hugeicons:money-send-square" className="size-6 text-brand-neutral-6" />
            </div>
            <p className="text-sm font-medium text-brand-secondary-8">No withdrawals yet</p>
            <p className="text-xs text-brand-secondary-5">Your withdrawal history will appear here.</p>
        </div>
    )

    return (
        <div className="w-full space-y-4 mt-5">
            {/* Desktop */}
            <div className="hidden md:block border border-brand-neutral-3 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-brand-neutral-3 border-b border-brand-neutral-3">
                            <tr className="text-brand-secondary-8 text-sm font-semibold">
                                <th className="text-left p-4">Date</th>
                                <th className="text-left p-4">Amount</th>
                                <th className="text-left p-4">Bank Account</th>
                                <th className="text-right p-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-neutral-3 bg-white">
                            {items.map(item => {
                                const status = withdrawalStatusConfig[item.status as keyof typeof withdrawalStatusConfig]
                                return (
                                    <tr key={item.id} className="hover:bg-brand-neutral-1/50 transition-colors">
                                        <td className="p-4 text-brand-secondary-9 text-[11px]">
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-brand-secondary-9 text-[11px]">
                                            {formatPrice(parseFloat(item.amount), currency)}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="text-brand-secondary-9 text-xs font-bold">{item.account_name}</span>
                                                <span className="text-brand-secondary-6 text-[11px]">{item.bank_name} · {item.bank_account}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <Badge className={cn("px-4 py-1.5 text-[11px] rounded-sm! font-medium shadow-none", status?.className)}>
                                                {status?.label ?? item.status}
                                            </Badge>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile */}
            <div className="md:hidden flex flex-col divide-y divide-brand-neutral-4">
                {items.map(item => {
                    const status = withdrawalStatusConfig[item.status as keyof typeof withdrawalStatusConfig]
                    return (
                        <div key={item.id} className="py-4 space-y-2">
                            <div className="flex justify-between items-start">
                                <div className="flex flex-col">
                                    <span className="text-brand-secondary-9 text-sm font-bold">{item.account_name}</span>
                                    <span className="text-brand-secondary-6 text-[11px]">{item.bank_name} · {item.bank_account}</span>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-[11px] text-brand-neutral-7">Status</span>
                                    <Badge className={cn("px-3 py-1 text-[10px] font-medium shadow-none", status?.className)}>
                                        {status?.label ?? item.status}
                                    </Badge>
                                </div>
                            </div>
                            <div className="flex justify-between text-xs text-brand-secondary-9">
                                <span className="font-bold">{formatPrice(parseFloat(item.amount), currency)}</span>
                                <span>{new Date(item.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    )
                })}
            </div>

            <PaginationControls
                startIndex={startIndex}
                endIndex={endIndex}
                totalItems={totalItems}
                currentPage={currentPage}
                totalPages={totalPages}
                hasNextPage={currentPage < totalPages}
                hasPreviousPage={currentPage > 1}
                onNextPage={() => fetchPage(currentPage + 1)}
                onPreviousPage={() => fetchPage(currentPage - 1)}
            />
        </div>
    )
}