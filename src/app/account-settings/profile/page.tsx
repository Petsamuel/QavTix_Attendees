"use client"

import { useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { ProfileFormValues, profileSchema } from "@/schemas/account-settings.schema";
import ProfileImageUploader from "@/components/custom-utils/inputs/ImageUpload";
import CustomInput2 from "@/components/custom-utils/inputs/CustomInput2";
import CustomSelect2 from "@/components/custom-utils/inputs/CustomSelect2";
import { countries, getStates } from "@/components-data/location";
import { space_grotesk } from "@/lib/fonts";
import { GENDER_OPTIONS } from "@/components-data/gender-options"
import CustomDatePicker from "@/components/custom-utils/inputs/CustomDatePicker";
import { ChevronDown } from "lucide-react";
import ActionButton1 from "@/components/custom-utils/buttons/ActionBtn1";


export default function ProfileInformationForm() {

    const [isEditing, setIsEditing] = useState(false)

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors, isDirty },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            fullName: "Dominic Evans",
            phoneNumber: "+2349037273727",
            email: "jamescornor@gmail.com",
            gender: "rather_not_say",
            country: "NG",
            state: getStates("NG")[0].value,
            city: "Aba",
            dob: undefined,
        }
    })

    const onSubmit : SubmitHandler<ProfileFormValues> = (data) => {
        console.log("Saving Data:", data)
        setIsEditing(false)
    }

    const country = watch("country")

    return (
        <div className="w-full max-w-4xl pt-8 pb-16">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-8">
                <h2 className={cn(space_grotesk.className, "text-brand-secondary-8 font-bold text-lg")}>
                    Profile Information
                </h2>
                <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className={cn(
                        isEditing ? "hidden" : "flex",
                        'items-center bg-brand-primary-1 p-2 rounded-lg justify-between text-xs font-bold gap-2 transition-opacity',
                         'disabled:opacity-50 disabled:cursor-not-allowed',
                        'text-brand-primary-5 hover:text-brand-primary-7'
                    )}
                >
                    <span className={cn(
                        'size-9 md:size-7 aspect-square rounded flex justify-center items-center text-white',
                        'bg-brand-primary-3'
                    )}>
                        <Icon icon="hugeicons:pencil-edit-01" width="18" />
                    </span>
                    Edit Info
                </button>
            </div>

            <form className="space-y-8">
                <ProfileImageUploader 
                    isEditing={isEditing} 
                    initialImage={null} 
                    onImageChange={(v) => {
                        setValue("profileImage", v)
                    }}
                />

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
                        readOnly={!isEditing}
                        className={!isEditing ? "pointer-events-none" : ""}
                        error={errors.phoneNumber?.message}
                        {...register("email")}
                        verified={!isEditing}
                        verifiedMessage="Email address verified"
                    />


                    <CustomInput2
                        label="Phone Number"
                        readOnly={!isEditing}
                        className={!isEditing ? "pointer-events-none" : ""}
                        error={errors.phoneNumber?.message}
                        {...register("phoneNumber")}
                        verified={!isEditing}
                        verifiedMessage="Phone number verified"
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
                            />
                        )}
                    />

                    {/* Gender Select */}
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

                    {/* Country Select */}
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

                    {/* State Select */}
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


                    {
                        isDirty &&
                        <ActionButton1 
                            buttonText="Save Changes"
                            className="flex-1 rounded-lg w-full mt-4 animate-in slide-in-from-bottom-2 duration-300 "
                            iconPosition="right"
                            buttonType="submit"
                            icon="gravity-ui:arrow-right"
                        />
                    }
                </div>
            </form>
        </div>
    )
}