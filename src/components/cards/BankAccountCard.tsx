import { space_grotesk } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import Image from "next/image";

export default function BankAccountCard(){
    return (
        <div className={cn(
            "w-full sm:w-75", 
            "flex flex-col gap-4 p-6",
            
            "bg-white rounded-2xl border border-gray-100",
            "shadow-[0px_6px_24px_rgba(51,38,174,0.08)]",
            
            "transition-all duration-300 ease-out",
            "hover:shadow-[0px_12px_32px_rgba(51,38,174,0.12)]", 
            "hover:-translate-y-1 hover:scale-[1.02]",
            
            "focus-within:ring-2 focus-within:ring-brand-primary-6/20"
        )}>            
            <div className="flex items-center gap-2">
                <Image 
                    src="/images/demo-images/bank-logo.png"
                    width={50}
                    height={50}
                    className="size-6"
                    alt=""
                />
                <p className="text-xs md:text-sm font-medium text-brand-secondary-9">First Bank Nigeria</p>
            </div>
            <h2 className={cn(space_grotesk.className, "text-2xl md:text-[30px] font-medium text-brand-secondary-9")}>0987654321</h2>

            <div className="flex items-center gap-2">
                <Icon icon="bxs:user" width="24" height="24" className="text-brand-primary-4" />
                <p className="text-xs text-brand-secondary-5 md:text-sm">Dominic Evans Onyebuchi</p>
            </div>
        </div>
    )
}