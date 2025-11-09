'use client';

import CenteredContainer from '@/components/shared/CenteredContainer';
import DashboardHeaderTitleSkeleton from '@/components/shared/Skelatons/DashboardHeaderTitleSkeleton';
import Skeleton from '@/components/shared/Skelatons/Skeleton';

export default function EditCampaignLoading() {
    return (
        <div>
            <DashboardHeaderTitleSkeleton buttons={2} />
            <CenteredContainer>
                <form className="space-y-6">
                    {/* Basic Information */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <Skeleton className="h-6 w-40 mb-6" />
                        <div className="space-y-4">
                            <Skeleton className="h-5 w-32 mb-2" />
                            <Skeleton className="h-12 w-full rounded-full" />

                            <Skeleton className="h-5 w-32 mb-2" />
                            <Skeleton className="h-12 w-full rounded-full" />

                            <Skeleton className="h-5 w-32 mb-2" />
                            <Skeleton className="h-24 w-full rounded-xl" />
                        </div>
                    </div>

                    {/* Campaign Images */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <Skeleton className="h-6 w-40 mb-6" />
                        <Skeleton className="h-40 w-full rounded-xl" />
                    </div>

                    {/* Run Settings */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <Skeleton className="h-6 w-40 mb-6" />
                        <Skeleton className="h-5 w-32 mb-2" />
                        <Skeleton className="h-12 w-full rounded-full" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <Skeleton className="h-5 w-32 mb-2" />
                            <Skeleton className="h-12 w-full rounded-full" />
                            <Skeleton className="h-5 w-32 mb-2" />
                            <Skeleton className="h-12 w-full rounded-full" />
                            <Skeleton className="h-5 w-32 mb-2" />
                            <Skeleton className="h-12 w-full rounded-full" />
                        </div>
                    </div>

                    {/* Target Settings */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <Skeleton className="h-6 w-40 mb-6" />
                        <Skeleton className="h-5 w-32 mb-2" />
                        <Skeleton className="h-12 w-full rounded-full" />
                        <Skeleton className="h-5 w-32 mb-2 mt-4" />
                        <Skeleton className="h-12 w-full rounded-full" />
                    </div>

                    {/* Submit Buttons */}
                    <div className="col-span-12 flex items-center gap-6 flex-wrap mt-4">
                        <Skeleton className="h-10 w-40 rounded-full" />
                        <Skeleton className="h-10 w-24 rounded-full" />
                    </div>
                </form>
            </CenteredContainer>
        </div>
    );
}
