"use client"

import { useCallback, useState } from "react"
import { ToggleItem } from "@/components/custom-utils/inputs/CustomToggleItem"
import { cn } from "@/lib/utils"
import { space_grotesk } from "@/lib/fonts"
import { useForm } from "react-hook-form"
import ActionButton1 from "@/components/custom-utils/buttons/ActionBtn1"
import { useAppDispatch } from "@/lib/redux/hooks"
import { openPasswordModal } from "@/lib/redux/slices/passwordModalConfirmationSlice"
import { showAlert } from "@/lib/redux/slices/alertSlice"
import {
    updatePrivacySettings,
    downloadPrivacyData,
} from "@/actions/privacy"

interface Props {
    initialSettings: PrivacySettings
}

export default function PrivacySettingsPageCW({ initialSettings }: Props) {

    const dispatch      = useAppDispatch()
    const [anyLoading,  setAnyLoading]  = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)

    const { control, getValues } = useForm({
        defaultValues: {
            showEvents:     initialSettings.show_events,
            allowFavorites: initialSettings.show_favorites,
        },
    })

    const save = useCallback(async () => {
        setAnyLoading(true)
        const values  = getValues()
        const result  = await updatePrivacySettings({
            show_events:    values.showEvents,
            show_favorites: values.allowFavorites,
        })
        setAnyLoading(false)

        if (!result.success) {
            dispatch(showAlert({
                variant:     "destructive",
                title:       "Could not save privacy settings",
                description: result.message ?? "Please try again.",
            }))
        }
    }, [getValues, dispatch])

    const handleDownload = async () => {
        if (isDownloading) return
        setIsDownloading(true)
        const result = await downloadPrivacyData()
        setIsDownloading(false)

        dispatch(showAlert({
            variant:     result.success ? "default" : "destructive",
            title:       result.success ? "Data request sent" : "Download failed",
            description: result.success
                ? "A copy of your data will be delivered to your email shortly."
                : result.message ?? "Please try again.",
        }))
    }

    return (
        <main className="w-full pt-8 pb-16">
            <h2 className={cn(space_grotesk.className, "text-lg font-bold text-brand-secondary-9 mb-12")}>
                Privacy
            </h2>

            <div className="space-y-14">
                {/* Activity Sharing */}
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
                            disabled={anyLoading}
                            onChange={save}
                        />
                        <ToggleItem
                            control={control}
                            name="allowFavorites"
                            label="Allow people to see my favorites"
                            disabled={anyLoading}
                            onChange={save}
                        />
                    </div>
                </section>

                {/* Download Data */}
                <section className="space-y-6">
                    <header>
                        <h3 className="text-base font-bold text-brand-secondary-9">Download My Data</h3>
                        <p className="text-sm text-brand-secondary-9 font-medium">
                            Get a copy of all your data delivered via email
                        </p>
                    </header>
                    <div className="w-full border-t-[1.5px] border-dashed border-brand-secondary-2" />
                    <ActionButton1
                        action={handleDownload}
                        buttonText={isDownloading ? "Requesting..." : "Download Data"}
                        buttonType="button"
                        icon={isDownloading ? "eos-icons:three-dots-loading" : "hugeicons:download-01"}
                        className="h-12! rounded-md font-semibold"
                        iconPosition="left"
                        isLoading={isDownloading}
                    />
                </section>

                {/* Delete Account */}
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