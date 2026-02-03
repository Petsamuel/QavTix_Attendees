"use client"

import { cn } from "@/lib/utils";
import Image from "next/image";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { useState } from "react";

export default function BankAccountsList() {
    const [selectedBank, setSelectedBank] = useState("1");

    const accounts = [
        { id: "1", name: 'Dominic Evans Onyebuchi', bank: 'First Bank Nigeria', acc: '0987654321', logo: '/images/demo-images/bank-logo.png' },
        { id: "2", name: 'Buchi Johnson', bank: 'MoniePoint', acc: '1029384756', logo: '/images/demo-images/bank-logo.png' }
    ];

    return (
        <RadioGroup 
            value={selectedBank} 
            onValueChange={(v) => setSelectedBank(v)} 
            className="space-y-3 animate-in slide-in-from-bottom-2 duration-300"
        >
            {accounts.map((acc) => (
                <Label
                    key={acc.id}
                    htmlFor={acc.id}
                    className={cn(
                        "flex items-center gap-4 p-4 rounded-lg border border-brand-neutral-3 transition-all cursor-pointer",
                        "shadow-[0px_5.02px_20.08px_0px_#3326AE14]",
                        selectedBank === acc.id 
                            ? "" 
                            : "hover:bg-brand-primary-1/30"
                    )}
                >
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm border border-gray-100 shrink-0 overflow-hidden">
                        <Image 
                            src={acc.logo} 
                            width={40} 
                            height={40} 
                            alt={acc.bank} 
                            className="object-contain"
                        />
                    </div>

                    <div className="flex-1 space-y-0.5">
                        <h4 className="text-sm font-bold text-brand-secondary-9">
                            {acc.acc}
                        </h4>
                        <p className="text-xs text-brand-secondary-8 font-normal">
                            {acc.name}
                        </p>
                    </div>

                    <RadioGroupItem 
                        className="border-[1.5px] shrink-0" 
                        value={acc.id} 
                        id={acc.id}
                    />
                </Label>
            ))}
        </RadioGroup>
    );
}