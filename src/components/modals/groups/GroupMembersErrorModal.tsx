'use client'

import { AnimatedDialog } from '@/components/custom-utils/dialogs/AnimatedDialog'
import { DialogTitle, DialogDescription } from '@/components/ui/dialog'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { space_grotesk } from "@/lib/fonts";

interface GroupMembersErrorModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    message?: string
    emails: string[]
}

export const GroupMembersErrorModal = ({
    open,
    onOpenChange,
    message,
    emails = []
}: GroupMembersErrorModalProps) => {

    const handleInvite = () => {
        if (emails.length === 0) return

        const subject = encodeURIComponent("Join me on QavTix!")
        const body = encodeURIComponent("Hey! I'm trying to add you to my group on QavTix, but it looks like you don't have an account yet. Join QavTix today to explore events and join our group! \n\nCheck it out here: https://qavtix.com")

        // Construct mailto with primary recipient and others in bcc
        const primary = emails[0]
        const bcc = emails.length > 1 ? `&bcc=${emails.slice(1).join(',')}` : ''
        const mailto = `mailto:${primary}?subject=${subject}${bcc}&body=${body}`

        window.location.href = mailto
    }

    return (
        <AnimatedDialog
            open={open}
            onOpenChange={onOpenChange}
            className="max-w-md"
            childrenContainerStyles="px-6 py-8"
        >
            <div className="flex flex-col items-center text-center">
                <div className="relative size-20 md:size-24 mb-4">
                    <Image
                        src="/images/vectors/scan-failed.svg"
                        alt="Error Illustration"
                        fill
                        className="object-contain"
                    />
                </div>

                <DialogTitle className={cn(space_grotesk.className, "text-xl md:text-2xl font-bold text-brand-secondary-9 mb-3")}>
                    {message || "Some users do not exist"}
                </DialogTitle>

                <DialogDescription className="text-sm text-brand-secondary-8 mb-6 max-w-[320px] mx-auto">
                    The following email addresses are not registered on QavTix yet. You can invite them to join!
                </DialogDescription>

                <div className="w-full bg-brand-neutral-2 rounded-2xl p-4 mb-8 max-h-40 overflow-y-auto border border-brand-neutral-3">
                    <ul className="text-left space-y-2.5">
                        {emails.map((email, index) => (
                            <li key={index} className="text-sm text-brand-secondary-9 flex items-center gap-3">
                                <div className="size-1.5 rounded-full bg-brand-primary-6 shrink-0" />
                                <span className="truncate">{email}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <Button
                    onClick={handleInvite}
                    className="w-full bg-brand-primary-6 hover:bg-brand-primary-7 text-white h-14 rounded-xl font-semibold shadow-lg shadow-brand-primary-6/20 transition-all active:scale-[0.98]"
                >
                    Invite to QavTix
                </Button>
            </div>
        </AnimatedDialog>
    )
}
