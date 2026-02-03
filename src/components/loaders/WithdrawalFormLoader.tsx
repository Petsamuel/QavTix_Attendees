import { Skeleton } from "../ui/skeleton";

export default function WithdrawalFormLoader() {
    return (
        <div className="w-full max-w-md mx-auto space-y-8 p-4">
            <div className="w-full h-40 rounded-3xl bg-linear-to-br from-secondary-1 to-secondary-3 p-6 flex flex-col justify-center gap-4 shadow-sm">
                <Skeleton className="h-4 w-32 bg-brand-neutral-6" />
                <Skeleton className="h-10 w-48 bg-brand-neutral-5" />
            </div>

            <div className="flex items-center gap-4 py-2 border-b border-brand-neutral-5">
                <Skeleton className="h-6 w-6 bg-brand-neutral-4" />
                <Skeleton className="h-8 flex-1 bg-brand-neutral-5" />
            </div>

            <div className="grid grid-cols-3 gap-3">
                {[...Array(8)].map((_, i) => (
                <Skeleton 
                    key={i} 
                    className="h-12 w-full rounded-xl bg-brand-neutral-5" 
                />
                ))}
            </div>

            <div className="space-y-3">
                <Skeleton className="h-4 w-40 bg-brand-neutral-6" />
                <div className="p-4 border border-brand-neutral-5 rounded-xl flex justify-between items-center">
                <Skeleton className="h-5 w-32 bg-brand-neutral-5" />
                <Skeleton className="h-4 w-4 bg-brand-neutral-6" />
                </div>
            </div>

            <Skeleton className="h-14 w-full rounded-xl bg-brand-primary-5 shadow-sm" />
        </div>
    )
}