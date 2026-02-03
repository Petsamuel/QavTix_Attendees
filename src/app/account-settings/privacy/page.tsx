"use client"

import { Icon } from "@iconify/react";
import { ToggleItem } from "@/components/custom-utils/inputs/CustomToggleItem";
import { cn } from "@/lib/utils";
import { space_grotesk } from "@/lib/fonts";
import { useForm } from "react-hook-form";
import ActionButton1 from "@/components/custom-utils/buttons/ActionBtn1";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { closePasswordModal, openPasswordModal } from "@/lib/redux/slices/passwordModalConfirmationSlice";
import { useEffect } from "react";
import { openSuccessModal } from "@/lib/redux/slices/successModalSlice";

export default function PrivacySettingsPage() {


    const { control } = useForm({
        defaultValues: {
            showEvents: true,
            allowFavorites: false,
        }
    })

    const dispatch = useAppDispatch()
    const { isVerified, lastVerifiedAction } = useAppSelector(store => store.passwordModal)


    useEffect(() => {
        if(isVerified && lastVerifiedAction === "delete_account"){
            dispatch(closePasswordModal())
            dispatch(openSuccessModal({
                title: "Deletion Complete",
                description: "Your account has been permanently removed. Thank you for being with us.",
                variant: "account_deleted"
            }))
        }
    },[isVerified, lastVerifiedAction])


    return (
        <main className="w-full pt-8 pb-16">
            <h2 className={cn(space_grotesk.className, "text-lg font-bold text-brand-secondary-9 mb-12")}>
                Privacy
            </h2>
            <div className="space-y-14">

                {/* Activity Sharing Section */}
                <section className="space-y-6">
                    <header>
                        <h3 className="text-base font-bold text-brand-secondary-9">Activity Sharing:</h3>
                        <p className="text-sm text-brand-secondary-9 font-medium">
                            Control how your activity is shared and who can see it
                        </p>
                    </header>

                    <div className="w-full border-t-[1.5px] border-dashed border-brand-secondary-2" />

                    <div className="w-full max-w-sm space-y-5">
                        <ToggleItem 
                            control={control} 
                            name="showEvents" 
                            label="Show events I'm attending" 
                        />
                        <ToggleItem 
                            control={control} 
                            name="allowFavorites" 
                            label="Allow people to see my favorites" 
                        />
                    </div>
                </section>

                {/* Download Data Section */}
                <section className="space-y-6">
                    <header>
                        <h3 className="text-base font-bold text-brand-secondary-9">Download My Data</h3>
                        <p className="text-sm text-brand-secondary-9 font-medium">
                            Get a copy of all your data delivered via email
                        </p>
                    </header>

                    <div className="w-full border-t-[1.5px] border-dashed border-brand-secondary-2" />

                    <ActionButton1 
                        buttonText="Download Data"
                        buttonType="button"
                        icon="hugeicons:download-01"
                        className="h-12! rounded-md font-semibold"
                        iconPosition="left"
                    />                        
                </section>

                {/* Delete Account Section */}
                <section className="space-y-6">
                    <header>
                        <h3 className="text-base font-bold text-brand-secondary-9">Delete My Account</h3>
                        <p className="text-sm text-brand-secondary-9 font-medium">
                            Permanently delete account. This cannot be undone.
                        </p>
                    </header>

                    <div className="w-full border-t-[1.5px] border-dashed border-brand-secondary-2" />

                    <ActionButton1 
                        action={() => dispatch(openPasswordModal("delete_account"))}
                        buttonText="Delete Account"
                        buttonType="button"
                        icon="formkit:trash" 
                        className="h-12! rounded-md font-semibold bg-red-600 active:bg-red-400 focus:ring-2 focus:ring-red-400 focus:outline-0 hover:bg-red-500"
                        iconPosition="left"
                    />    
                </section>
            </div>
        </main>
    )
}