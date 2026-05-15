"use client"

import { useEffect, useRef, useState } from "react"
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
import { updateProfile } from "@/actions/settings/profile/client"
import { uploadToCloudinary } from "@/lib/upload/cloudinary"
import { setUser } from "@/lib/redux/slices/authUserSlice"
import { resolveCountryLabel, resolveStateLabel } from "@/helper-fns/resolveCountryCode"
import PhoneNumberInput from "../custom-utils/inputs/CustomPhoneInput"


// const IS_QA = process.env.NEXT_PUBLIC_QA_MODE === "true"

const toFormValues = (profile: UserProfile): ProfileFormValues => {
    const countryCode = profile.country
        ? countries.find(v =>
            v.label.toLowerCase() === profile.country?.toLowerCase() ||
            v.value.toLowerCase() === profile.country?.toLowerCase() ||
            v.label.toLowerCase().trim().includes(profile.country.toLocaleLowerCase().trim())
        )?.value || profile.country || ""
        : "";

    let stateCode = profile.state ?? "";
    if (countryCode && stateCode) {
        const stateList = getStates(countryCode);
        const match = stateList.find(s =>
            s.label.toLowerCase() === stateCode.toLowerCase() ||
            s.value.toLowerCase() === stateCode.toLowerCase()
        );
        if (match) {
            stateCode = match.value;
        }
    }

    return {
        fullName: profile.full_name ?? "",
        email: profile.email ?? "",
        phoneNumber: profile.phone_number ?? "",
        gender: profile.gender ?? "",
        country: countryCode,
        state: stateCode,
        city: profile.city ?? "",
        dob: profile.dob ? new Date(`${profile.dob}T00:00:00`) : undefined as unknown as Date,
        profileImage: profile.profile_picture ?? undefined,
    }
}

const toPayload = (values: ProfileFormValues, hasCountry: boolean): UpdateProfilePayload => {
    const payload: UpdateProfilePayload = {
        full_name: values.fullName,
        phone_number: values.phoneNumber,
        gender: values.gender,
        state: resolveStateLabel(values.state, values.country),
        city: values.city,
        dob: values.dob
            ? `${values.dob.getFullYear()}-${String(values.dob.getMonth() + 1).padStart(2, '0')}-${String(values.dob.getDate()).padStart(2, '0')}`
            : null,
        profile_picture: values.profileImage instanceof File ? null : (values.profileImage as string) ?? null,
    }

    if (!hasCountry) {
        payload.country = resolveCountryLabel(values.country)
    } else {
        delete payload.country
    }

    return payload
}

interface Props {
    profile: UserProfile
}

export default function ProfileInformationForm({ profile }: Props) {

    const dispatch = useAppDispatch()
    const activeData = profile
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        reset,
        formState: { errors, isDirty, isSubmitting },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: toFormValues(activeData),
    })

    const country = watch("country")

    const onSubmit: SubmitHandler<ProfileFormValues> = async (values) => {
        let profileImageUrl = '';

        if (values.profileImage && typeof values.profileImage !== "string") {
            try {
                const profileUpload = await uploadToCloudinary(
                    values.profileImage,
                    'qavtix-hosts/profiles'
                )
                profileImageUrl = profileUpload.secure_url;
            } catch (uploadError) {
                console.error("Cloudinary upload failed:", uploadError)

                dispatch(showAlert({
                    variant: "destructive",
                    title: "Upload failed",
                    description: "Failed to upload your profile picture. Please try again or choose a smaller image.",
                }))

                return;
            }
        }

        const payload = toPayload(
            { ...values, ...(profileImageUrl ? { profileImage: profileImageUrl } : {}) },
            !!activeData.country
        )

        const result = await updateProfile(payload)

        if (result.success && result.data) {
            reset(toFormValues(result.data))

            dispatch(setUser(result.data))

            const isFirstTimeUpdate = !activeData.country;

            dispatch(showAlert({
                variant: "success",
                title: isFirstTimeUpdate ? "Profile setup complete" : "Profile updated",
                description: isFirstTimeUpdate
                    ? "Welcome to QAVTIX! Your profile has been successfully set up."
                    : "Your profile has been successfully updated.",
            }))
        } else {
            dispatch(showAlert({
                variant: "destructive",
                title: "Update failed",
                description: result.message ?? "Could not save your profile. Please try again.",
            }))
        }
    }

    const handleCancel = () => {
        reset(toFormValues(activeData))
    }

    return (
        <div className="w-full max-w-4xl pt-8 pb-16">
            <div className="flex items-center justify-between mb-8">
                <h2 className={cn(space_grotesk.className, "text-brand-secondary-8 font-bold text-lg")}>
                    Profile Information
                </h2>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="flex justify-center items-center md:justify-start">
                    <ProfileImageUploader
                        isEditing={true}
                        initialImage={activeData.profile_picture ?? null}
                        onImageChange={(v) => setValue("profileImage", v, { shouldDirty: true })}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                    <CustomInput2
                        showRequired
                        label="Full Name"
                        error={errors.fullName?.message}
                        {...register("fullName")}
                    />

                    <CustomInput2
                        showRequired
                        label="Email Address"
                        readOnly
                        className="pointer-events-none"
                        error={errors.email?.message}
                        {...register("email")}
                    />

                    <Controller
                        name="phoneNumber"
                        control={control}
                        render={({ field }) => (
                            <PhoneNumberInput
                                label="Phone Number"
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.phoneNumber?.message}
                                showRequired
                                defaultCountry="US"
                            />
                        )}
                    />

                    <Controller
                        name="dob"
                        control={control}
                        render={({ field }) => (
                            <CustomDatePicker
                                label="Date Of Birth"
                                placeholder="Select"
                                showRequired
                                icon={ChevronDown}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.dob?.message}
                                disabled={isSubmitting}
                            />
                        )}
                    />

                    <Controller
                        name="gender"
                        control={control}
                        render={({ field }) => (
                            <CustomSelect2
                                label="Gender"
                                showRequired
                                options={GENDER_OPTIONS}
                                value={field.value}
                                onValueChange={field.onChange}
                                error={errors.gender?.message}
                            />
                        )}
                    />

                    <Controller
                        name="country"
                        control={control}
                        render={({ field }) => (
                            <CustomSelect2
                                label={`Country ${!!activeData.country ? '(Not editable)' : ''}`}
                                options={countries}
                                value={field.value}
                                showRequired
                                onValueChange={field.onChange}
                                error={errors.country?.message}
                                disabled={!!activeData.country}
                                className={cn(!!activeData.country && "pointer-events-none opacity-80")}
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
                                showRequired
                                onValueChange={field.onChange}
                                error={errors.state?.message}
                            />
                        )}
                    />

                    <CustomInput2
                        showRequired
                        label="City"
                        error={errors.city?.message}
                        {...register("city")}
                    />

                    {isDirty && (
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
                                className="w-1/2 rounded-lg text-sm! px-2!"
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