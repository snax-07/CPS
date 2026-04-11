'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function JobCardSkeleton() {
  return (
    <div className="p-6 rounded-lg border border-[#e5e5e5] space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4 flex-1">
          <Skeleton className="w-12 h-12 rounded" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="w-16 h-6 rounded-full" />
      </div>
      <Skeleton className="h-3 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>
  );
}

export function ApplicantRowSkeleton() {
  return (
    <div className="p-4 rounded border border-[#e5e5e5] flex items-center gap-4 animate-pulse">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="w-20 h-8 rounded" />
      <Skeleton className="w-24 h-8 rounded" />
    </div>
  );
}

export function DashboardCardSkeleton() {
  return (
    <div className="p-6 rounded-lg border border-[#e5e5e5] space-y-4">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-16" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </div>
    </div>
  );
}

export function TableSkeletonLoader({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <ApplicantRowSkeleton key={i} />
      ))}
    </div>
  );
}
