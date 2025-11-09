import CenteredContainer from "@/components/shared/CenteredContainer";
import DashboardHeaderTitleSkeleton from "@/components/shared/Skelatons/DashboardHeaderTitleSkeleton";
import Skeleton from "@/components/shared/Skelatons/Skeleton";

export default function EditPropertySubmissionLoading() {
    return (
        <div>
            {/* Header Skeleton */}
            <DashboardHeaderTitleSkeleton buttons={2} />

            <CenteredContainer>
                <div className="space-y-6">
                    {/* Requester Info Section */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <Skeleton className="h-6 w-48 mb-6" />
                        <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-12 md:col-span-6">
                                <Skeleton className="h-5 w-32 mb-2" />
                                <Skeleton className="h-12 w-full rounded-md" />
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <Skeleton className="h-5 w-32 mb-2" />
                                <Skeleton className="h-12 w-full rounded-md" />
                            </div>
                        </div>
                    </div>

                    {/* Property Info Section */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <Skeleton className="h-6 w-48 mb-6" />
                        <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-12">
                                <Skeleton className="h-5 w-32 mb-2" />
                                <Skeleton className="h-12 w-full rounded-md" />
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <Skeleton className="h-5 w-32 mb-2" />
                                <Skeleton className="h-12 w-full rounded-md" />
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <Skeleton className="h-5 w-32 mb-2" />
                                <Skeleton className="h-12 w-full rounded-md" />
                            </div>
                            <div className="col-span-12">
                                <Skeleton className="h-5 w-32 mb-2" />
                                <Skeleton className="h-12 w-full rounded-md" />
                            </div>
                        </div>
                    </div>

                    {/* Specifications Section */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <Skeleton className="h-6 w-48 mb-6" />
                        <div className="space-y-4">
                            <Skeleton className="h-12 w-full rounded-md" />
                            <Skeleton className="h-12 w-full rounded-md" />
                            <Skeleton className="h-12 w-full rounded-md" />
                        </div>
                    </div>

                    {/* Authorization Document Section */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <Skeleton className="h-6 w-48 mb-6" />
                        <Skeleton className="h-12 w-full rounded-md" />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 mt-4">
                        <Skeleton className="h-10 w-40 rounded-full" />
                        <Skeleton className="h-10 w-24 rounded-full" />
                    </div>
                </div>
            </CenteredContainer>
        </div>
    );
}