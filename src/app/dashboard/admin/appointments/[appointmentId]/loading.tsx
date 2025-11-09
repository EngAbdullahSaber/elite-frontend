import AvatarSkeleton from "@/components/shared/Skelatons/AvatarSkeleton";
import CardSkeleton from "@/components/shared/Skelatons/CardSkeleton";
import DashboardHeaderTitleSkeleton from "@/components/shared/Skelatons/DashboardHeaderTitleSkeleton";
import TextSkeleton from "@/components/shared/Skelatons/TextSkeleton";


export default function AppointmentDetailsLoading() {
    return (
        <>
            {/* رأس الصفحة */}
            <DashboardHeaderTitleSkeleton buttons={2} />

            {/* محتوى الصفحة */}
            <div className="grid grid-cols-1 2xl:grid-cols-6 gap-4 lg:gap-6 mt-6">
                {/* العمود الأيسر */}
                <div className="h-full 2xl:col-span-2 space-y-4 lg:space-y-6">
                    <CardSkeleton height={160} title="تفاصيل العقار" />
                    <CardSkeleton height={320} title="تفاصيل الحجز" />
                </div>

                {/* العمود الأيمن */}
                <div className="h-full 2xl:col-span-4 flex flex-col gap-4 lg:gap-6">
                    <div className="flex gap-4 lg:gap-6 items-start flex-col md:flex-row">
                        {/* بطاقة الوسيط */}
                        <div className="flex-1 w-full h-full flex flex-col">
                            <CardSkeleton title="الوسيط">
                                <div className="p-6 flex flex-col items-center gap-4">
                                    <AvatarSkeleton size={80} />
                                    <TextSkeleton width="60%" height={24} />
                                    <div className="mt-6 w-full flex flex-col md:flex-row gap-4">
                                        <TextSkeleton width="100%" height={20} />
                                        <TextSkeleton width="100%" height={20} />
                                    </div>
                                </div>
                            </CardSkeleton>
                        </div>

                        {/* بطاقة العميل */}
                        <div className="flex-1 h-full w-full">
                            <CardSkeleton title="العميل">
                                <div className="p-6 flex flex-col items-center gap-4">
                                    <AvatarSkeleton size={80} />
                                    <TextSkeleton width="60%" height={24} />
                                    <div className="mt-6 w-full space-y-4">
                                        <TextSkeleton width="100%" height={20} />
                                        <TextSkeleton width="100%" height={20} />
                                    </div>
                                </div>
                            </CardSkeleton>
                        </div>
                    </div>

                    {/* بطاقة الملاحظات */}
                    <CardSkeleton height={200} title="الملاحظات" />
                </div>
            </div>
            <CardSkeleton title="مستندات الدفع" className="mt-6">
                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                    {Array.from({ length: 4 }).map((_, idx) => (
                        <div
                            key={idx}
                            className="h-40 w-full rounded-lg bg-gray-200 animate-pulse"
                        />
                    ))}
                </div>
            </CardSkeleton>
        </>
    );
}
