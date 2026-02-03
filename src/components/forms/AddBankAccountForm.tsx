"use client"

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction } from "react";
import { DialogTitle } from "@/components/ui/dialog";
import { addAccountSchema, AddAccountSchemaType } from "@/schemas/add-account.schema";
import { AnimatedDialog } from "../custom-utils/dialogs/AnimatedDialog";
import CustomSelect from "../custom-utils/inputs/CustomSelect";
import CustomInput1 from "../custom-utils/inputs/CustomInput1";

export default function AddBankAccountForm({ openAddAccountModal, setOpenAddAccountModal }:{ openAddAccountModal: boolean, setOpenAddAccountModal: Dispatch<SetStateAction<boolean>> }){

    const {
        control,
        register,
        formState: { errors },
    } = useForm<AddAccountSchemaType>({
        resolver: zodResolver(addAccountSchema),
    })

    return (
        <AnimatedDialog className="md:max-w-[25em]" open={openAddAccountModal} onOpenChange={setOpenAddAccountModal}>
            <div>
                <div className="flex justify-center items-center flex-col text-center">
                    <DialogTitle className="font-semibold text-brand-secondary-9">Add Bank Account</DialogTitle>
                    <p className="text-sm text-brand-secondary-6 mt-2">Fill out the form to add a new Bank Account</p>
                </div>

                <form className="mt-8 space-y-5">
                    <Controller
                        name="bank_name"
                        defaultValue=''
                        control={control}
                        render={({ field }) => (
                            <CustomSelect
                                label="Bank Name"
                                required
                                options={[
                                    { value: 'bank1', label: 'Bank 1' },
                                    { value: 'bank2', label: 'Bank 2' },
                                    { value: 'bank3', label: 'Bank 3' },
                                ]}
                                value={field.value}
                                onValueChange={field.onChange}
                                error={errors.bank_name?.message}
                            />
                        )}
                    />


                    <CustomInput1
                        label="Account Number"
                        error={errors.account_number?.message}
                        {...register('account_number')}
                        placeholder="Enter 10-Digit Account Number"
                    />


                    <div className="flex justify-between gap-4">
                        <button
                            type="button"
                            className="flex-1 text-brand-secondary-8 bg-white hover:shadow flex items-center gap-2 justify-center px-6 py-3.5 rounded-[30px] border-2 border-brand-secondary-3 font-medium text-sm hover:bg-brand-neutral-2 hover:border-brand-secondary-5 active:bg-brand-neutral-3 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-neutral-4 focus:ring-offset-2 transition-all duration-150"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="flex-1 px-6 py-3.5 rounded-[30px] bg-brand-primary hover:bg-brand-primary-7 active:bg-brand-primary-8 hover:shadow-md active:scale-[0.98] disabled:bg-brand-neutral-5 disabled:cursor-not-allowed disabled:opacity-60 text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 transition-all duration-150 flex items-center justify-center gap-2"
                        >
                            Confirm
                        </button>
                    </div>
                </form>
            </div>
        </AnimatedDialog>
    )
}