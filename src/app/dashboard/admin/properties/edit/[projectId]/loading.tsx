'use client';

import CenteredContainer from "@/components/shared/CenteredContainer";
import DashboardHeaderTitleSkeleton from "@/components/shared/Skelatons/DashboardHeaderTitleSkeleton";
import Skeleton from "@/components/shared/Skelatons/Skeleton";


export default function EditPropertyLoading() {
    return (
        <div>
            {/* Header Skeleton */}
            <DashboardHeaderTitleSkeleton buttons={2} />

            {/* Form Skeleton */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mt-6 space-y-8">
                {/* Title + Description */}
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12">
                        <Skeleton className="h-5 w-40 mb-2" />
                        <Skeleton className="h-12 w-full rounded-full" />
                    </div>
                    <div className="col-span-12">
                        <Skeleton className="h-5 w-40 mb-2" />
                        <Skeleton className="h-24 w-full rounded-xl" />
                    </div>
                </div>

                {/* Price + Property Type + Access Type */}
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 md:col-span-4">
                        <Skeleton className="h-5 w-32 mb-2" />
                        <Skeleton className="h-12 w-full rounded-full" />
                    </div>
                    <div className="col-span-12 md:col-span-4">
                        <Skeleton className="h-5 w-32 mb-2" />
                        <Skeleton className="h-12 w-full rounded-full" />
                    </div>
                    <div className="col-span-12 md:col-span-4">
                        <Skeleton className="h-5 w-32 mb-2" />
                        <Skeleton className="h-12 w-full rounded-full" />
                    </div>
                </div>

                {/* Owner Info */}
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 md:col-span-4">
                        <Skeleton className="h-5 w-32 mb-2" />
                        <Skeleton className="h-12 w-full rounded-full" />
                    </div>
                    <div className="col-span-12 md:col-span-4">
                        <Skeleton className="h-5 w-32 mb-2" />
                        <Skeleton className="h-12 w-full rounded-full" />
                    </div>
                    <div className="col-span-12 md:col-span-4">
                        <Skeleton className="h-5 w-32 mb-2" />
                        <Skeleton className="h-12 w-full rounded-full" />
                    </div>
                </div>

                {/* Images / Media */}
                <div>
                    <Skeleton className="h-5 w-40 mb-4" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        <Skeleton className="h-32 w-full rounded-xl" />
                        <Skeleton className="h-32 w-full rounded-xl" />
                        <Skeleton className="h-32 w-full rounded-xl" />
                    </div>
                </div>

                {/* Map */}
                <div>
                    <Skeleton className="h-5 w-40 mb-4" />
                    <Skeleton className="h-[300px] w-full rounded-xl" />
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-6 flex-wrap mt-6">
                    <Skeleton className="h-10 w-40 rounded-full" />
                    <Skeleton className="h-10 w-24 rounded-full" />
                </div>
            </div>

        </div>
    );
}
