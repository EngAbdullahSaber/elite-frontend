'use client';

import Card from '@/components/shared/Card';
import Skeleton from '@/components/shared/Skelatons/Skeleton';
import DashboardHeaderTitleSkeleton from '@/components/shared/Skelatons/DashboardHeaderTitleSkeleton';

export default function CampaignDetailsLoading() {
    return (
        <div>
            <DashboardHeaderTitleSkeleton buttons={1} />
            <div className="space-y-4 lg:space-y-6">
                {/* Campaign Statistics */}
                <Card >
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-5 w-20" />
                                <Skeleton className="h-8 w-16" />
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Info + Actions */}
                <div className="flex flex-col lg:flex-row h-full gap-4 lg:gap-6 items-stretch">
                    <Card className="flex-1">
                        <div className="space-y-4">
                            <Skeleton className="h-5 w-32 mb-2" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />

                            <Skeleton className="h-5 w-24 mt-4" />
                            <Skeleton className="h-6 w-20" />

                            <Skeleton className="h-5 w-24 mt-4" />
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-6 w-32" />

                            <Skeleton className="h-5 w-24 mt-4" />
                            <Skeleton className="h-6 w-40" />
                            <Skeleton className="h-6 w-24" />

                            <Skeleton className="h-5 w-24 mt-4" />
                            <Skeleton className="h-6 w-40" />
                        </div>
                    </Card>

                    <Card className="flex-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Skeleton key={i} className="h-10 w-full rounded-lg" />
                            ))}
                        </div>
                        <Skeleton className="h-8 w-32 mb-4" />
                        <Skeleton className="h-20 w-full rounded-lg" />
                    </Card>
                </div>

                {/* Campaign Images */}
                <Card >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Array.from({ length: 2 }).map((_, i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="aspect-video w-full rounded-lg" />
                                <Skeleton className="h-4 w-20 mx-auto" />
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}
