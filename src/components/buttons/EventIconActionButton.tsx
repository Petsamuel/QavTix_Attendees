import { motion, AnimatePresence } from "framer-motion"
import { Icon } from "@iconify/react"
import { useState } from "react"
import { cn } from "@/lib/utils"

function ActionFeedback({ message }: { message: string }) {
    return (
        <motion.div
            initial={{ scale: 0.6, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.6, opacity: 0, y: 10 }}
            className="absolute top-8 right-0 bg-brand-secondary-9 text-white text-xs px-3 py-1.5 rounded-md w-[9em] text-center shadow-lg z-10"
        >
            {message}
        </motion.div>
    )
}

export function EventIconActionButton({
    icon,
    onClick,
    feedback,
    externalFeedback,
    iconStyles,
    className,
}: {
    icon:              string
    onClick:           () => void
    feedback:          string       // shown instantly on click (share, copy, etc.)
    externalFeedback?: string | null // when provided, overrides internal feedback (favourites)
    iconStyles?:       string
    className?:        string
}) {
    const [internalFeedback, setInternalFeedback] = useState(false)

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        onClick()

        if (externalFeedback === undefined) {
            setInternalFeedback(true)
            setTimeout(() => setInternalFeedback(false), 1200)
        }
    }

    const visibleMessage = externalFeedback !== undefined
        ? externalFeedback
        : internalFeedback
            ? feedback
            : null

    return (
        <div className="relative">
            <motion.button
                whileTap={{ scale: 0.85 }}
                whileHover={{ scale: 1.08 }}
                onClick={handleClick}
                className={[
                    "flex w-fit p-1.5 aspect-square rounded-full items-center justify-center",
                    "bg-white/70 backdrop-blur-md",
                    "ring-1 ring-white/60 ring-inset",
                    "shadow-[0_2px_8px_rgba(0,0,0,0.18),0_1px_2px_rgba(0,0,0,0.22)]",
                    "text-brand-secondary-8",
                    "hover:bg-white/90 transition-colors duration-150",
                    className,
                ].filter(Boolean).join(" ")}
            >
                <Icon icon={icon} className={cn("text-inherit", iconStyles ?? "")} width="18" />
            </motion.button>

            <AnimatePresence>
                {visibleMessage && <ActionFeedback message={visibleMessage} />}
            </AnimatePresence>
        </div>
    )
}