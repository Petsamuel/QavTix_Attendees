"use client"

import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"

interface ViewMorePaginationProps {
  hasMore: boolean
  onViewMore: () => void
  isLoading?: boolean
  currentCount: number
  totalCount?: number
  className?: string
}

export default function ViewMorePagination({
  hasMore,
  onViewMore,
  isLoading = false,
  currentCount,
  totalCount,
  className = ''
}: ViewMorePaginationProps) {
  
  if (!hasMore) return null

  return (
    <div className={cn("flex flex-col items-center gap-2 pt-10", className)}>
      {/* Optional count display */}
      {totalCount && (
        <p className="text-xs text-brand-neutral-6">
          Showing {currentCount} of {totalCount}
        </p>
      )}
      
      <button
        onClick={onViewMore}
        disabled={isLoading}
        className={cn(
          "p-3 rounded-lg text-xs font-medium transition-all flex items-center gap-2",
          "bg-brand-neutral-3 text-brand-secondary-9",
          "hover:bg-brand-neutral-4",
          "active:scale-95",
          isLoading && "opacity-50 cursor-not-allowed"
        )}
      >
        {isLoading ? (
          <>
            <Icon icon="svg-spinners:ring-resize" width="16" height="16" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            <span>Load More</span>
            <Icon icon="solar:arrow-down-outline" width="20" height="14" />
          </>
        )}
      </button>
    </div>
  )
}