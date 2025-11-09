"use client";

import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import RequesterInfoSection from "./RequesterInfoSection";
import SpecificationsSection from "./SpecificationsSection";
import RequertPropertyInfoSection from "./RequertPropertyInfoSection";
import Uploader from "@/components/shared/Forms/Uploader";
import Card from "@/components/shared/Card";
import PrimaryButton from "@/components/shared/Button";
import SoftActionButton from "@/components/shared/SoftActionButton";
import { FileItem } from "@/utils/upload";
import { PropertyType } from "@/types/property";
import LocationInput from "@/components/shared/Forms/LocationInput";
import {
  createPropertySubmission,
  updatePropertySubmission,
  getPropertySubmission,
} from "@/services/propertySubmissions/propertySubmissions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export type PropertyRequestFormValues = {
  requesterName: string;
  relationshipType: "owner" | "authorized_representative";
  askedPrice: number;
  attachments: FileItem[];
  propertyType: PropertyType;
  location: { lat: number; lng: number };
  specifications: Record<string, { name: string; value: string | string[] }>;
  authorizationDoc?: FileItem;
};

type PropertyRequestFormProps = {
  defaultValues?: Partial<PropertyRequestFormValues>;
  requestId?: number;
  ownerId?: number;
};

// Map PropertyType to propertyTypeId
const propertyTypeToId: Record<PropertyType, number> = {
  apartment: 1,
  villa: 2,
  land: 3,
  office: 4,
};

// Map relationship types to API values
const relationshipTypeMap: Record<
  "owner" | "authorized_representative",
  string
> = {
  owner: "owner",
  authorized_representative: "authorized_representative",
};

// Reverse mapping for editing
const idToPropertyType: Record<number, PropertyType> = {
  1: "apartment",
  2: "villa",
  3: "land",
  4: "office",
};

const relationshipTypeReverseMap: Record<
  string,
  "owner" | "authorized_representative"
> = {
  owner: "owner",
  authorized: "authorized_representative",
};

export default function PropertyRequestForm({
  defaultValues,
  requestId,
  ownerId = 1,
}: PropertyRequestFormProps) {
  const isEdit = !!requestId;
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const router = useRouter();

  const { control, handleSubmit, watch, reset, setValue } =
    useForm<PropertyRequestFormValues>({
      defaultValues: {
        requesterName: "",
        relationshipType: "owner",
        attachments: [],
        propertyType: "apartment",
        askedPrice: 0,
        location: { lat: 21.2854, lng: 39.2376 },
        specifications: {},
        authorizationDoc: undefined,
        ...defaultValues,
      },
    });

  // Fetch property data when in edit mode
  useEffect(() => {
    if (!isEdit) return;

    const fetchPropertyData = async () => {
      try {
        setFetchLoading(true);
        const apiData = await getPropertySubmission(requestId);

        if (apiData) {
          // Transform API data to form values
          const formData = transformApiDataToFormValues(apiData);
          reset(formData);
        }
      } catch (error: any) {
        console.error("Error fetching property data:", error);
        setSubmitError("فشل في تحميل بيانات العقار");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchPropertyData();
  }, [isEdit, requestId, reset]);

  // Transform API data to form values
  const transformApiDataToFormValues = (
    apiData: any
  ): PropertyRequestFormValues => {
    // Parse location from string format "Lat: 21.2854, Lng: 39.2376"
    const parseLocation = (locationString: string) => {
      if (!locationString) return { lat: 21.2854, lng: 39.2376 }; // Default fallback

      try {
        const latMatch = locationString.match(/Lat:\s*([\d.-]+)/);
        const lngMatch = locationString.match(/Lng:\s*([\d.-]+)/);

        if (latMatch && lngMatch) {
          return {
            lat: parseFloat(latMatch[1]),
            lng: parseFloat(lngMatch[1]),
          };
        }
      } catch (error) {
        console.error("Error parsing location:", error);
      }

      return { lat: 21.2854, lng: 39.2376 }; // Default fallback
    };

    // Extract specifications from the dynamic object
    const extractSpecifications = (specs: any) => {
      const specifications: any = {
        bedrooms: {
          name: "عدد الغرف",
          value: "0",
        },
        bathrooms: {
          name: "عدد الحمامات",
          value: "0",
        },
        area: {
          name: "المساحة",
          value: "0",
        },
      };

      if (!specs) return specifications;

      // Handle numeric values
      if (specs.bedrooms !== undefined && specs.bedrooms !== null) {
        specifications.bedrooms.value = specs.bedrooms.toString();
      }
      if (specs.bathrooms !== undefined && specs.bathrooms !== null) {
        specifications.bathrooms.value = specs.bathrooms.toString();
      }

      // Handle area which might be under different keys
      if (specs.area !== undefined && specs.area !== null) {
        specifications.area.value = specs.area.toString();
      } else if (specs["المساحة"] !== undefined && specs["المساحة"] !== null) {
        specifications.area.value = specs["المساحة"].toString();
      }

      // Add any additional specifications as custom fields
      Object.entries(specs).forEach(([key, value]) => {
        if (!["bedrooms", "bathrooms", "area", "المساحة"].includes(key)) {
          specifications[key] = {
            name: key,
            value: value?.toString() || "",
          };
        }
      });

      return specifications;
    };

    // Map relationship type
    const relationshipTypeMap: Record<string, string> = {
      owner: "owner",
      authorized_representative: "authorized_representative",
    };

    // Map property type ID to string value
    const idToPropertyType: Record<number, string> = {
      1: "apartment", // شقة
      2: "villa", // فيلا
      3: "land", // أرض
      4: "office", // مكتب
      // Add more mappings as needed
    };

    return {
      requesterName: apiData.owner?.fullName || "",
      relationshipType:
        relationshipTypeMap[apiData.relationshipType] || "owner",
      askedPrice: parseFloat(apiData.askingPrice) || 0,
      propertyType: idToPropertyType[apiData.propertyType?.id] || "apartment",
      location: parseLocation(apiData.location),
      specifications: extractSpecifications(apiData.specifications),
      attachments:
        apiData.attachments?.map((attachment: any) => ({
          url: attachment.url || attachment.attachmentUrl,
          name: attachment.name || `مرفق_${attachment.id}`,
          type: attachment.type || "application/octet-stream",
        })) || [],
      authorizationDoc: apiData.authorizationDocUrl
        ? {
            url: apiData.authorizationDocUrl,
            name: "وثيقة_التفويض",
            type: "application/pdf",
          }
        : undefined,
    };
  };

  const onSubmit = async (data: PropertyRequestFormValues) => {
    setLoading(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      // Extract specifications from the form data
      const specifications: Record<string, any> = {};

      // Get bedrooms and bathrooms from specifications
      if (data.specifications.bedrooms) {
        specifications.bedrooms =
          parseInt(data.specifications.bedrooms.value as string) || 0;
      }
      if (data.specifications.bathrooms) {
        specifications.bathrooms =
          parseInt(data.specifications.bathrooms.value as string) || 0;
      }
      if (data.specifications.area) {
        specifications.area =
          parseInt(data.specifications.area.value as string) || 0;
      }

      // Add other specifications if needed
      Object.keys(data.specifications).forEach((key) => {
        if (key !== "bedrooms" && key !== "bathrooms" && key !== "area") {
          specifications[key] = data.specifications[key].value;
        }
      });

      // Convert location object to string
      const locationString = `Lat: ${data.location.lat}, Lng: ${data.location.lng}`;

      // Prepare attachments array
      const attachments = data.attachments
        .map((file) => ({
          attachmentUrl: file.url || file.previewUrl || "",
        }))
        .filter((attachment) => attachment.attachmentUrl);

      // Prepare authorization document URL
      const authorizationDocUrl =
        data.authorizationDoc?.url ||
        data.authorizationDoc?.previewUrl ||
        undefined;

      const submissionData = {
        location: locationString,
        specifications: specifications,
        askingPrice: data.askedPrice.toString(),
        authorizationDocUrl: authorizationDocUrl,
      };

      console.log(
        `${isEdit ? "🔄 Updating" : "🆕 Creating"} property submission:`,
        submissionData
      );

      let result;
      if (isEdit && requestId) {
        result = await updatePropertySubmission(requestId, submissionData);
        console.log("✅ Property submission updated successfully:", result);

        // Show success toast for update
        toast.success("تم تحديث طلب العقار بنجاح", {
          duration: 4000,
          position: "top-center",
          icon: "✅",
          style: {
            background: "#10B981",
            color: "#fff",
            borderRadius: "8px",
            fontSize: "14px",
          },
        });

        // Redirect back to the property submission details page after 2 seconds
        setTimeout(() => {
          router.back();
        }, 2000);
      } else {
        const CreatesubmissionData = {
          location: locationString,
          ownerId: ownerId,
          relationshipType: relationshipTypeMap[data.relationshipType],
          propertyTypeId: propertyTypeToId[data.propertyType],
          specifications: specifications,
          askingPrice: data.askedPrice.toString(),
          authorizationDocUrl: authorizationDocUrl,
        };
        result = await createPropertySubmission(CreatesubmissionData);
        console.log("✅ Property submission created successfully:", result);

        // Show success toast for create
        toast.success("تم إنشاء طلب العقار بنجاح", {
          duration: 4000,
          position: "top-center",
          icon: "🎉",
          style: {
            background: "#10B981",
            color: "#fff",
            borderRadius: "8px",
            fontSize: "14px",
          },
        });

        // Redirect to property submissions list after 2 seconds
        setTimeout(() => {
          router.back();
        }, 2000);
      }

      setSubmitSuccess(true);
    } catch (error: any) {
      console.error(
        `❌ Failed to ${isEdit ? "update" : "create"} property submission:`,
        error
      );

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        `حدث خطأ أثناء ${isEdit ? "تحديث" : "إنشاء"} طلب العقار`;

      setSubmitError(errorMessage);

      // Show error toast
      toast.error(errorMessage, {
        duration: 5000,
        position: "top-center",
        icon: "❌",
        style: {
          background: "#EF4444",
          color: "#fff",
          borderRadius: "8px",
          fontSize: "14px",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  // Get current values for debugging or display
  const currentValues = watch();

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-gray-600">جاري تحميل بيانات العقار...</div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Success/Error Messages */}
      {submitSuccess && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          ✅ تم {isEdit ? "تحديث" : "إنشاء"} طلب العقار بنجاح
        </div>
      )}

      {submitError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          ❌ {submitError}
        </div>
      )}

      <RequesterInfoSection control={control} />
      <RequertPropertyInfoSection control={control} />

      <Card title="موقع العقار">
        <LocationInput control={control} name="location" />
        <div className="mt-2 text-sm text-gray-500">
          الإحداثيات الحالية: {currentValues.location.lat.toFixed(4)},{" "}
          {currentValues.location.lng.toFixed(4)}
        </div>
      </Card>

      <SpecificationsSection control={control} />

      <Card title="المرفقات">
        <Uploader
          control={control}
          name="attachments"
          accept="image/*,.pdf,.doc,.docx"
          label="مرفقات العقار"
          allowMultiple={true}
          allowPrimary={true}
          rules={["الحد الأقصى لحجم الملف 9MB", "الصور، PDF، مستندات Word"]}
        />
        <div className="mt-2 text-sm text-gray-500">
          عدد المرفقات: {currentValues.attachments.length}
        </div>
      </Card>

      <Card title="وثيقة التفويض (إن وجدت)">
        <Uploader
          control={control}
          name="authorizationDoc"
          accept=".pdf,.doc,.docx,image/*"
          label="وثيقة التفويض"
          allowMultiple={false}
          allowPrimary={false}
          rules={["الحد الأقصى لحجم الملف 9MB", "PDF، مستندات Word، صور"]}
        />
      </Card>

      {/* Debug information (remove in production) */}
      {process.env.NODE_ENV === "development" && (
        <Card title="بيانات الإرسال (للتطوير)">
          <div className="text-xs bg-gray-50 p-3 rounded">
            <pre>
              {JSON.stringify(
                {
                  mode: isEdit ? "edit" : "create",
                  ownerId,
                  relationshipType:
                    relationshipTypeMap[currentValues.relationshipType],
                  propertyTypeId: propertyTypeToId[currentValues.propertyType],
                  location: `Lat: ${currentValues.location.lat}, Lng: ${currentValues.location.lng}`,
                  specifications: currentValues.specifications,
                  askingPrice: currentValues.askedPrice,
                  attachmentsCount: currentValues.attachments.length,
                  hasAuthorizationDoc: !!currentValues.authorizationDoc,
                },
                null,
                2
              )}
            </pre>
          </div>
        </Card>
      )}

      <div className="space-x-4 flex items-center justify-start">
        <PrimaryButton
          type="submit"
          disabled={loading || fetchLoading}
          className={
            loading || fetchLoading ? "opacity-50 cursor-not-allowed" : ""
          }
        >
          {loading ? "جاري الإرسال..." : isEdit ? "تحديث الطلب" : "إرسال الطلب"}
        </PrimaryButton>
        <SoftActionButton onClick={() => {}} disabled={loading || fetchLoading}>
          إلغاء
        </SoftActionButton>
      </div>
    </form>
  );
}
