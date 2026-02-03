"use client"

import BankAccountCard from "@/components/cards/BankAccountCard";
import AddBankAccountForm from "@/components/forms/AddBankAccountForm";
import { space_grotesk } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

export default function BankAccountsPage(){
    return (
        <main className="w-full pt-8 pb-16 space-y-12">
            <div className="flex justify-between gap-10 items-center w-full">
                <h2 className={cn(space_grotesk.className, "text-lg font-bold text-brand-secondary-9")}>Bank Accounts</h2>
                <button aria-label="Add Bank" className="bg-brand-primary-1 text-brand-primary-6 aspect-square size-12 rounded-md p-2 flex justify-center items-center">
                    <Plus />
                </button>
            </div>


            <div className="flex gap-4 gap-y-6 flex-wrap">
                <BankAccountCard />
                <BankAccountCard />
                <BankAccountCard />
            </div>



            <AddBankAccountForm openAddAccountModal={false} setOpenAddAccountModal={() => {}} />
        </main>
    )
}