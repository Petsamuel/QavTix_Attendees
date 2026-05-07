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
import { updateGroup } from "@/actions/groups/client"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { showAlert } from "@/lib/redux/slices/alertSlice"
import { useRouter } from "next/navigation"
import { NAVIGATION_LINKS, SETTINGS_SUB_LINKS } from "@/enums/navigation"
import { useIsMounted } from "@/custom-hooks/UseIsMounted"
import { useRevalidate } from "@/custom-hooks/UseRevalidate"
import { GroupMembersErrorModal } from "../modals/groups/GroupMembersErrorModal"
import ActionButton2 from "../custom-utils/buttons/ActionButton2"

interface Props {
    groupID: string
    initialData: EditGroupFormValues
}

export default function EditGroupForm({ groupID, initialData }: Props) {

    const dispatch = useAppDispatch()
    const router = useRouter()
    const { trigger } = useRevalidate("groups")
    const [emailInput, setEmailInput] = useState("")
    const [errorModal, setErrorModal] = useState<{ open: boolean; message: string; emails: string[] }>({
        open: false,
        message: "",
        emails: [],
    })

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
        resolver: zodResolver(editGroupSchema),
        defaultValues: initialData,
    })

    const { user } = useAppSelector(store => store.authUser)
    const members = watch("members")
    const submittableMembers = members.filter(v => v !== user?.email)
    const canSubmit = isDirty && submittableMembers.length > 0 && !isSubmitting
    const isMounted = useIsMounted()


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
        const updated = members.filter(m => m !== email)
        setValue("members", updated, { shouldDirty: true, shouldValidate: true })
    }

    const onSubmit = async (values: EditGroupFormValues) => {
        const result = await updateGroup(groupID, values)

        if (result.success) {
            trigger()
            reset(values)   // update baseline so isDirty resets
            dispatch(showAlert({
                variant: "success",
                title: "Group updated",
                description: `"${values.name}" has been updated.`,
            }))
            router.push(SETTINGS_SUB_LINKS.find(v => v.href.includes("groups"))?.href || NAVIGATION_LINKS.ACCOUNT_SETTINGS.href)
        } else {
            if (result.non_existing_users && result.non_existing_users.length > 0) {
                setErrorModal({
                    open: true,
                    message: result.message || "Some users do not exist",
                    emails: result.non_existing_users
                })
            } else {
                dispatch(showAlert({
                    variant: "destructive",
                    title: "Could not update group",
                    description: result.message ?? "Please try again.",
                }))
            }
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
                        {isMounted && members.filter(v => v !== user?.email).map(email => (
                            <div key={email} className="flex h-fit items-center gap-1.5 px-3 py-1.5 bg-gray-200/70 text-brand-secondary-7 rounded-md text-sm animate-in zoom-in-95 duration-200">
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
                    <p className="text-[11px] text-brand-secondary-8">Enter member's email and click enter to save</p>
                    {errors.members && (
                        <p className="text-xs text-red-500 mt-1">{errors.members.message}</p>
                    )}
                </div>
            </div>

            <div className="pt-4 flex gap-5">
                <ActionButton2
                    buttonText="Cancel"
                    action={() => router.back()}
                    className="bg-white h-11! max-w-1/2 w-[10em]"
                />
                <ActionButton1
                    buttonText="Save Changes"
                    buttonType="submit"
                    isDisabled={!canSubmit}
                    isLoading={isSubmitting}
                    className="rounded-md h-11!"
                />
            </div>
            <GroupMembersErrorModal
                open={errorModal.open}
                onOpenChange={open => setErrorModal(prev => ({ ...prev, open }))}
                message={errorModal.message}
                emails={errorModal.emails}
            />
        </form>
    )
}