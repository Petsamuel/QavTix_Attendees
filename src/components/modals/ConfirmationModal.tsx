"use client";

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { closeConfirmation, confirmAction, resetConfirmationStatus } from '@/lib/redux/slices/confirmationSlice';
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AnimatedDialog } from '../custom-utils/dialogs/AnimatedDialog';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getConfirmationAction } from './resources/confirmationActions';

export default function ConfirmationModal() {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const pathName = usePathname()
    
    const { isOpen, title, description, confirmText, cancelText, actionType } = useAppSelector(
        (state) => state.confirmation
    )

    const handleConfirm = () => {
        if (actionType) {
            const action = getConfirmationAction(actionType, router)
            
            action()

            dispatch(confirmAction())
        } else {
            dispatch(closeConfirmation())
        }
    }

    useEffect(() => {
        if (isOpen) {
            dispatch(closeConfirmation())
            dispatch(resetConfirmationStatus())
        }
    }, [pathName])

    return (
        <AnimatedDialog open={isOpen} showCloseButton={false} className='md:max-w-sm! py-2'>
            <DialogHeader className="text-center flex justify-center items-center">
                <DialogTitle className="text-lg font-bold text-brand-secondary-9">
                    {title}
                </DialogTitle>
                <DialogDescription className="text-sm text-center text-brand-secondary-9">
                    {description}
                </DialogDescription>
            </DialogHeader>

            <DialogFooter className="mt-6 justify-center flex-row gap-3 sm:gap-3">
                <button
                    onClick={() => dispatch(closeConfirmation())}
                    className="w-full px-6 py-4 text-sm font-medium text-brand-secondary-9 bg-white border-2 border-gray-300 rounded-full hover:bg-neutral-100 transition-all"
                >
                    {cancelText}
                </button>
                <button
                    onClick={handleConfirm}
                    className="w-full px-6 py-4 text-sm font-medium text-white bg-brand-primary-6 rounded-full hover:bg-brand-primary-7 hover:shadow-md transition-all"
                >
                    {confirmText}
                </button>
            </DialogFooter>
        </AnimatedDialog>
    )
}