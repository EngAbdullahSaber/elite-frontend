"use client";

import DashboardHeaderTitle from "@/components/dashboard/DashboardHeaderTitle";
import PrimaryButton from "@/components/shared/Button";
import Card from "@/components/shared/Card";
import CenteredContainer from "@/components/shared/CenteredContainer";
import { LocationInputType } from "@/components/shared/Forms/LocationInput";
import SoftActionButton from "@/components/shared/SoftActionButton";
import { useSiteSettings } from "@/hooks/dashboard/admin/settings/useSiteSettings";
import { updateSiteSettings } from "@/services/settings/siteSettings";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const LocationInput = dynamic(
  () => import("@/components/shared/Forms/LocationInput"),
  {
    ssr: false,
    loading: () => (
      <div className="text-center py-10 text-gray-500 animate-pulse">
        جاري تحميل الخريطة...
      </div>
    ),
  }
) as unknown as LocationInputType;

export type PropertyFormValues = {
  position: {
    lat: number;
    lng: number;
  };
};

export default function IntroLocationPage() {
  const { settings, loading, error, refetch } = useSiteSettings();

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting },
  } = useForm<PropertyFormValues>({
    defaultValues: {
      position: { lat: 21.2854, lng: 39.2376 }, // Default to Makkah coordinates
    },
  });

  // Set form values when settings are loaded
  useEffect(() => {
    if (settings) {
      const lat = parseFloat(settings.latitude) || 21.2854;
      const lng = parseFloat(settings.longitude) || 39.2376;

      setValue("position", { lat, lng });
    }
  }, [settings, setValue]);

  const onSubmit = async (data: PropertyFormValues) => {
    try {
      // Convert numbers to strings with proper precision for API
      const latitude = data.position.lat.toFixed(8);
      const longitude = data.position.lng.toFixed(8);

      const toastId = toast.loading("جاري حفظ الموقع...");

      // Use updateSiteSettings to update the location
      await updateSiteSettings({
        latitude,
        longitude,
      });

      toast.success("تم حفظ الموقع بنجاح", { id: toastId });

      // Refresh the data to get updated settings
      await refetch();
    } catch (error) {
      console.error("Error saving location:", error);
      toast.error("فشل في حفظ الموقع. يرجى المحاولة مرة أخرى.");
    }
  };

  const handleCancel = () => {
    // Reset to current settings
    if (settings) {
      const lat = parseFloat(settings.latitude) || 21.2854;
      const lng = parseFloat(settings.longitude) || 39.2376;
      reset({ position: { lat, lng } });
    } else {
      reset({ position: { lat: 21.2854, lng: 39.2376 } });
    }
    toast.success("تم إلغاء التغييرات");
  };

  if (loading) {
    return (
      <div>
        <DashboardHeaderTitle path={["الموقع"]} />
        <CenteredContainer>
          <Card title="">
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">جاري تحميل بيانات الموقع...</p>
            </div>
          </Card>
        </CenteredContainer>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <DashboardHeaderTitle path={["الموقع"]} />
        <CenteredContainer>
          <Card title="">
            <div className="text-center py-10 text-red-600">
              <p>خطأ في تحميل بيانات الموقع: {error}</p>
              <PrimaryButton onClick={() => refetch()} className="mt-4">
                إعادة المحاولة
              </PrimaryButton>
            </div>
          </Card>
        </CenteredContainer>
      </div>
    );
  }

  return (
    <div>
      <DashboardHeaderTitle path={["الموقع"]} />

      <CenteredContainer className="space-y-6">
        <Card title="موقع الشركة على الخريطة">
          {/* Current Location Info */}
          {settings && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">
                الموقع الحالي:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">خط العرض:</span>{" "}
                  {settings.latitude}
                </div>
                <div>
                  <span className="font-medium">خط الطول:</span>{" "}
                  {settings.longitude}
                </div>
                {settings.updatedBy && (
                  <div className="md:col-span-2">
                    <span className="font-medium">آخر تحديث بواسطة:</span>{" "}
                    {settings.updatedBy.fullName}
                  </div>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">تعليمات:</h4>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>اسحب المؤشر على الخريطة لتحديد موقع الشركة الجديد</li>
                <li>يمكنك أيضًا النقر على أي مكان في الخريطة لتحديد الموقع</li>
                <li>سيتم حفظ الإحداثيات تلقائيًا عند النقر على حفظ</li>
              </ul>
            </div>

            <LocationInput<PropertyFormValues>
              control={control}
              name="position"
            />

            <div className="space-x-4 flex items-center justify-start pt-4">
              <PrimaryButton
                type="submit"
                className="min-w-32"
                disabled={isSubmitting}
              >
                {isSubmitting ? "جاري الحفظ..." : "حفظ الموقع"}
              </PrimaryButton>
              <SoftActionButton
                type="button"
                onClick={handleCancel}
                className="min-w-32"
                disabled={isSubmitting}
              >
                إلغاء
              </SoftActionButton>
            </div>
          </form>
        </Card>

        {/* Additional Information Card */}
        <Card title="معلومات إضافية">
          <div className="space-y-4 text-sm text-gray-600">
            <p>
              <strong>مهم:</strong> سيتم استخدام هذا الموقع في:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>عرض موقع الشركة على خرائط جوجل</li>
              <li>تحديد الموقع في تطبيقات الجوال</li>
              <li>عرض الموقع في صفحة الاتصال بنا</li>
              <li>تحسين محركات البحث (SEO) للموقع الجغرافي</li>
            </ul>
            <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
              <p className="text-yellow-800 text-xs">
                ⚠️ تأكد من دقة الموقع المحدد لضمان أفضل تجربة للمستخدمين
              </p>
            </div>
          </div>
        </Card>
      </CenteredContainer>
    </div>
  );
}
