import { Skeleton } from "./skeleton"

export function ProductCardSkeleton() {
  return (
    <div className="pt-1.5 px-1.5 pb-1 sm:pt-2 sm:px-2 sm:pb-2 rounded-[12px] border border-gray-100/50">
      {/* Image Skeleton */}
      <Skeleton className="relative w-full aspect-square rounded-[12px] mb-4" />
      
      {/* Info Skeleton */}
      <div className="p-2 sm:p-3 space-y-2">
        {/* Title */}
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        
        {/* Price */}
        <div className="flex items-baseline gap-2 pt-1">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}
