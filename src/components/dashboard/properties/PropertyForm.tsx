"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import GeneralInfoSection from "./FormSections/GeneralInfoSection";
import { AccessType, PropertyType } from "@/types/property";
import InfoSection from "./FormSections/InfoSection";
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
  // Add these new fields to match API
  cityId?: number;
  areaId?: number;
  propertyTypeId?: number;
  isActive?: boolean;
};

type PropertyFormProps = {
  initialData?: PropertyFormValues;
  isEdit?: boolean;
};

export default function PropertyForm({
  initialData,
  isEdit = false,
}: PropertyFormProps) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
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
      details: {},
      warranties: {},
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
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const transformFormDataToAPI = (formData: PropertyFormValues) => {
    // Transform details to specifications object
    const specifications: Record<string, any> = {};
    Object.entries(formData.details).forEach(([key, detail]) => {
      if (detail.name && detail.value !== undefined && detail.value !== "") {
        // Convert string values to appropriate types
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
    Object.entries(formData.warranties).forEach(([key, warranty]) => {
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
        // Update existing property - use JSON for update
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
        // Create new property - use FormData for file uploads
        const formData = new FormData();

        // Append all text fields
        Object.entries(apiData).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            if (
              typeof value === "object" &&
              key !== "specifications" &&
              key !== "guarantees"
            ) {
              formData.append(key, JSON.stringify(value));
            } else if (typeof value === "object") {
              // Handle specifications and guarantees as separate objects
              formData.append(key, JSON.stringify(value));
            } else {
              formData.append(key, value.toString());
            }
          }
        });

        // Append media files - only new files that have file objects
        const newImages = data.images.filter((fileItem) => fileItem.file);
        newImages.forEach((fileItem, index) => {
          if (fileItem.file) {
            formData.append("media", fileItem.file);
          }
        });

        
        for (let [key, value] of formData.entries()) {
          
        }

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

      // Redirect to properties list after short delay to show toast
      setTimeout(() => {
        router.push("/dashboard/admin/properties");
        router.refresh(); // Refresh the page to show updated data
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
        style: {
          background: "#EF4444",
          color: "#fff",
          borderRadius: "8px",
          fontSize: "14px",
        },
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
      className="property-info-form space-y-6 grid xl:grid-cols-2 gap-4 xl:gap-6"
    >
      <div className="max-xl:order-2 space-y-4 xl:space-y-6">
        <InfoSection<PropertyFormValues>
          control={control}
          name="details"
          title="تفاصيل العقار"
        />
        <InfoSection<PropertyFormValues>
          control={control}
          name="warranties"
          title="الضمانات"
        />
        <OwnerContactSection control={control} />
        <MediaLocationSection control={control} />
      </div>
      <div className="max-xl:order-1">
        <GeneralInfoSection control={control} />
      </div>

      <div className="max-xl:order-3 space-x-4 flex items-center justify-center xl:justify-end">
        <PrimaryButton
          type="submit"
          disabled={isLoading || isSubmitting}
          loading={isLoading}
        >
          {isEdit ? "تحديث العقار" : "إضافة عقار جديد"}
        </PrimaryButton>
        <SoftActionButton
          onClick={handleCancel}
          type="button"
          disabled={isLoading}
        >
          إلغاء
        </SoftActionButton>
      </div>
    </form>
  );
}
