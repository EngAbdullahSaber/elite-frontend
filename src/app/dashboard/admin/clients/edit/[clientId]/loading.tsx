'use client';

import CenteredContainer from "@/components/shared/CenteredContainer";
import DashboardHeaderTitleSkeleton from "@/components/shared/Skelatons/DashboardHeaderTitleSkeleton";
import Skeleton from "@/components/shared/Skelatons/Skeleton";

export default function EditClientLoading() {
    return (
        <div>
            {/* Header Skeleton */}
            <DashboardHeaderTitleSkeleton buttons={2} />
            <CenteredContainer>
                {/* Form Skeleton */}
                <div className="bg-white rounded-2xl shadow-sm p-6 mt-6">
                    <div className="relative mx-auto mb-6 w-[180px] h-[180px] animate-pulse">
                        {/* Avatar Skeleton */}
                        <div
                            className="rounded-full bg-gray-300"
                            style={{ width: '180px', height: '180px', background: '#e5e7eb' }}
                        />

                        {/* Edit Icon Placeholder */}
                        <div className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-md">
                            <div className="w-5 h-5 bg-gray-400 rounded" />
                        </div>
                    </div>


                    {/* Form Fields */}
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12">
                            <Skeleton className="h-5 w-32 mb-2" />
                            <Skeleton className="h-12 w-full rounded-full" />
                        </div>

                        <div className="col-span-12">
                            <Skeleton className="h-5 w-32 mb-2" />
                            <Skeleton className="h-12 w-full rounded-full" />
                        </div>

                        <div className="col-span-12">
                            <Skeleton className="h-5 w-32 mb-2" />
                            <Skeleton className="h-12 w-full rounded-full" />
                        </div>

                        {/* Status Dropdown */}
                        <div className="col-span-12">
                            <Skeleton className="h-5 w-32 mb-2" />
                            <Skeleton className="h-12 w-full rounded-full" />
                        </div>

                        {/* Buttons */}
                        <div className="col-span-12 flex items-center gap-6 flex-wrap mt-4">
                            <Skeleton className="h-10 w-40 rounded-full" />
                            <Skeleton className="h-10 w-24 rounded-full" />
                        </div>
                    </div>
                </div>
            </CenteredContainer>
        </div>
    );
}
