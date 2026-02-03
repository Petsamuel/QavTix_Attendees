"use client"

import React, { Dispatch, SetStateAction, useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { space_grotesk } from "@/lib/fonts";
import { Button } from "../ui/button";
import BankAccountsList from "./BankAccountList";
import WalletPreview from "./WalletPreview";
import { AnimatedDialog } from "../custom-utils/dialogs/AnimatedDialog";
import { DialogDescription, DialogTitle } from "../ui/dialog";

type LocationType = 'wallet' | 'bank';

export default function WithdrawalLocationSelector({ setOpen, open }: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>> }) {

    const [activeTab, setActiveTab] = useState<LocationType>('bank')

    const content = {
        wallet: {
            gradient: 'bg-brand-primary-6',
            checkColor: 'text-brand-primary-6',
            bgActive: 'bg-brand-primary-1',
            title: 'To Wallet',
            subtitle: 'Withdraw to your Wallet',
            icon: 'ph:wallet-fill'
        },
        bank: {
            gradient: 'bg-brand-primary-6',
            checkColor: 'text-brand-primary-6',
            bgActive: 'bg-brand-primary-1',
            title: 'To Bank',
            subtitle: 'Withdraw to your Bank Account',
            icon: 'ph:bank-fill'
        }
    }

    return (
        <AnimatedDialog open={open} showCloseButton={false} className="w-101">
            <div>
                <div className="text-center mb-8">
                    <DialogTitle className={cn("font-bold text-brand-secondary-9")}>
                        Select Withdrawal Location
                    </DialogTitle>
                    <DialogDescription className="text-xs text-brand-secondary-6 mt-1">
                        Choose an account to withdraw your earnings
                    </DialogDescription>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    {(Object.entries(content) as [LocationType, typeof content.bank][]).map(([key, tab]) => (
                        <div 
                            key={key}
                            className={cn(
                                "p-0.5 h-fit flex-1 rounded-xl overflow-hidden transition-all hover:shadow-sm duration-300",
                                activeTab === key ? tab.gradient : "bg-brand-neutral-5"
                            )}
                        >
                            <button
                                onClick={() => setActiveTab(key)}
                                className={cn(
                                    "w-full p-2 h-14.5 rounded-[11px] flex flex-row-reverse items-center gap-3 transition-all duration-300",
                                    activeTab === key ? tab.bgActive : "bg-white"
                                )}
                            >
                                <div className="text-left flex-1">
                                    <h3 className="font-bold text-brand-secondary-9 text-xs">
                                        {tab.title}
                                    </h3>
                                    <p className="text-[10px] text-brand-secondary-6 mt-0.5">
                                        {tab.subtitle}
                                    </p>
                                </div>
                                <Icon 
                                    icon="ph:seal-check-fill" 
                                    width="20" 
                                    height="20" 
                                    className={cn("shrink-0", activeTab === key ? tab.checkColor : "text-brand-neutral-5")} 
                                />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="min-h-35 flex flex-col gap-3">
                    {activeTab === 'bank' ? (
                        <BankAccountsList />
                    ) : (
                        <WalletPreview />
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8">
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        className="w-full h-12 md:h-14 px-6 py-4 text-sm font-medium text-brand-secondary-9 bg-white border border-brand-secondary-6 rounded-full hover:bg-neutral-100 transition-all"
                    >
                        Cancel
                    </Button>
                    <Button
                        className="w-full h-12 md:h-14 px-6 py-4 text-sm font-medium text-white bg-brand-primary-6 rounded-full hover:bg-brand-primary-7 hover:shadow-md transition-all"
                    >
                        Withdraw
                    </Button>
                </div>
            </div>
        </AnimatedDialog>
    )
}

