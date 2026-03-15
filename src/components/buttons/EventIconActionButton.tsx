import { motion, AnimatePresence } from "framer-motion"
import { Icon } from "@iconify/react"
import { useState } from "react"


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
    className
}: {
    icon: string
    onClick: () => void
    feedback: string
    className?: string
}) {
    const [showFeedback, setShowFeedback] = useState(false)

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setShowFeedback(true)
        onClick()
        setTimeout(() => setShowFeedback(false), 1200)
    }

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
                <Icon
                    icon={icon}
                    className="text-inherit"
                    width="18"
                />
            </motion.button>

            <AnimatePresence>
                {showFeedback && <ActionFeedback message={feedback} />}
            </AnimatePresence>
        </div>
    )
}