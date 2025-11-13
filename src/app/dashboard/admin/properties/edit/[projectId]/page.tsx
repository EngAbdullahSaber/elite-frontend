"use client";

import DashboardHeaderTitle from "@/components/dashboard/DashboardHeaderTitle";
import PropertyForm, {
  PropertyFormValues,
} from "@/components/dashboard/properties/PropertyForm";
import CenteredContainer from "@/components/shared/CenteredContainer";
import Link from "next/link";
import { BiBuilding, BiListUl } from "react-icons/bi";
import { useState, useEffect } from "react";
import { getPropertyById } from "@/services/properties/properties";
import { Property } from "@/services/properties/properties";
import { ImageBaseUrl } from "@/libs/app.config";

type Props = {
  params: { projectId: string };
};

// Enhanced transformation function that matches your API response
function transformPropertyToFormValues(property: Property): PropertyFormValues {
  // Extract specifications and guarantees from the API response
  const specifications = property.specifications || {};
  const guarantees = property.guarantees || {};

  // Transform specifications to PropertyDetail format
  const details: Record<string, PropertyDetail> = {};
  Object.entries(specifications).forEach(([key, value]) => {
    details[key] = {
      name: key,
      value: typeof value === "string" ? value : String(value),
    };
  });

  // Transform guarantees to PropertyDetail format
  const warranties: Record<string, PropertyDetail> = {};
  Object.entries(guarantees).forEach(([key, value]) => {
    warranties[key] = {
      name: key,
      value: typeof value === "string" ? value : String(value),
    };
  });

  return {
    // Basic info
    id: property.id,
    title: property.title,
    description: property.description,
    price: parseFloat(property.price) || 0,

    // Property type - use the actual property type name from API
    propertyType: mapPropertyType(property.propertyType?.name),
    accessType: property.accessType as "direct" | "mediated",

    // Specifications - use bedrooms and bathrooms directly from API
    rooms: property.bedrooms || 0,
    bathrooms: property.bathrooms || 0,
    area: parseFloat(property.areaM2) || 0,

    // Details and warranties - use the transformed objects
    details: details,
    warranties: warranties,

    // Owner info - use the data from API response
    ownerName: property.ownerName || "",
    ownerPhone: property.ownerPhone || "",
    ownerEmail: property.createdBy?.email || "",
    ownerNotes: property.ownerNotes || "",

    // Media - transform media URLs with ImageBaseUrl
    images:
      property.medias?.map((media) => ({
        url: media.mediaUrl.startsWith("http")
          ? media.mediaUrl
          : ImageBaseUrl + media.mediaUrl,
        isPrimary: media.isPrimary || false,
        id: media.id,
        orderIndex: media.orderIndex || 0,
      })) || [],
    video: "", // Video not present in API response

    // Location - use the actual data from API
    address: formatAddress(property),
    cityId: property.cityId,
    areaId: property.areaId,
    propertyTypeId: property.propertyType?.id,
    latitude: property.latitude ? String(property.latitude) : "",
    longitude: property.longitude ? String(property.longitude) : "",
    mapPlaceId: property.mapPlaceId || "",

    // Status
    isActive: property.isActive !== undefined ? property.isActive : true,

    // Dates
    createdAt: property.createdAt,
    updatedAt: property.updatedAt,
  };
}

// Helper function to map property type
function mapPropertyType(apiType?: string): PropertyFormValues["propertyType"] {
  if (!apiType) return "apartment";

  const typeMap: Record<string, PropertyFormValues["propertyType"]> = {
    شقة: "apartment",
    فيلا: "villa",
    أرض: "land",
    مكتب: "office",
    apartment: "apartment",
    villa: "villa",
    land: "land",
    office: "office",
  };

  return typeMap[apiType] || "apartment";
}

// Helper function to format address
function formatAddress(property: Property): string {
  const parts = [];
  if (property.area?.name) parts.push(property.area.name);
  if (property.city?.name) parts.push(property.city.name);
  return parts.join("، ") || property.title || "عنوان غير محدد";
}

export default function EditProjectPage({ params }: Props) {
  const projectId = parseInt(params.projectId);
  const [project, setProject] = useState<PropertyFormValues | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError(null);

         const propertyData = await getPropertyById(projectId);
 
        const formData = transformPropertyToFormValues(propertyData);
 
        setProject(formData);
      } catch (err: any) {
        console.error("Error fetching property:", err);

        // Handle specific error cases
        if (err.response?.status === 404) {
          setError("العقار غير موجود");
        } else if (err.response?.status === 401) {
          setError("غير مصرح بالوصول إلى هذا العقار");
        } else if (err.response?.status === 403) {
          setError("غير مسموح لك بالوصول إلى هذا العقار");
        } else {
          setError("فشل في تحميل بيانات العقار");
        }
      } finally {
        setLoading(false);
      }
    };

    if (projectId && !isNaN(projectId)) {
      fetchProperty();
    } else {
      setError("رقم العقار غير صحيح");
      setLoading(false);
    }
  }, [projectId]);

  // Loading state
  if (loading) {
    return (
      <div>
        <DashboardHeaderTitle path={["المشاريع", "جاري التحميل..."]}>
          <div className="flex gap-4 flex-wrap">
            <Link className="btn-primary" href={`/projects/${projectId}`}>
              <BiBuilding /> صفحة المشروع
            </Link>
            <Link className="btn-primary" href="/dashboard/admin/projects">
              <BiListUl /> عرض جميع المشاريع
            </Link>
          </div>
        </DashboardHeaderTitle>

        <CenteredContainer>
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <div className="text-gray-600">جاري تحميل بيانات العقار...</div>
              <div className="text-gray-400 text-sm mt-2">
                رقم العقار: {projectId}
              </div>
            </div>
          </div>
        </CenteredContainer>
      </div>
    );
  }

  // Error state
  if (error || !project) {
    return (
      <div>
        <DashboardHeaderTitle path={["المشاريع", "خطأ في التحميل"]}>
          <div className="flex gap-4 flex-wrap">
            <Link className="btn-primary" href="/dashboard/admin/projects">
              <BiListUl /> عرض جميع المشاريع
            </Link>
          </div>
        </DashboardHeaderTitle>

        <CenteredContainer>
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="text-red-600 text-xl mb-4">⚠️ {error}</div>
            <div className="text-gray-500 mb-6">رقم العقار: {projectId}</div>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/dashboard/admin/projects" className="btn-primary">
                العودة إلى قائمة العقارات
              </Link>
              <button
                onClick={() => window.location.reload()}
                className="btn-secondary"
              >
                إعادة المحاولة
              </button>
            </div>
          </div>
        </CenteredContainer>
      </div>
    );
  }

  // Success state
  return (
    <div>
      <DashboardHeaderTitle
        path={["المشاريع", `تعديل بيانات المشروع: ${project.title}`]}
      >
        <div className="flex gap-4 flex-wrap">
          <Link className="btn-primary" href="/dashboard/admin/properties">
            <BiListUl /> عرض جميع المشاريع
          </Link>
        </div>
      </DashboardHeaderTitle>

      <PropertyForm initialData={project} isEdit={true} />
    </div>
  );
}
