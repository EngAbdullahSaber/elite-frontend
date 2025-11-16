"use client";

import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import GeneralInfoSection from "./FormSections/GeneralInfoSection";
import { AccessType, PropertyType } from "@/types/property";
import OwnerContactSection from "./FormSections/OwnerContactSection";
import MediaLocationSection from "./FormSections/MediaLocationSection";
import { FileItem } from "@/utils/upload";
import PrimaryButton from "@/components/shared/Button";
import SoftActionButton from "@/components/shared/SoftActionButton";
import {
  createProperty,
  updateProperty,
} from "@/services/properties/properties";
import toast from "react-hot-toast";
import { FiPlus, FiTrash2, FiInfo, FiShield } from "react-icons/fi";

export type PropertyDetail = {
  name: string;
  value: string | string[];
};

export type PropertyFormValues = {
  id?: number;
  title: string;
  description: string;
  price: number;
  propertyType: PropertyType;
  accessType: AccessType;
  rooms: number;
  bathrooms: number;
  area: number;
  details: Record<string, PropertyDetail>;
  warranties: Record<string, PropertyDetail>;
  ownerName: string;
  ownerPhone: string;
  ownerNotes?: string;
  images: FileItem[];
  video: string;
  address: string;
  latitude?: string;
  longitude?: string;
  mapPlaceId?: string;
  cityId?: number;
  areaId?: number;
  propertyTypeId?: number;
  isActive?: boolean;
  agentsPercentage?: number;
};

type PropertyFormProps = {
  initialData?: PropertyFormValues;
  isEdit?: boolean;
};

// Default details for new properties
const DEFAULT_DETAILS: Record<string, PropertyDetail> = {
  "المساحة الإجمالية": { name: "المساحة الإجمالية", value: "" },
  "عدد الطوابق": { name: "عدد الطوابق", value: "" },
  "السنة الإنشائية": { name: "السنة الإنشائية", value: "" },
  التشطيب: { name: "التشطيب", value: "" },
  الاتجاه: { name: "الاتجاه", value: "" },
  "مشاهدة الشارع": { name: "مشاهدة الشارع", value: "" },
  "مواقف السيارات": { name: "مواقف السيارات", value: "" },
  "مدخل سيارة": { name: "مدخل سيارة", value: "" },
  مسبح: { name: "مسبح", value: "" },
  حديقة: { name: "حديقة", value: "" },
};

// Default warranties for new properties
const DEFAULT_WARRANTIES: Record<string, PropertyDetail> = {
  "ضمان الهيكل الإنشائي": { name: "ضمان الهيكل الإنشائي", value: "" },
  "ضمان السباكة": { name: "ضمان السباكة", value: "" },
  "ضمان الكهرباء": { name: "ضمان الكهرباء", value: "" },
  "ضمان التكييف": { name: "ضمان التكييف", value: "" },
  "ضمان الأجهزة الكهربائية": { name: "ضمان الأجهزة الكهربائية", value: "" },
};

export default function PropertyForm({
  initialData,
  isEdit = false,
}: PropertyFormProps) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
    register,
    setValue,
    watch,
  } = useForm<PropertyFormValues>({
    defaultValues: initialData || {
      title: "",
      description: "",
      price: 0,
      propertyType: "apartment",
      accessType: "direct",
      rooms: 0,
      bathrooms: 0,
      area: 0,
      details: DEFAULT_DETAILS,
      warranties: DEFAULT_WARRANTIES,
      ownerName: "",
      ownerPhone: "",
      ownerNotes: "",
      images: [],
      video: "",
      address: "",
      latitude: "",
      longitude: "",
      mapPlaceId: "",
      isActive: true,
      agentsPercentage: 0,
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Watch details and warranties to handle dynamic updates
  const details = watch("details");
  const warranties = watch("warranties");

  // Initialize default data only for new properties
  useEffect(() => {
    if (!isEdit && !initialData) {
      setValue("details", DEFAULT_DETAILS);
      setValue("warranties", DEFAULT_WARRANTIES);
    }
  }, [isEdit, initialData, setValue]);

  // Function to add new detail item
  const addDetailItem = () => {
    const newKey = `detail_${Date.now()}`;
    const newDetails = { ...details };
    newDetails[newKey] = { name: "", value: "" };
    setValue("details", newDetails);
  };

  // Function to remove detail item
  const removeDetailItem = (key: string) => {
    const newDetails = { ...details };
    delete newDetails[key];
    setValue("details", newDetails);
  };

  // Function to update detail item
  const updateDetailItem = (
    key: string,
    field: "name" | "value",
    newValue: string
  ) => {
    const newDetails = { ...details };
    if (newDetails[key]) {
      newDetails[key] = {
        ...newDetails[key],
        [field]: newValue,
      };
      setValue("details", newDetails);
    }
  };

  // Function to add new warranty item
  const addWarrantyItem = () => {
    const newKey = `warranty_${Date.now()}`;
    const newWarranties = { ...warranties };
    newWarranties[newKey] = { name: "", value: "" };
    setValue("warranties", newWarranties);
  };

  // Function to remove warranty item
  const removeWarrantyItem = (key: string) => {
    const newWarranties = { ...warranties };
    delete newWarranties[key];
    setValue("warranties", newWarranties);
  };

  // Function to update warranty item
  const updateWarrantyItem = (
    key: string,
    field: "name" | "value",
    newValue: string
  ) => {
    const newWarranties = { ...warranties };
    if (newWarranties[key]) {
      newWarranties[key] = {
        ...newWarranties[key],
        [field]: newValue,
      };
      setValue("warranties", newWarranties);
    }
  };

  const transformFormDataToAPI = (formData: PropertyFormValues) => {
    // Filter out empty details and warranties
    const filteredDetails = Object.fromEntries(
      Object.entries(formData.details).filter(
        ([_, detail]) =>
          detail.name && detail.name.trim() !== "" && detail.value !== ""
      )
    );

    const filteredWarranties = Object.fromEntries(
      Object.entries(formData.warranties).filter(
        ([_, warranty]) =>
          warranty.name && warranty.name.trim() !== "" && warranty.value !== ""
      )
    );

    // Transform details to specifications object
    const specifications: Record<string, any> = {};
    Object.entries(filteredDetails).forEach(([key, detail]) => {
      if (detail.name && detail.value !== undefined && detail.value !== "") {
        if (typeof detail.value === "string") {
          if (
            detail.value.toLowerCase() === "نعم" ||
            detail.value.toLowerCase() === "yes" ||
            detail.value.toLowerCase() === "true"
          ) {
            specifications[detail.name] = true;
          } else if (
            detail.value.toLowerCase() === "لا" ||
            detail.value.toLowerCase() === "no" ||
            detail.value.toLowerCase() === "false"
          ) {
            specifications[detail.name] = false;
          } else if (
            !isNaN(Number(detail.value)) &&
            detail.value.trim() !== ""
          ) {
            specifications[detail.name] = Number(detail.value);
          } else {
            specifications[detail.name] = detail.value;
          }
        } else {
          specifications[detail.name] = detail.value;
        }
      }
    });

    // Transform warranties to guarantees object
    const guarantees: Record<string, any> = {};
    Object.entries(filteredWarranties).forEach(([key, warranty]) => {
      if (
        warranty.name &&
        warranty.value !== undefined &&
        warranty.value !== ""
      ) {
        if (typeof warranty.value === "string") {
          if (!isNaN(Number(warranty.value)) && warranty.value.trim() !== "") {
            guarantees[warranty.name] = Number(warranty.value);
          } else {
            guarantees[warranty.name] = warranty.value;
          }
        } else {
          guarantees[warranty.name] = warranty.value;
        }
      }
    });

    // Prepare the API data structure
    const apiData: any = {
      title: formData.title,
      description: formData.description,
      propertyTypeId:
        formData.propertyTypeId || getPropertyTypeId(formData.propertyType),
      cityId: formData.cityId || 1,
      areaId: formData.areaId || 1,
      bedrooms: Number(formData.rooms),
      bathrooms: Number(formData.bathrooms),
      areaM2: formData.area.toString(),
      price: formData.price.toString(),
      specifications:
        Object.keys(specifications).length > 0 ? specifications : {},
      guarantees: Object.keys(guarantees).length > 0 ? guarantees : {},
      accessType: formData.accessType,
      ownerName: formData.ownerName,
      ownerPhone: formData.ownerPhone,
      isActive: formData.isActive !== undefined ? formData.isActive : true,
    };

    // Add agents percentage if provided
    if (
      formData.agentsPercentage !== undefined &&
      formData.agentsPercentage > 0
    ) {
      apiData.agentsPercentage = formData.agentsPercentage.toString();
    }

    // Add optional fields only if they have values
    if (formData.ownerNotes) {
      apiData.ownerNotes = formData.ownerNotes;
    }
    if (formData.latitude) {
      apiData.latitude = parseFloat(formData.latitude);
    }
    if (formData.longitude) {
      apiData.longitude = parseFloat(formData.longitude);
    }
    if (formData.mapPlaceId) {
      apiData.mapPlaceId = formData.mapPlaceId;
    }

    return apiData;
  };

  // Helper function to get property type ID
  const getPropertyTypeId = (propertyType: PropertyType): number => {
    const typeMap: Record<PropertyType, number> = {
      apartment: 1,
      villa: 2,
      land: 3,
      office: 4,
    };
    return typeMap[propertyType] || 1;
  };

  const onSubmit = async (data: PropertyFormValues) => {
    setIsLoading(true);

    try {
      const apiData = transformFormDataToAPI(data);

      let response;

      if (isEdit && data.id) {
        response = await updateProperty(data.id, apiData);
        toast.success("تم تحديث العقار بنجاح", {
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
      } else {
        const formData = new FormData();
        Object.entries(apiData).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            if (
              typeof value === "object" &&
              key !== "specifications" &&
              key !== "guarantees"
            ) {
              formData.append(key, JSON.stringify(value));
            } else if (typeof value === "object") {
              formData.append(key, JSON.stringify(value));
            } else {
              formData.append(key, value.toString());
            }
          }
        });

        const newImages = data.images.filter((fileItem) => fileItem.file);
        newImages.forEach((fileItem, index) => {
          if (fileItem.file) {
            formData.append("media", fileItem.file);
          }
        });

        response = await createProperty(formData);
        toast.success("تم إنشاء العقار بنجاح", {
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
      }

      setTimeout(() => {
        router.push("/dashboard/admin/properties");
        router.refresh();
      }, 2000);
    } catch (error: any) {
      console.error(
        `Error ${isEdit ? "updating" : "creating"} property:`,
        error
      );

      let errorMessage = `فشل في ${isEdit ? "تحديث" : "إنشاء"} العقار`;
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, {
        duration: 5000,
        position: "top-center",
        icon: "❌",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="property-info-form space-y-6"
    >
      {/* Main Grid Layout */}
      <div className="grid xl:grid-cols-3 gap-6">
        {/* Left Column - General Information */}
        <div className="xl:col-span-1">
          <GeneralInfoSection control={control} />
        </div>

        {/* Right Column - Details and Additional Information */}
        <div className="xl:col-span-2 space-y-6">
          {/* Property Details Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <FiInfo className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-800">
                تفاصيل العقار
              </h3>
            </div>

            <div className="space-y-4">
              {Object.entries(details).map(([key, detail]) => (
                <div key={key} className="flex gap-3 items-center group">
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="اسم التفصيل"
                      value={detail.name}
                      onChange={(e) =>
                        updateDetailItem(key, "name", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                    <input
                      type="text"
                      placeholder="القيمة"
                      value={detail.value as string}
                      onChange={(e) =>
                        updateDetailItem(key, "value", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDetailItem(key)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition opacity-0 group-hover:opacity-100"
                    title="حذف التفصيل"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addDetailItem}
                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition flex items-center justify-center gap-2"
              >
                <FiPlus className="w-4 h-4" />
                إضافة تفصيل جديد
              </button>
            </div>
          </div>

          {/* Warranties Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <FiShield className="w-5 h-5 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-800">الضمانات</h3>
            </div>

            <div className="space-y-4">
              {Object.entries(warranties).map(([key, warranty]) => (
                <div key={key} className="flex gap-3 items-center group">
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="اسم الضمان"
                      value={warranty.name}
                      onChange={(e) =>
                        updateWarrantyItem(key, "name", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    />
                    <input
                      type="text"
                      placeholder="القيمة"
                      value={warranty.value as string}
                      onChange={(e) =>
                        updateWarrantyItem(key, "value", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeWarrantyItem(key)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition opacity-0 group-hover:opacity-100"
                    title="حذف الضمان"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addWarrantyItem}
                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-green-500 hover:text-green-500 transition flex items-center justify-center gap-2"
              >
                <FiPlus className="w-4 h-4" />
                إضافة ضمان جديد
              </button>
            </div>
          </div>

          {/* Agent Commission Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              نسبة الوسيط
            </h3>
            <div className="space-y-3">
              <div>
                <label
                  htmlFor="agentsPercentage"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  نسبة العمولة للوسيط (%)
                </label>
                <input
                  id="agentsPercentage"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  placeholder="أدخل نسبة العمولة للوسيط"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  {...register("agentsPercentage", {
                    min: {
                      value: 0,
                      message: "يجب أن تكون النسبة أكبر من أو تساوي 0",
                    },
                    max: {
                      value: 100,
                      message: "يجب أن تكون النسبة أقل من أو تساوي 100",
                    },
                  })}
                />
                {errors.agentsPercentage && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.agentsPercentage.message}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  أدخل نسبة العمولة التي سيحصل عليها الوسيط من قيمة الصفقة (من 0
                  إلى 100)
                </p>
              </div>
            </div>
          </div>

          {/* Contact and Media Sections */}
          <OwnerContactSection control={control} />
          <MediaLocationSection control={control} />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-center xl:justify-end gap-4 pt-6 border-t border-gray-200">
        <PrimaryButton
          type="submit"
          disabled={isLoading || isSubmitting}
          loading={isLoading}
          className="min-w-[150px]"
        >
          {isEdit ? "تحديث العقار" : "إضافة عقار جديد"}
        </PrimaryButton>
        <SoftActionButton
          onClick={handleCancel}
          type="button"
          disabled={isLoading}
          className="min-w-[100px]"
        >
          إلغاء
        </SoftActionButton>
      </div>
    </form>
  );
}
