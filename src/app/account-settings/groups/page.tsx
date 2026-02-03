import GroupCard from "@/components/cards/GroupCard";
import { space_grotesk } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { INITIAL_GROUPS } from "@/mock-data";

export default function GroupSettingsPage() {
    return (
        <main className="w-full pt-8 pb-16 space-y-12">
            <h2 className={cn(space_grotesk.className, "text-lg font-bold text-brand-secondary-9")}>Group</h2>
            
            {/* Email Notifications Section */}
            <section className="space-y-6">
                <header>
                    <h3 className="text-base font-bold text-brand-secondary-9">My Groups</h3>
                    <p className="text-sm text-brand-secondary-9">List of Groups you belong to</p>
                </header>

                <div className="relative flex justify-center h-full">
                    {/* Horizontal Line */}
                    <div className="w-full border-t-[1.5px] border-dashed border-brand-secondary-2" />
                </div>


                <div className="w-full max-w-sm space-y-4">
                    {INITIAL_GROUPS.map((group) => (
                        <GroupCard key={group.id} group={group} />
                    ))}
                </div>
            </section>
        </main>
    )
}