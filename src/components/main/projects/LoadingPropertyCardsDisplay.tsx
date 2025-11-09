'use client';

import { useSearchParams } from 'next/navigation';
import Skeleton from '@/components/shared/Skelatons/Skeleton';

export default function LoadingPropertyCardsDisplay() {
    const searchParams = useSearchParams();
    const view = searchParams.get('view') || 'grid';

    return (
        <div className="grid grid-cols-12 gap-4 xl:gap-6">
            {[...Array(6)].map((_, i) => (
                <div
                    key={i}
                    className={
                        view === 'list'
                            ? 'col-span-12 xl:col-span-6'
                            : 'col-span-12 xs:col-span-6 xl:col-span-4'
                    }
                >
                    {view === 'list' ? (
                        // List-style skeleton
                        <div className="bg-white grid grid-cols-12 rounded-xl shadow-lg overflow-hidden border border-gray-100 animate-pulse p-2">
                            {/* Image */}
                            <div className="col-span-12 xs:col-span-5 relative h-[200px] sm:h-[220px] bg-gray-200 rounded-xl" />

                            {/* Content */}
                            <div className="col-span-12 xs:col-span-7 flex flex-col justify-between px-4 py-3 gap-2">
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-5 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                                <div className="border-t border-dashed my-3" />
                                <Skeleton className="h-6 w-1/4" />
                            </div>
                        </div>
                    ) : (
                        // Grid-style skeleton
                        <div className="w-full max-[520px]:w-full min-[520px]:max-w-[480px] mx-auto bg-white shadow-lg rounded-xl overflow-hidden flex flex-col border border-gray-100 animate-pulse">
                            {/* Image */}
                            <div className="relative h-[200px] sm:h-[240px] md:h-[260px] bg-gray-200" />

                            {/* Content */}
                            <div className="p-4 sm:p-5 flex flex-col gap-3">
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-5 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                                <div className="border-t border-dashed my-3" />
                                <Skeleton className="h-6 w-1/4" />
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
