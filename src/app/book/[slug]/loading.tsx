'use client';

import { Card, CardBody, Skeleton } from '@heroui/react';
import ContainerComponent from '../../shared/ui/container.component';

export default function Loading() {
  return (
    <ContainerComponent className="w-full py-8 space-y-8">
      {/* Back Button Skeleton */}
      <Skeleton className="h-10 w-32 rounded" />

      {/* Book Details Skeleton */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Book Cover Skeleton */}
        <div className="w-full lg:w-1/3">
          <Skeleton className="aspect-[3/4] w-full rounded-lg" />
        </div>

        {/* Book Info Skeleton */}
        <div className="w-full lg:w-2/3 space-y-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <Skeleton className="h-8 w-3/4 rounded" />
              <Skeleton className="h-12 w-12 rounded-full" />
            </div>
            <Skeleton className="h-6 w-1/2 rounded" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-28 rounded-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20 rounded" />
              <div className="flex flex-wrap gap-1">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-18 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section Skeleton */}
      <div className="space-y-6">
        <Skeleton className="h-6 w-32 rounded" />
        
        <Card>
          <CardBody className="space-y-4">
            <Skeleton className="h-4 w-40 rounded" />
            <Skeleton className="h-10 w-full rounded" />
            <Skeleton className="h-24 w-full rounded" />
            <Skeleton className="h-10 w-32 rounded" />
          </CardBody>
        </Card>
      </div>
    </ContainerComponent>
  );
}
