"use client";

import { FormEvent, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AnimatedDialog } from '../custom-utils/dialogs/AnimatedDialog';
import { cn } from '@/lib/utils';
import { closePasswordModal, resetPasswordStatus, setPasswordStatus, verifyPasswordSuccess } from '@/lib/redux/slices/passwordModalConfirmationSlice';
import { usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';
import ActionButton1 from '../custom-utils/buttons/ActionBtn1';

export default function PasswordModal() {


    const dispatch = useAppDispatch()
    const [password, setPassword] = useState("")
    const pathName = usePathname()
    const [showPassword, setShowPassword] = useState(false)
    
    const { isOpen, status } = useAppSelector((state) => state.passwordModal);

    useEffect(() => {
        if (isOpen) {
            dispatch(closePasswordModal())
            dispatch(resetPasswordStatus())
        }
    }, [pathName])

    const handleConfirm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!password) return;

        dispatch(setPasswordStatus('submitting'))
        
        try {
            console.log("Password Verified");
            
            // This records the success and the actionType into lastVerifiedAction
            dispatch(verifyPasswordSuccess())
            setPassword("")
        } catch (error) {
            dispatch(setPasswordStatus('error'))
        }
    }

    return (
        <AnimatedDialog 
            open={isOpen} 
            onOpenChange={() => dispatch(closePasswordModal())}
            showCloseButton={false} 
            className='md:max-w-sm py-4'
        >
            <DialogHeader className="flex flex-col items-center justify-center text-center mb-6">
                <DialogTitle className="text-xl font-bold text-brand-secondary-9">
                    Enter Password
                </DialogTitle>
                <DialogDescription className="text-sm text-brand-secondary-5 mt-1">
                    Enter password to confirm
                </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleConfirm}>
                <div className="mt-6 px-1">
                    <label className="block text-sm font-semibold text-brand-neutral-9 mb-2">
                        Password
                    </label>
                    <div className="relative group">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            className={cn(
                                "w-full h-12 px-4 rounded-md border-[1.4px] transition-all outline-none",
                                "border-brand-primary-4 bg-brand-secondary-1 focus:border-brand-primary-6 focus:bg-white",
                                status === 'error' && "border-red-500"
                            )}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-secondary-4 hover:text-brand-secondary-9 transition-colors"
                        >
                            <Icon icon={showPassword ? "hugeicons:view-off-slash" : "hugeicons:view"} width="20" />
                        </button>
                    </div>
                    {status === 'error' && (
                        <p className="text-xs text-red-500 mt-2 text-center">Incorrect password. Please try again.</p>
                    )}
                </div>           

                <DialogFooter className="mt-8 flex flex-row gap-3">
                    <button
                        onClick={() => {
                            dispatch(closePasswordModal())
                            setPassword("")
                        }}
                        className="flex-1 h-12 md:h-14 rounded-full border border-brand-secondary-6 text-brand-secondary-8 font-semibold text-sm hover:bg-brand-neutral-3 transition-all"
                    >
                        Cancel
                    </button>
                    <ActionButton1 
                        buttonText='Yes, I am'
                        buttonType='submit'
                        isDisabled={!password}
                        className='w-[55%]'
                    />
                </DialogFooter>
            </form>
        </AnimatedDialog>
    )
}