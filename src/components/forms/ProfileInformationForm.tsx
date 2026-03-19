"use client"

import { useState } from "react"
import { useForm, Controller, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { cn } from "@/lib/utils"
import { Icon } from "@iconify/react"
import { ProfileFormValues, profileSchema } from "@/schemas/account-settings.schema"
import ProfileImageUploader from "@/components/custom-utils/inputs/ImageUpload"
import CustomInput2 from "@/components/custom-utils/inputs/CustomInput2"
import CustomSelect2 from "@/components/custom-utils/inputs/CustomSelect2"
import { countries, getStates } from "@/components-data/location"
import { space_grotesk } from "@/lib/fonts"
import { GENDER_OPTIONS } from "@/components-data/gender-options"
import CustomDatePicker from "@/components/custom-utils/inputs/CustomDatePicker"
import { ChevronDown } from "lucide-react"
import ActionButton1 from "@/components/custom-utils/buttons/ActionBtn1"
import { useAppDispatch } from "@/lib/redux/hooks"
import { showAlert } from "@/lib/redux/slices/alertSlice"
import { updateProfile } from "@/actions/settings/profile"


// const IS_QA = process.env.NEXT_PUBLIC_QA_MODE === "true"

const toFormValues = (profile: UserProfile): ProfileFormValues => ({
    fullName:     profile.full_name,
    email:        profile.email,
    phoneNumber:  profile.phone_number,
    gender:       profile.gender,
    country:      countries.find(v => v.label.toLowerCase() === profile.country.toLowerCase() || v.value.toLowerCase() === profile.country.toLowerCase() || v.label.toLowerCase().trim().match(profile.country.toLocaleLowerCase().trim()))?.value || profile.country,
    state:        profile.state,
    city:         profile.city,
    dob:          profile.dob ? new Date(profile.dob) : undefined,
    profileImage: profile.profile_picture ?? undefined,
})

const toPayload = (values: ProfileFormValues): UpdateProfilePayload => {
    const profilePicture: string | null =
        values.profileImage instanceof File
            ? null       
            : (values.profileImage as string | undefined) ?? null

    return {
        full_name:       values.fullName,
        phone_number:    values.phoneNumber,
        gender:          values.gender,
        country:         countries.find(v => v.value.toLowerCase() === values.country.toLowerCase())?.label,
        state:           values.state,
        city:            values.city,
        dob:             values.dob
            ? (values.dob as Date).toISOString().split("T")[0]
            : null,
        profile_picture: profilePicture,
    }
}



interface Props {
    profile: UserProfile
}

export default function ProfileInformationForm({ profile }: Props) {

    const dispatch    = useAppDispatch()
    const activeData  = profile
    const [isEditing,   setIsEditing]   = useState(false)

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        reset,
        formState: { errors, isDirty, isSubmitting },
    } = useForm<ProfileFormValues>({
        resolver:      zodResolver(profileSchema),
        defaultValues: toFormValues(activeData),
    })

    const country = watch("country")

    const onSubmit: SubmitHandler<ProfileFormValues> = async (values) => {
        const result = await updateProfile(toPayload(values))

        if (result.success && result.data) {
            reset(toFormValues(result.data))
            setIsEditing(false)
            dispatch(showAlert({
                variant:     "default",
                title:       "Profile updated",
                description: "Your changes have been saved.",
            }))
        } else {
            dispatch(showAlert({
                variant:     "destructive",
                title:       "Update failed",
                description: result.message ?? "Could not save your profile. Please try again.",
            }))
        }
    }

    const handleCancel = () => {
        reset(toFormValues(activeData))
        setIsEditing(false)
    }

    return (
        <div className="w-full max-w-4xl pt-8 pb-16">
            <div className="flex items-center justify-between mb-8">
                <h2 className={cn(space_grotesk.className, "text-brand-secondary-8 font-bold text-lg")}>
                    Profile Information 
                </h2>

                {!isEditing && (
                    <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="flex items-center md:bg-brand-primary-1 p-2 rounded-lg justify-between text-xs font-bold gap-2 transition-opacity text-brand-primary-5 hover:text-brand-primary-7"
                    >
                        <span className="size-11 md:size-7 aspect-square rounded-md flex justify-center items-center text-white bg-brand-primary-3">
                            <Icon icon="hugeicons:pencil-edit-01" width="30" className="md:w-4.5" />
                        </span>
                        <span className="sr-only md:not-sr-only">Edit Info</span>
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="flex justify-center items-center md:justify-start">
                    <ProfileImageUploader
                        isEditing={isEditing}
                        initialImage={activeData.profile_picture ?? null}
                        onImageChange={(v) => setValue("profileImage", v, { shouldDirty: true })}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                    <CustomInput2
                        label="Full Name"
                        readOnly={!isEditing}
                        className={!isEditing ? "pointer-events-none" : ""}
                        error={errors.fullName?.message}
                        {...register("fullName")}
                    />

                    <CustomInput2
                        label="Email Address"
                        readOnly
                        className="pointer-events-none"
                        error={errors.email?.message}
                        {...register("email")}
                        verified={activeData.email_verified}
                        verifiedMessage="Email address verified"
                    />

                    <CustomInput2
                        label="Phone Number"
                        readOnly={!isEditing}
                        className={!isEditing ? "pointer-events-none" : ""}
                        error={errors.phoneNumber?.message}
                        {...register("phoneNumber")}
                    />

                    <Controller
                        name="dob"
                        control={control}
                        render={({ field }) => (
                            <CustomDatePicker
                                label="Date Of Birth"
                                placeholder="Select"
                                icon={ChevronDown}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.dob?.message}
                                disabled={!isEditing || isSubmitting}
                            />
                        )}
                    />

                    <Controller
                        name="gender"
                        control={control}
                        render={({ field }) => (
                            <CustomSelect2
                                label="Gender"
                                options={GENDER_OPTIONS}
                                value={field.value}
                                onValueChange={field.onChange}
                                error={errors.gender?.message}
                                className={cn(!isEditing && "pointer-events-none")}
                            />
                        )}
                    />

                    <Controller
                        name="country"
                        control={control}
                        render={({ field }) => (
                            <CustomSelect2
                                label="Country"
                                options={countries}
                                value={field.value}
                                onValueChange={field.onChange}
                                error={errors.country?.message}
                                className={cn(!isEditing && "pointer-events-none")}
                            />
                        )}
                    />

                    <Controller
                        name="state"
                        control={control}
                        render={({ field }) => (
                            <CustomSelect2
                                label="State"
                                options={getStates(country)}
                                value={field.value}
                                onValueChange={field.onChange}
                                error={errors.state?.message}
                                className={cn(!isEditing && "pointer-events-none")}
                            />
                        )}
                    />

                    <CustomInput2
                        label="City"
                        readOnly={!isEditing}
                        error={errors.city?.message}
                        className={!isEditing ? "pointer-events-none!" : ""}
                        {...register("city")}
                    />

                    {isEditing && isDirty && (
                        <div className="md:col-span-2 flex gap-6 mt-2 animate-in slide-in-from-bottom-2 duration-300">
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={isSubmitting}
                                className="w-1/2 rounded-lg border border-brand-neutral-6 bg-brand-neutral-5 text-sm font-medium text-brand-secondary-6 hover:bg-brand-neutral-4 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <ActionButton1
                                buttonText={isSubmitting ? "Saving..." : "Save Changes"}
                                className="w-1/2 rounded-lg"
                                iconPosition="right"
                                buttonType="submit"
                                icon={isSubmitting ? "eos-icons:three-dots-loading" : "gravity-ui:arrow-right"}
                                isDisabled={isSubmitting}
                                isLoading={isSubmitting}
                            />
                        </div>
                    )}
                </div>
            </form>
        </div>
    )
}