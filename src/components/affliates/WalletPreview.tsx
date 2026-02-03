import { cn } from "@/lib/utils";
import UserInfo from "../custom-utils/users/UserInfo";

export default function WalletPreview() {
    return (
        <div
            className={cn(
                "flex animate-in slide-in-from-bottom-2 duration-300 items-center gap-4 p-4 rounded-lg border border-brand-neutral-3 transition-all cursor-pointer",
                "shadow-[0px_5.02px_20.08px_0px_#3326AE14]"
            )}
        >
            <UserInfo user={{  email: "leonardocc@gmail.com", id: 12, name: "James Cornor" }} variant="mobile" />
        </div>
    )
}