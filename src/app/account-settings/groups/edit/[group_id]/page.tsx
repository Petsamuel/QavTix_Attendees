import EditGroupForm from "@/components/forms/EditGroupForm";
import { space_grotesk } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export default function EditGroupPage(){
    return (
        <main className="w-full pt-8 pb-16 space-y-12">
            <h2 className={cn(space_grotesk.className, "text-lg font-bold text-brand-secondary-9")}>Edit Group</h2>
            
            <EditGroupForm />
        </main>
    )
}