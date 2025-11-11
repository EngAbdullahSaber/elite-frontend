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
import { createProperty } from "@/services/properties/properties";

export type PropertyDetail = {
  name: string;
  value: string | string[];
};

export type PropertyFormValues = {
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
};

type PropertyFormProps = {
  initialData?: PropertyFormValues;
};

export default function PropertyForm({ initialData }: PropertyFormProps) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
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
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const transformFormDataToAPI = (formData: PropertyFormValues) => {
    // Transform details to specifications object
    const specifications: Record<string, any> = {};
    Object.values(formData.details).forEach((detail) => {
      if (detail.name && detail.value) {
        // Convert string values to appropriate types
        if (typeof detail.value === "string") {
          if (
            detail.value.toLowerCase() === "true" ||
            detail.value.toLowerCase() === "false"
          ) {
            specifications[detail.name] = detail.value.toLowerCase() === "true";
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
    Object.values(formData.warranties).forEach((warranty) => {
      if (warranty.name && warranty.value) {
        guarantees[warranty.name] = warranty.value;
      }
    });

    return {
      title: formData.title,
      description: formData.description,
      propertyTypeId: formData.propertyTypeId || 1,
      cityId: formData.cityId || 1,
      areaId: formData.areaId || 1,
      bedrooms: Number(formData.rooms),
      bathrooms: Number(formData.bathrooms),
      areaM2: formData.area.toString(),
      price: formData.price.toString(),
      specifications: JSON.stringify(specifications),
      guarantees: JSON.stringify(guarantees),
      accessType: formData.accessType,
      ownerName: formData.ownerName,
      ownerPhone: formData.ownerPhone,
      ownerNotes: formData.ownerNotes || "",
      latitude: formData.latitude || "",
      longitude: formData.longitude || "",
      mapPlaceId: formData.mapPlaceId || "",
      // Extract actual File objects from FileItem array
      media: formData.images.map((fileItem) => fileItem.file).filter(Boolean),
    };
  };

  const onSubmit = async (data: PropertyFormValues) => {
    setIsLoading(true);
    try {
      const apiData = transformFormDataToAPI(data);

      // Create FormData object
      const formData = new FormData();

      // Append all text fields
      formData.append("title", apiData.title);
      formData.append("description", apiData.description);
      formData.append("propertyTypeId", apiData.propertyTypeId.toString());
      formData.append("cityId", apiData.cityId.toString());
      formData.append("areaId", apiData.areaId.toString());
      formData.append("bedrooms", apiData.bedrooms.toString());
      formData.append("bathrooms", apiData.bathrooms.toString());
      formData.append("areaM2", apiData.areaM2);
      formData.append("price", apiData.price);
      formData.append("specifications", apiData.specifications);
      formData.append("guarantees", apiData.guarantees);
      formData.append("accessType", apiData.accessType);
      formData.append("ownerName", apiData.ownerName);
      formData.append("ownerPhone", apiData.ownerPhone);

      // Append optional fields if they exist
      if (apiData.ownerNotes) {
        formData.append("ownerNotes", apiData.ownerNotes);
      }
      if (apiData.latitude) {
        formData.append("latitude", apiData.latitude);
      }
      if (apiData.longitude) {
        formData.append("longitude", apiData.longitude);
      }
      if (apiData.mapPlaceId) {
        formData.append("mapPlaceId", apiData.mapPlaceId);
      }

      // Append each media file
      apiData.media.forEach((file) => {
        formData.append("media", file);
      });

      if (initialData) {
        // Update property logic with formData
        console.log("Updating property...", formData);
        // await updateProperty(propertyId, formData);
      } else {
        // Create new property with formData
        const response = await createProperty(formData);
        console.log("Property created successfully:", response);

        // Redirect to properties list or show success message
        router.push("/dashboard/admin/properties");
      }
    } catch (error) {
      console.error("Error submitting property:", error);
      // Handle error (show toast message, etc.)
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
        <PrimaryButton type="submit" disabled={isLoading} loading={isLoading}>
          {initialData ? "تعديل معلومات العقار" : "إضافة عقار جديد"}
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
