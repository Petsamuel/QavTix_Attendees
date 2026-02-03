"use client";

import { usePagination } from "@/custom-hooks/PaginationHook";
import EventInfo from "../../event/EventInfo";
import { mockAffiliateTableData } from "@/mock-data";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import ViewMorePagination from "../tools/ViewMorePagination";
import { affiliateEarningsStatusConfig } from "../resources/status-config";

export default function EarningHistoryTable() {

    const pagination = usePagination(mockAffiliateTableData, 5)

    return (
        <div className="w-full space-y-4 mt-5">
            {/* Desktop Table */}
            <div className="hidden md:block border border-brand-neutral-3 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-brand-neutral-3 border-b border-brand-neutral-3">
                            <tr className="text-brand-secondary-8 text-xs font-semibold">
                                <th className="text-left py-4 px-4">S/N</th>
                                <th className="text-left py-4 px-4">Date</th>
                                <th className="text-left py-4 px-4">Event Name</th>
                                <th className="text-left py-4 px-4">Tickets Sold</th>
                                <th className="text-left py-4 px-4">Total Sale</th>
                                <th className="text-left py-4 px-4">Your Commission</th>
                                <th className="text-left py-4 px-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-neutral-4 bg-white">
                            {pagination.currentItems.map((item, index) => {
                                const status = affiliateEarningsStatusConfig[item.status as keyof typeof affiliateEarningsStatusConfig];
                                return (
                                    <tr key={item.id} className="hover:bg-brand-neutral-1/50 transition-colors">
                                        <td className="py-4 px-4 text-brand-secondary-6 text-xs">{index + 1}</td>
                                        <td className="p-4 text-brand-secondary-8 text-xs whitespace-nowrap">{item.date}</td>
                                        <td className="p-4 min-w-40">
                                            <EventInfo 
                                                variant="desktop"
                                                category={item.event.category}
                                                image={item.event.image}
                                                title={item.event.title}
                                            />
                                        </td>
                                        <td className="p-4 text-brand-secondary-8 text-xs text-center">{item.ticketsSold}</td>
                                        <td className="p-4 text-brand-secondary-9 text-xs whitespace-nowrap">₦{item.totalSale.toLocaleString()}</td>
                                        <td className="p-4 text-brand-secondary-9 text-xs whitespace-nowrap">₦{item.commission.toLocaleString()}</td>
                                        <td className="p-4">
                                            <Badge className={cn("px-3 py-1 text-[10px] rounded-sm font-medium shadow-none", status?.className)}>
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
            <div className="md:hidden flex flex-col gap-0 divide-y divide-brand-neutral-4">
                {pagination.currentItems.map((item) => {
                    const status = affiliateEarningsStatusConfig[item.status as keyof typeof affiliateEarningsStatusConfig];
                    return (
                        <div key={item.id} className="py-5 px-1 space-y-2">
                            <div className="flex justify-between items-start">
                                <EventInfo 
                                    variant="mobile"
                                    category={item.event.category}
                                    image={item.event.image}
                                    title={item.event.title}
                                />
                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-brand-secondary-5 text-[10px] font-medium">Status</span>
                                    <Badge className={cn("px-3 py-1 text-[10px] font-medium shadow-none", status?.className)}>
                                        {status?.label}
                                    </Badge>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-brand-secondary-5 text-xs">
                                    <span>{item.date}</span>
                                    <span>|</span>
                                    <span>{item.ticketsSold} Tickets Sold</span>
                                </div>
                                <div className="flex justify-between text-brand-secondary-9 text-[11px] items-center">
                                    <div className="flex gap-1 items-center">
                                        <span className="font-bold text-xs">Total Sale:</span>
                                        <span>₦{item.totalSale.toLocaleString()}</span>
                                    </div>
                                    <div className="flex gap-1 items-center">
                                        <span className="font-bold text-xs">Your Commission:</span>
                                        <span >₦{item.commission.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <ViewMorePagination
                hasMore={pagination.currentItems.length < mockAffiliateTableData.length}
                onViewMore={() => pagination.setPageSize(pagination.pageSize + 5)}
                isLoading={false}
                currentCount={pagination.currentItems.length}
                totalCount={pagination.totalItems}
            />
        </div>
    )
}