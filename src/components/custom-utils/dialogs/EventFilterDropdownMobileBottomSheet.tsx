'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode, useEffect, useRef } from 'react'
import { Icon } from '@iconify/react'

interface MobileBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  className?: string
}

export function MobileBottomSheet({
  isOpen,
  onClose,
  title,
  children,
  className = '',
}: MobileBottomSheetProps) {
    const scrollYRef = useRef(0)

    useEffect(() => {
        if (isOpen) {
            // Store current scroll position
            scrollYRef.current = window.scrollY
            
            // Prevent body scroll and fix position
            document.body.style.position = 'fixed'
            document.body.style.top = `-${scrollYRef.current}px`
            document.body.style.width = '100%'
            document.body.style.overflow = 'hidden'
        } else {
            // Restore body scroll and position
            document.body.style.position = ''
            document.body.style.top = ''
            document.body.style.width = ''
            document.body.style.overflow = ''
            
            // Restore scroll position
            window.scrollTo(0, scrollYRef.current)
        }
        
        return () => {
            document.body.style.position = ''
            document.body.style.top = ''
            document.body.style.width = ''
            document.body.style.overflow = ''
        }
    }, [isOpen])

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-90"
                        onClick={onClose}
                    />
                    
                    {/* Bottom Sheet */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{
                            type: 'spring',
                            damping: 30,
                            stiffness: 300,
                        }}
                        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] shadow-2xl z-100 max-h-[90vh] flex flex-col"
                    >
                        {/* Scrollable Content */}
                        <div className={`flex-1 overflow-y-auto overscroll-contain ${className}`}>
                            <div className="p-6 space-y-6">
                                {/* Header */}
                                {(title || true) && (
                                    <div className="flex items-center justify-between sticky top-0 bg-white z-10 -mt-6 pt-6 pb-4">
                                        {title && (
                                            <h3 className="font-medium text-xl text-gray-900">
                                                {title}
                                            </h3>
                                        )}
                                        <button
                                            onClick={onClose}
                                            className="ml-auto p-2 hover:bg-gray-100 rounded-full transition-colors"
                                            aria-label="Close"
                                        >
                                            <Icon
                                                icon="flowbite:close-outline"
                                                width="24"
                                                height="24"
                                                className="text-gray-900"
                                            />
                                        </button>
                                    </div>
                                )}
                                
                                {children}
                                
                                {/* Safe area for iOS */}
                                <div className="h-[env(safe-area-inset-bottom)]" />
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}