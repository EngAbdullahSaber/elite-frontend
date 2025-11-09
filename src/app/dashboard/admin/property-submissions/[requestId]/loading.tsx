import CardSkeleton from "@/components/shared/Skelatons/CardSkeleton";
import DashboardHeaderTitleSkeleton from "@/components/shared/Skelatons/DashboardHeaderTitleSkeleton";
import TextSkeleton from "@/components/shared/Skelatons/TextSkeleton";

export default function propertySubmissionDetailsLoading() {
  return (
    <>
      {/* رأس الصفحة */}
      <DashboardHeaderTitleSkeleton buttons={1} />

      {/* محتوى الصفحة */}
      <div className="grid grid-cols-1 2xl:grid-cols-6 gap-4 lg:gap-6 mt-6">
        {/* العمود الأيسر */}
        <div className="h-full 2xl:col-span-2 space-y-4 lg:space-y-6">
          <CardSkeleton height={160} title="تفاصيل الطلب" />
          <CardSkeleton height={220} title="تفاصيل العقار المطلوب" />
        </div>

        {/* العمود الأيمن */}
        <div className="h-full 2xl:col-span-4 flex flex-col gap-4 lg:gap-6">
          <div className="flex gap-4 lg:gap-6 items-start flex-col md:flex-row">
            {/* بطاقة العقار المنشور (إن وجد) */}
            <div className="flex-1 h-full w-full">
              <CardSkeleton title="العقار المنشور">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="h-20 w-full rounded-lg bg-gray-200 animate-pulse"
                    />
                  ))}
                </div>
              </CardSkeleton>
            </div>
          </div>

          {/* المواصفات */}
          <CardSkeleton title="المواصفات">
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="space-y-2">
                  <TextSkeleton width="40%" height={18} />
                  <TextSkeleton width="70%" height={20} />
                </div>
              ))}
            </div>
          </CardSkeleton>
        </div>
        <CardSkeleton title="مستندات الدفع" className="mt-6 2xl:col-span-6">
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="h-40 w-full rounded-lg bg-gray-200 animate-pulse"
              />
            ))}
          </div>
        </CardSkeleton>
      </div>
    </>
  );
}
