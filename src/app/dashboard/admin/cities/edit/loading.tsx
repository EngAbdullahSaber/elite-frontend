'use client';

import CenteredContainer from "@/components/shared/CenteredContainer";
import DashboardHeaderTitleSkeleton from "@/components/shared/Skelatons/DashboardHeaderTitleSkeleton";
import Skeleton from "@/components/shared/Skelatons/Skeleton";

export default function EditCityLoading() {
    return (
        <div>
            {/* Header Skeleton */}
            <DashboardHeaderTitleSkeleton buttons={1} />

            <CenteredContainer>
                {/* Form Skeleton */}
                <div className="bg-white rounded-2xl shadow-sm p-6 mt-6 space-y-6">
                    {/* City Name */}
                    <div>
                        <Skeleton className="h-5 w-32 mb-2" />
                        <Skeleton className="h-12 w-full rounded-full" />
                    </div>

                    {/* Regions Select */}
                    <div>
                        <Skeleton className="h-5 w-32 mb-2" />
                        <Skeleton className="h-12 w-full rounded-full" />
                    </div>

                    {/* Added Regions List */}
                    <div>
                        <Skeleton className="h-5 w-40 mb-2" />
                        <div className="flex flex-wrap gap-2">
                            <Skeleton className="h-8 w-24 rounded-full" />
                            <Skeleton className="h-8 w-20 rounded-full" />
                            <Skeleton className="h-8 w-28 rounded-full" />
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex gap-4 mt-6">
                        <Skeleton className="h-10 w-40 rounded-full" />
                        <Skeleton className="h-10 w-24 rounded-full" />
                    </div>
                </div>
            </CenteredContainer>
        </div>
    );
}
