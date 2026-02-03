"use client"

import { Icon } from "@iconify/react";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { EDIT_GROUP } from "@/enums/navigation";

function GroupCard({ group }:{ group: Group }) {

    const router = useRouter()

    return (
        <div 
            key={group.id}
            className="bg-white shadow-[0px_5.8px_23.17px_0px_#3326AE14] rounded-2xl p-5 border border-gray-100 flex flex-col gap-4"
        >
            <div className="flex items-start justify-between text-brand-secondary-9">
                <div className="space-y-1">
                    <h3 className="text-sm font-bold">
                        {group.name}
                    </h3>
                    <p className="text-xs">
                        {group.members.length} Member
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Edit Button */}
                    <button
                        onClick={() => router.push(EDIT_GROUP.href.replace("[group_id]", group.id))}
                        type="button"
                        aria-label="Edit group"
                        className={cn(
                            'group relative flex items-center justify-center bg-brand-primary-2 p-2.5 rounded-full transition-all duration-200',
                            'hover:bg-brand-primary-3 hover:scale-105 active:scale-95',
                            'focus:outline-none focus:ring-2 focus:ring-brand-primary-5 focus:ring-offset-2',
                            'disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100',
                            'text-brand-primary-5'
                        )}
                        >
                            <span className={cn(
                                'size-6 p-1 aspect-square rounded-md flex justify-center items-center text-white transition-colors',
                                'bg-brand-primary-4 group-hover:bg-brand-primary-5 shadow-sm'
                            )}>
                                <Icon icon="hugeicons:pencil-edit-01" width="18" height="18" />
                            </span>
                        </button>

                        {/* Delete Button */}
                        <button
                            type="button"
                            aria-label="Delete group"
                            className={cn(
                                'group relative flex items-center justify-center bg-red-100 p-2.5 rounded-full transition-all duration-200',
                                'hover:bg-red-200 hover:scale-105 active:scale-95',
                                'focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
                                'disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100',
                                'text-red-600'
                            )}
                        >
                            <span className={cn(
                                'size-6 p-1 aspect-square rounded-md flex justify-center items-center text-white transition-colors',
                                'bg-red-500 group-hover:bg-red-600 shadow-sm'
                            )}>
                                <Icon icon="heroicons:trash" width="18" height="18" />
                            </span>
                        </button>
                </div>
            </div>

            {/* Contribution Tag */}
            <Badge className="text-brand-accent-4 bg-brand-accent-1 rounded-sm font-medium border-[0.8px] border-brand-accent-2">
                Total Contribution Percentage Split = {group.contributionSplit}%
            </Badge>
        </div>
    )
}

export default GroupCard;