import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

function MetricsContainerLoader() {
    return (
        <div className={cn(
            'grid grid-cols-1 xsm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 md:mt-4'
        )}>
            {Array.from({ length: 4 }).map((_,i) => (
                <Skeleton key={i} className="rounded-2xl w-full h-32 bg-[#E0E0E0] overflow-hidden" />
            ))}
        </div>
    )
}

export default MetricsContainerLoader;