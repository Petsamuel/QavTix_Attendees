"use client"

import { useState, KeyboardEvent } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import { EditGroupFormValues, editGroupSchema } from "@/schemas/edit-group.schema"
import CustomInput1 from "../custom-utils/inputs/CustomInput1"
import { validateEmail } from "@/helper-fns/validateEmail"
import ActionButton1 from "../custom-utils/buttons/ActionBtn1"
import { updateGroup } from "@/actions/groups"
import { useAppDispatch } from "@/lib/redux/hooks"
import { showAlert } from "@/lib/redux/slices/alertSlice"

interface Props {
    groupID:     string
    initialData: EditGroupFormValues
}

export default function EditGroupForm({ groupID, initialData }: Props) {

    const dispatch     = useAppDispatch()
    const [emailInput, setEmailInput] = useState("")

    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<EditGroupFormValues>({
        resolver:      zodResolver(editGroupSchema),
        defaultValues: initialData,
    })

    const members = watch("members")

    const addMember = (e: KeyboardEvent<HTMLInputElement>) => {
        clearErrors("members")
        if (e.key !== "Enter" || !emailInput.trim()) return
        e.preventDefault()
        const err = validateEmail(emailInput)
        if (err) { setError("members", { message: err }); return }
        if (!members.includes(emailInput.trim())) {
            setValue("members", [...members, emailInput.trim()], { shouldDirty: true })
        }
        setEmailInput("")
    }

    const removeMember = (email: string) => {
        setValue("members", members.filter(m => m !== email), { shouldDirty: true })
    }

    const onSubmit = async (values: EditGroupFormValues) => {
        const result = await updateGroup(groupId, values)

        if (result.success) {
            reset(values)   // update baseline so isDirty resets
            dispatch(showAlert({
                variant:     "default",
                title:       "Group updated",
                description: `"${values.name}" has been saved.`,
            }))
        } else {
            dispatch(showAlert({
                variant:     "destructive",
                title:       "Could not update group",
                description: result.message ?? "Please try again.",
            }))
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg space-y-6">
            <div className="space-y-6">
                <CustomInput1
                    label="Group Name"
                    placeholder="Enter group name"
                    className="h-12"
                    error={errors.name?.message}
                    {...register("name")}
                />

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-brand-secondary-9">
                        Add Members
                    </label>
                    <div className={cn(
                        "flex flex-wrap gap-2 p-2 min-h-25 rounded-xl border-[1.4px] transition-all duration-200 bg-gray-50/30",
                        errors.members ? "border-red-400" : "border-brand-primary-2 focus-within:border-brand-primary-4 focus-within:ring-1 focus-within:ring-brand-primary-4"
                    )}>
                        {members.map(email => (
                            <div key={email} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-200/70 text-brand-secondary-7 rounded-md text-sm animate-in zoom-in-95 duration-200">
                                <span>{email}</span>
                                <button type="button" onClick={() => removeMember(email)} className="hover:text-red-500 transition-colors">
                                    <Icon icon="hugeicons:cancel-01" width="14" />
                                </button>
                            </div>
                        ))}
                        <input
                            type="text"
                            value={emailInput}
                            onChange={e => setEmailInput(e.target.value)}
                            onKeyDown={addMember}
                            placeholder={members.length === 0 ? "Type email and press Enter..." : "Add more..."}
                            className="flex-1 ps-1 min-w-30 bg-transparent outline-none text-sm text-brand-secondary-9 placeholder:text-brand-secondary-4"
                        />
                    </div>
                    {errors.members && (
                        <p className="text-xs text-red-500 mt-1">{errors.members.message}</p>
                    )}
                </div>
            </div>

            <div className="pt-4">
                <ActionButton1
                    buttonText="Save Changes"
                    buttonType="submit"
                    isDisabled={!isDirty}
                    isLoading={isSubmitting}
                    className="rounded-md h-11!"
                />
            </div>
        </form>
    )
}