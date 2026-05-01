"use client"

import { useState } from "react"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import { space_grotesk } from "@/lib/fonts"
import GroupCard from "@/components/cards/GroupCard"
import CreateGroupForm from "@/components/forms/CreateGroupForm"
import { Group } from "@/actions/groups/index"

interface Props {
    initialGroups: Group[]
}

export default function GroupSettingsCW({ initialGroups }: Props) {

    const [groups,setGroups]  = useState<Group[]>(initialGroups)
    const [isCreating, setIsCreating] = useState(false)

    const handleCreated = (newGroup: Group) => {
        setGroups(prev => [newGroup, ...prev])
        setIsCreating(false)
    }

    const handleDeleted = (id: string) => {
        setGroups(prev => prev.filter(g => g.id !== id))
    }

    return (
        <main className="w-full pt-8 pb-16 space-y-12">
            <h2 className={cn(space_grotesk.className, "text-lg font-bold text-brand-secondary-9")}>Group</h2>

            <section className="space-y-6">
                <div className="flex items-start justify-between">
                    <header>
                        <h3 className="text-base font-bold text-brand-secondary-9">My Groups</h3>
                        <p className="text-sm text-brand-secondary-9">List of groups you belong to</p>
                    </header>

                    {!isCreating && (
                        <button
                            type="button"
                            onClick={() => setIsCreating(true)}
                            className="flex items-center md:bg-brand-primary-1 p-2 rounded-lg justify-between text-xs font-bold gap-2 transition-opacity text-brand-primary-5 hover:text-brand-primary-7"
                        >
                            <span className="size-9 md:size-7 aspect-square rounded-md flex justify-center items-center text-white bg-brand-primary-3">
                                <Icon icon="hugeicons:add-01" width="25" className="md:w-4.5" />
                            </span>
                            <span className="sr-only md:not-sr-only">New Group</span>
                        </button>
                    )}
                </div>

                <div className="w-full border-t-[1.5px] border-dashed border-brand-secondary-2" />

                {isCreating && (
                    <div className="animate-in slide-in-from-top-2 duration-300">
                        <CreateGroupForm
                            onCreated={handleCreated}
                            onCancel={() => setIsCreating(false)}
                        />
                    </div>
                )}

                {groups.length === 0 && !isCreating ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                        <div className="p-3 rounded-full bg-brand-neutral-2">
                            <Icon icon="hugeicons:user-group" className="size-6 text-brand-neutral-6" />
                        </div>
                        <p className="text-sm font-medium text-brand-secondary-8">No groups yet</p>
                        <p className="text-xs text-brand-secondary-5">Create a group to split tickets with friends.</p>
                    </div>
                ) : (
                    <div className="w-full max-w-sm space-y-4">
                        {groups.map(group => (
                            <GroupCard key={group.id} group={group} onDelete={handleDeleted} />
                        ))}
                    </div>
                )}
            </section>
        </main>
    )
}