import { Skeleton } from "../ui/skeleton";

export function BankAccountSkeleton() {
    return (
        <div className="space-y-3">
            {[1, 2].map(i => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-lg border border-brand-neutral-3">
                    <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-3.5 w-28 rounded" />
                        <Skeleton className="h-3 w-40 rounded" />
                    </div>
                    <Skeleton className="w-4 h-4 rounded-full shrink-0" />
                </div>
            ))}
        </div>
    )
}