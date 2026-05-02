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


// const IS_QA = process.env.NEXT_PUBLIC_QA_MODE === "true"

const toFormValues = (profile: UserProfile): ProfileFormValues => ({
    fullName: profile.full_name ?? "",
    email: profile.email ?? "",
    phoneNumber: profile.phone_number ?? "",
    gender: profile.gender ?? "",
    country: countries.find(v =>
        v.label.toLowerCase() === profile.country?.toLowerCase() ||
        v.value.toLowerCase() === profile.country?.toLowerCase() ||
        v.label.toLowerCase().trim().match(profile.country?.toLocaleLowerCase().trim())
    )?.value || profile.country || "",
    state: profile.state ?? "",
    city: profile.city ?? "",
    dob: profile.dob ? new Date(`${profile.dob}T00:00:00`) : undefined as unknown as Date,
    profileImage: profile.profile_picture ?? undefined,
})

const toPayload = (values: ProfileFormValues, hasCountry: boolean): UpdateProfilePayload => {
    const payload: UpdateProfilePayload = {
        full_name: values.fullName,
        phone_number: values.phoneNumber,
        gender: values.gender,
        state: resolveStateLabel(values.country, values.state),
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
    const [isEditing, setIsEditing] = useState(false)

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
            setIsEditing(false)

            dispatch(setUser(result.data))

            dispatch(showAlert({
                variant: "success",
                title: "Profile updated",
                description: "Your profile has been successfully updated.",
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
        setIsEditing(false)
    }

    const editBtnRef = useRef<HTMLButtonElement>(null)
    const [hasAnimated, setHasAnimated] = useState(false)
    const [showRing, setShowRing] = useState(false)
    const [showTooltip, setShowTooltip] = useState(false)

    useEffect(() => {
        if (hasAnimated) return
        const timer = setTimeout(() => {
            editBtnRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
            setShowRing(true)
            setShowTooltip(true)
            setHasAnimated(true)
            setTimeout(() => setShowRing(false), 2200)
            setTimeout(() => setShowTooltip(false), 3000)
        }, 900)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="w-full max-w-4xl pt-8 pb-16">
            <div className="flex items-center justify-between mb-8">
                <h2 className={cn(space_grotesk.className, "text-brand-secondary-8 font-bold text-lg")}>
                    Profile Information
                </h2>

                {!isEditing && (
                    <div className="relative flex items-center justify-center">

                        {/* Tooltip */}
                        <div
                            style={{
                                position: "absolute",
                                top: "-36px",
                                left: "50%",
                                background: "var(--color-primary-9)",
                                color: "var(--color-primary-2)",
                                fontSize: "11px",
                                fontWeight: 500,
                                padding: "4px 10px",
                                borderRadius: "20px",
                                whiteSpace: "nowrap",
                                pointerEvents: "none",
                                zIndex: 50,
                                transition: "opacity 0.4s ease, transform 0.4s ease",
                                opacity: showTooltip ? 1 : 0,
                                transform: showTooltip
                                    ? "translateX(-50%) translateY(0)"
                                    : "translateX(-50%) translateY(4px)",
                            }}
                        >
                            Click to edit
                        </div>

                        {/* Pulse rings */}
                        {showRing && (
                            <>
                                <span style={{
                                    position: "absolute",
                                    inset: "-4px",
                                    borderRadius: "10px",
                                    border: "2px solid var(--color-primary-5)",
                                    animation: "editRing 0.65s ease-out 0s 3 forwards",
                                    pointerEvents: "none",
                                }} />
                                <span style={{
                                    position: "absolute",
                                    inset: "-4px",
                                    borderRadius: "10px",
                                    border: "2px solid var(--color-primary-5)",
                                    animation: "editRing 0.65s ease-out 0.22s 3 forwards",
                                    pointerEvents: "none",
                                    opacity: 0.5,
                                }} />
                            </>
                        )}
                        <button
                            ref={editBtnRef}
                            type="button"
                            onClick={() => setIsEditing(true)}
                            style={{
                                outline: showRing ? "2px solid #91b5e9" : "2px solid transparent",
                                outlineOffset: "2px",
                                transition: "outline 0.3s ease",
                                borderRadius: "8px",
                            }}
                            className="flex items-center md:bg-brand-primary-1 p-2 rounded-lg justify-between text-xs font-bold gap-2 text-brand-primary-5 hover:text-brand-primary-7"
                        >
                            <span className="size-11 md:size-7 aspect-square rounded-md flex justify-center items-center text-white bg-brand-primary-3">
                                <Icon icon="hugeicons:pencil-edit-01" width="30" className="md:w-4.5" />
                            </span>
                            <span className="sr-only md:not-sr-only">Edit Info</span>
                        </button>
                    </div>
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
                        showRequired
                        label="Full Name"
                        readOnly={!isEditing}
                        className={!isEditing ? "pointer-events-none" : ""}
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

                    <CustomInput2
                        showRequired
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
                                showRequired
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
                                showRequired
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
                                label={`Country ${!!activeData.country ? '(Not editable)' : ''}`}
                                options={countries}
                                value={field.value}
                                showRequired
                                onValueChange={field.onChange}
                                error={errors.country?.message}
                                disabled={!isEditing || !!activeData.country}
                                className={cn((!isEditing || !!activeData.country) && "pointer-events-none opacity-80")}
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
                                className={cn(!isEditing && "pointer-events-none")}
                            />
                        )}
                    />

                    <CustomInput2
                        showRequired
                        label="City"
                        readOnly={!isEditing}
                        error={errors.city?.message}
                        className={!isEditing ? "pointer-events-none!" : ""}
                        {...register("city")}
                    />

                    {isEditing && (
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