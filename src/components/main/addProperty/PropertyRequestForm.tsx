"use client";

import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import RequesterInfoSection from "./RequesterInfoSection";
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
import { ImageBaseUrl } from "@/libs/app.config";
import { FiPlus, FiTrash2, FiMapPin, FiInfo, FiFileText } from "react-icons/fi";

export type PropertyRequestFormValues = {
  requesterName: string;
  relationshipType: "owner" | "authorized_representative";
  askedPrice: number;
  attachments: FileItem[];
  propertyType: PropertyType;
  location: { lat: number; lng: number };
  specifications: Record<string, { name: string; value: string | string[] }>;
  authorizationDoc?: FileItem;
  ownershipDoc?: FileItem;
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
  home: 4,
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
  4: "home",
  5: "office",
};

const relationshipTypeReverseMap: Record<
  string,
  "owner" | "authorized_representative"
> = {
  owner: "owner",
  authorized_representative: "authorized_representative",
};

// Default specifications for new property requests
const DEFAULT_SPECIFICATIONS: Record<
  string,
  { name: string; value: string | string[] }
> = {
  bedrooms: { name: "عدد غرف النوم", value: "" },
  bathrooms: { name: "عدد الحمامات", value: "" },
  area: { name: "المساحة (م²)", value: "" },
  floors: { name: "عدد الطوابق", value: "" },
  year_built: { name: "سنة البناء", value: "" },
  finishing: { name: "نوع التشطيب", value: "" },
  direction: { name: "الاتجاه", value: "" },
  street_view: { name: "إطلالة على الشارع", value: "" },
  parking: { name: "مواقف السيارات", value: "" },
  car_entrance: { name: "مدخل سيارة", value: "" },
  pool: { name: "مسبح", value: "" },
  garden: { name: "حديقة", value: "" },
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
        specifications: DEFAULT_SPECIFICATIONS,
        authorizationDoc: undefined,
        ownershipDoc: undefined,
        ...defaultValues,
      },
    });

  // Watch specifications to handle dynamic updates
  const specifications = watch("specifications");

  // Initialize default data only for new properties
  useEffect(() => {
    if (!isEdit && !defaultValues) {
      setValue("specifications", DEFAULT_SPECIFICATIONS);
    }
  }, [isEdit, defaultValues, setValue]);

  // Function to add new specification item
  const addSpecificationItem = () => {
    const newKey = `spec_${Date.now()}`;
    const newSpecifications = { ...specifications };
    newSpecifications[newKey] = { name: "", value: "" };
    setValue("specifications", newSpecifications);
  };

  // Function to remove specification item
  const removeSpecificationItem = (key: string) => {
    const newSpecifications = { ...specifications };
    delete newSpecifications[key];
    setValue("specifications", newSpecifications);
  };

  // Function to update specification item
  const updateSpecificationItem = (
    key: string,
    field: "name" | "value",
    newValue: string
  ) => {
    const newSpecifications = { ...specifications };
    if (newSpecifications[key]) {
      newSpecifications[key] = {
        ...newSpecifications[key],
        [field]: newValue,
      };
      setValue("specifications", newSpecifications);
    }
  };

  // Fetch property data when in edit mode
  useEffect(() => {
    if (!isEdit) return;

    const fetchPropertyData = async () => {
      try {
        setFetchLoading(true);
        const apiData = await getPropertySubmission(requestId);

        if (apiData) {
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
    const parseLocation = (locationString: string) => {
      if (!locationString) return { lat: 21.2854, lng: 39.2376 };

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

      return { lat: 21.2854, lng: 39.2376 };
    };

    const extractSpecifications = (specs: any) => {
      const specifications: any = {};

      if (!specs) return specifications;

      if (specs.bedrooms !== undefined && specs.bedrooms !== null) {
        specifications.bedrooms = {
          name: "عدد غرف النوم",
          value: specs.bedrooms.toString(),
        };
      }
      if (specs.bathrooms !== undefined && specs.bathrooms !== null) {
        specifications.bathrooms = {
          name: "عدد الحمامات",
          value: specs.bathrooms.toString(),
        };
      }

      if (specs.area !== undefined && specs.area !== null) {
        specifications.area = {
          name: "المساحة (م²)",
          value: specs.area.toString(),
        };
      } else if (specs["المساحة"] !== undefined && specs["المساحة"] !== null) {
        specifications.area = {
          name: "المساحة (م²)",
          value: specs["المساحة"].toString(),
        };
      }

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

    return {
      requesterName: apiData.owner?.fullName || "",
      relationshipType:
        relationshipTypeReverseMap[apiData.relationshipType] || "owner",
      askedPrice: parseFloat(apiData.askingPrice) || 0,
      propertyType: idToPropertyType[apiData.propertyType?.id] || "apartment",
      location: parseLocation(apiData.location),
      specifications: extractSpecifications(apiData.specifications),
      attachments:
        apiData.attachments?.map((attachment: any) => ({
          url:
            ImageBaseUrl + attachment.url ||
            ImageBaseUrl + attachment.attachmentUrl,
          name: attachment.name || `مرفق_${attachment.id}`,
          type: attachment.type || "application/octet-stream",
          file: attachment.file,
        })) || [],
      authorizationDoc: apiData.authorizationDocUrl
        ? {
            url: ImageBaseUrl + apiData.authorizationDocUrl,
            name: "وثيقة_التفويض",
            type: "application/pdf",
          }
        : undefined,
      ownershipDoc: apiData.ownershipDocUrl
        ? {
            url: ImageBaseUrl + apiData.ownershipDocUrl,
            name: "وثيقة_الملكية",
            type: "application/pdf",
          }
        : undefined,
    };
  };

  // Helper function to convert FileItem to File object
  const getFileFromFileItem = async (fileItem: FileItem): Promise<File> => {
    if (fileItem.file) {
      return fileItem.file;
    }

    if (fileItem.url) {
      try {
        const response = await fetch(fileItem.url);
        const blob = await response.blob();
        return new File([blob], fileItem.name || "file", {
          type: fileItem.type,
        });
      } catch (error) {
        console.error("Error converting URL to File:", error);
        throw new Error(`Failed to convert ${fileItem.name} to File object`);
      }
    }

    throw new Error("No file or URL available in FileItem");
  };

  const onSubmit = async (data: PropertyRequestFormValues) => {
    setLoading(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const specifications: Record<string, any> = {};

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

      Object.keys(data.specifications).forEach((key) => {
        if (key !== "bedrooms" && key !== "bathrooms" && key !== "area") {
          specifications[key] = data.specifications[key].value;
        }
      });

      const locationString = `Lat: ${data.location.lat}, Lng: ${data.location.lng}`;
      const formData = new FormData();

      formData.append(
        "relationshipType",
        relationshipTypeMap[data.relationshipType]
      );
      formData.append(
        "propertyTypeId",
        propertyTypeToId[data.propertyType].toString()
      );
      formData.append("location", locationString);
      formData.append("specifications", JSON.stringify(specifications));
      formData.append("askingPrice", data.askedPrice.toString());

      if (!isEdit && ownerId) {
        formData.append("ownerId", ownerId.toString());
      }

      for (const attachment of data.attachments) {
        try {
          const file = await getFileFromFileItem(attachment);
          formData.append("attachments", file);
        } catch (error) {
          console.warn("Skipping attachment due to error:", error);
        }
      }

      if (data.authorizationDoc) {
        try {
          const authFile = await getFileFromFileItem(data.authorizationDoc);
          formData.append("authorizationDoc", authFile);
        } catch (error) {
          console.warn("Skipping authorization document due to error:", error);
        }
      }

      if (data.ownershipDoc) {
        try {
          const ownershipFile = await getFileFromFileItem(data.ownershipDoc);
          formData.append("ownershipDoc", ownershipFile);
        } catch (error) {
          console.warn("Skipping ownership document due to error:", error);
        }
      }

      let result;
      if (isEdit && requestId) {
        result = await updatePropertySubmission(requestId, formData);
        toast.success("تم تحديث طلب العقار بنجاح", {
          duration: 4000,
          position: "top-center",
          icon: "✅",
        });
        setTimeout(() => {
          router.back();
        }, 2000);
      } else {
        result = await createPropertySubmission(formData);
        toast.success("تم إنشاء طلب العقار بنجاح", {
          duration: 4000,
          position: "top-center",
          icon: "🎉",
        });
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

      toast.error(errorMessage, {
        duration: 5000,
        position: "top-center",
        icon: "❌",
      });
    } finally {
      setLoading(false);
    }
  };

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <FiFileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? "تعديل طلب عقار" : "طلب عقار جديد"}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEdit
                ? "قم بتحديث معلومات العقار المطلوب"
                : "املأ المعلومات التالية لتقديم طلب عقار جديد"}
            </p>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {submitSuccess && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 flex items-center gap-3">
          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-green-600 text-sm">✓</span>
          </div>
          <div>
            <p className="font-medium">
              ✅ تم {isEdit ? "تحديث" : "إنشاء"} طلب العقار بنجاح
            </p>
            <p className="text-sm text-green-600 mt-1">
              سيتم تحويلك تلقائياً...
            </p>
          </div>
        </div>
      )}

      {submitError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3">
          <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-red-600 text-sm">!</span>
          </div>
          <div>
            <p className="font-medium">❌ خطأ في الإرسال</p>
            <p className="text-sm text-red-600 mt-1">{submitError}</p>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Basic Information */}
        <div className="lg:col-span-2 space-y-8">
          <RequesterInfoSection control={control} />
          <RequertPropertyInfoSection control={control} />

          {/* Location Section */}
          <Card title="موقع العقار" className="relative">
            <div className="flex items-center gap-2 mb-4">
              <FiMapPin className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-800">
                الموقع الجغرافي
              </h3>
            </div>
            <LocationInput control={control} name="location" />
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700 flex items-center gap-2">
                <FiInfo className="w-4 h-4" />
                الإحداثيات الحالية: {currentValues.location.lat.toFixed(
                  4
                )}, {currentValues.location.lng.toFixed(4)}
              </p>
            </div>
          </Card>

          {/* Specifications Section */}
          <Card title="مواصفات العقار" className="relative">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FiInfo className="w-4 h-4 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  المواصفات
                </h3>
              </div>
              <button
                type="button"
                onClick={addSpecificationItem}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition flex items-center gap-2"
              >
                <FiPlus className="w-4 h-4" />
                إضافة مواصفة
              </button>
            </div>

            <div className="space-y-4">
              {Object.entries(specifications).map(([key, spec]) => (
                <div
                  key={key}
                  className="flex gap-3 items-center group p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        اسم المواصفة
                      </label>
                      <input
                        type="text"
                        placeholder="أدخل اسم المواصفة"
                        value={spec.name}
                        onChange={(e) =>
                          updateSpecificationItem(key, "name", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        القيمة
                      </label>
                      <input
                        type="text"
                        placeholder="أدخل القيمة"
                        value={spec.value as string}
                        onChange={(e) =>
                          updateSpecificationItem(key, "value", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSpecificationItem(key)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition opacity-0 group-hover:opacity-100"
                    title="حذف المواصفة"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 text-center">
                عدد المواصفات:{" "}
                <span className="font-semibold text-gray-800">
                  {Object.keys(specifications).length}
                </span>
              </p>
            </div>
          </Card>
        </div>

        {/* Right Column - Documents and Actions */}
        <div className="space-y-8">
          {/* Attachments Section */}
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
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                عدد المرفقات:{" "}
                <span className="font-semibold">
                  {currentValues.attachments.length}
                </span>
              </p>
            </div>
          </Card>

          {/* Authorization Document */}
          <Card title="وثيقة التفويض">
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                أرفق وثيقة التفويض إذا كنت مفوضاً
              </p>
              <Uploader
                control={control}
                name="authorizationDoc"
                accept=".pdf,.doc,.docx,image/*"
                label="رفع وثيقة التفويض"
                allowMultiple={false}
                allowPrimary={false}
                rules={["الحد الأقصى لحجم الملف 9MB", "PDF، مستندات Word، صور"]}
              />
            </div>
          </Card>

          {/* Ownership Document */}
          <Card title="وثيقة الملكية">
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                أرفق وثيقة الملكية لإثبات ملكية العقار
              </p>
              <Uploader
                control={control}
                name="ownershipDoc"
                accept=".pdf,.doc,.docx,image/*"
                label="رفع وثيقة الملكية"
                allowMultiple={false}
                allowPrimary={false}
                rules={["الحد الأقصى لحجم الملف 9MB", "PDF، مستندات Word، صور"]}
              />
            </div>
          </Card>

          {/* Submit Section */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <FiFileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {isEdit ? "تحديث الطلب" : "تقديم الطلب"}
                </h3>
                <p className="text-sm text-gray-600">
                  {isEdit
                    ? "سيتم تحديث طلب العقار بعد الضغط على الزر"
                    : "سيتم إنشاء طلب عقار جديد بعد الضغط على الزر"}
                </p>
              </div>
              <div className="space-y-3">
                <PrimaryButton
                  type="submit"
                  disabled={loading || fetchLoading}
                  loading={loading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700"
                >
                  {loading
                    ? "جاري الإرسال..."
                    : isEdit
                    ? "تحديث الطلب"
                    : "تقديم الطلب"}
                </PrimaryButton>
                <SoftActionButton
                  onClick={() => router.back()}
                  disabled={loading || fetchLoading}
                  className="w-full py-3"
                >
                  إلغاء والعودة
                </SoftActionButton>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </form>
  );
}
