"use client"

import { useState } from "react"
import { Icon } from "@iconify/react"
import { Badge } from "../ui/badge"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { EDIT_GROUP } from "@/enums/navigation"
import { Group, deleteGroup } from "@/actions/groups"
import { useAppDispatch } from "@/lib/redux/hooks"
import { showAlert } from "@/lib/redux/slices/alertSlice"

interface Props {
    group:    Group
    onDelete: (id: string) => void
}

export default function GroupCard({ group, onDelete }: Props) {

    const router   = useRouter()
    const dispatch = useAppDispatch()
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        if (isDeleting) return
        setIsDeleting(true)

        const result = await deleteGroup(group.id)

        if (result.success) {
            onDelete(group.id)  // optimistic remove from parent list
            dispatch(showAlert({
                variant:     "default",
                title:       "Group deleted",
                description: `"${group.name}" has been removed.`,
            }))
        } else {
            setIsDeleting(false)
            dispatch(showAlert({
                variant:     "destructive",
                title:       "Could not delete group",
                description: result.message ?? "Please try again.",
            }))
        }
    }

    return (
        <div className={cn(
            "bg-white shadow-[0px_5.8px_23.17px_0px_#3326AE14] rounded-2xl p-5 border border-gray-100 flex flex-col gap-4 transition-opacity",
            isDeleting && "opacity-50 pointer-events-none"
        )}>
            <div className="flex items-start justify-between text-brand-secondary-9">
                <div className="space-y-1">
                    <h3 className="text-sm font-bold">{group.name}</h3>
                    <p className="text-xs">{group.member_count} Member{Number(group.member_count) !== 1 ? "s" : ""}</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.push(EDIT_GROUP.href.replace("[group_id]", group.id))}
                        type="button"
                        aria-label="Edit group"
                        className="group relative flex items-center justify-center bg-brand-primary-2 p-2.5 rounded-full transition-all duration-200 hover:bg-brand-primary-3 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-brand-primary-5 focus:ring-offset-2 text-brand-primary-5"
                    >
                        <span className="size-6 p-1 aspect-square rounded-md flex justify-center items-center text-white bg-brand-primary-4 group-hover:bg-brand-primary-5 shadow-sm">
                            <Icon icon="hugeicons:pencil-edit-01" width="18" height="18" />
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        aria-label="Delete group"
                        className="group relative flex items-center justify-center bg-red-100 p-2.5 rounded-full transition-all duration-200 hover:bg-red-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="size-6 p-1 aspect-square rounded-md flex justify-center items-center text-white bg-red-500 group-hover:bg-red-600 shadow-sm">
                            {isDeleting
                                ? <Icon icon="eos-icons:three-dots-loading" width="18" height="18" />
                                : <Icon icon="heroicons:trash" width="18" height="18" />
                            }
                        </span>
                    </button>
                </div>
            </div>

            <Badge className="text-brand-accent-4 bg-brand-accent-1 rounded-sm font-medium border-[0.8px] border-brand-accent-2 w-fit">
                {group.members.length} member{group.members.length !== 1 ? "s" : ""}
            </Badge>
        </div>
    )
}