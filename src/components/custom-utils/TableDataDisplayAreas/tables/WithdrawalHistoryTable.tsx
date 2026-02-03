"use client";

import { usePagination } from "@/custom-hooks/PaginationHook";
import { withdrawalStatusConfig } from "../resources/status-config";
import { mockWithdrawalData } from "@/mock-data";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Image from "next/image";
import PaginationControls from "../tools/PaginationControl";


export default function WithdrawalHistoryTable() {
    const pagination = usePagination(mockWithdrawalData, 5)

    return (
        <div className="w-full space-y-4 mt-5">
            {/* Desktop Table */}
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
                            {pagination.currentItems.map((item) => {
                                const status = withdrawalStatusConfig[item.status as keyof typeof withdrawalStatusConfig];
                                return (
                                    <tr key={item.id} className="hover:bg-brand-neutral-1/50 transition-colors">
                                        <td className="p-4 text-brand-secondary-9 text-[11px]">{item.date}</td>
                                        <td className="p-4 text-brand-secondary-9 text-[11px]">
                                            ₦{item.amount.toLocaleString()}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-lg overflow-hidden shrink-0">
                                                    <Image width={50} height={50} src={item.bank.logo} alt="" className="size-full object-cover" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-brand-secondary-9 text-xs font-bold leading-tight">{item.bank.name}</span>
                                                    <span className="text-brand-secondary-6 text-[11px]">{item.bank.bankName}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <Badge className={cn("px-4 py-1.5 text-[11px] rounded-sm! font-medium shadow-none", status?.className)}>
                                                {status?.label}
                                            </Badge>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden flex flex-col divide-y divide-brand-neutral-4">
                {pagination.currentItems.map((item) => {
                    const status = withdrawalStatusConfig[item.status as keyof typeof withdrawalStatusConfig];
                    return (
                        <div key={item.id} className="py-4 space-y-2">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-lg overflow-hidden shrink-0">
                                        <Image width={50} height={50} src={item.bank.logo} alt="" className="size-full object-cover" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-brand-secondary-9 text-sm font-bold">{item.bank.name}</span>
                                        <span className="text-brand-secondary-6 text-[11px]">{item.bank.bankName}</span>
                                    </div>
                                </div>
                                <div className="flex text-right flex-col gap-1">
                                    <span className="text-[11px] text-brand-neutral-7">Status</span>
                                    <Badge className={cn("px-3 py-1 text-[10px] font-medium shadow-none", status?.className)}>
                                        {status?.label}
                                    </Badge>
                                </div>
                            </div>
                            <div className="flex justify-between items-end text-xs text-brand-secondary-9">
                                <div className="flex flex-col items-end">
                                    <span className="font-bold">Amount</span>
                                    <span>₦{item.amount.toLocaleString()}</span>
                                </div>
                                <span>{item.date}</span>
                            </div>
                        </div>
                    )
                })}
            </div>


            <PaginationControls
                endIndex={pagination.endIndex}
                startIndex={pagination.startIndex}
                totalItems={mockWithdrawalData.length}
                hasNextPage={pagination.hasNextPage}
                hasPreviousPage={pagination.hasPreviousPage}
                onNextPage={pagination.nextPage}
                onPreviousPage={pagination.previousPage}
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
            />
        </div>
    )
}