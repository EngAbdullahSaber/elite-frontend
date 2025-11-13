"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ImageGallery from "@/components/shared/ImageGallery";
import ProjectBookingForm from "@/components/main/projects/ProjectBookingForm";
import PropertyInfoSection from "@/components/main/projects/property/PropertyInfoSection";
import PropertySummary from "@/components/main/projects/property/PropertySummary";
import PropertyDescriptionSection from "@/components/main/projects/property/PropertyDescriptionSection";
import VideoSection from "@/components/shared/VideoSection";
import GuaranteesSection from "@/components/main/projects/property/GuaranteesSection";
import SimilarProjectsSection from "@/components/shared/SimilarProjectsSection";
import { Property } from "@/types/global";
import { getPropertyById } from "@/services/properties/properties";
import { ImageBaseUrl } from "@/libs/app.config";

interface DetailedProperty {
  id?: number;
  title?: string;
  description?: string;
  bedrooms?: number;
  bathrooms?: number;
  areaM2?: string;
  price?: string;
  specifications?: {
    pool?: boolean;
    garden?: boolean;
    parking?: boolean;
    furnished?: boolean;
    [key: string]: boolean | undefined;
  };
  guarantees?: {
    warranty?: string;
    maintenance?: string;
    [key: string]: string | undefined;
  };
  city?: {
    id: number;
    name: string;
  };
  area?: {
    id: number;
    name: string;
    city?: {
      id: number;
      name: string;
    };
  };
  propertyType?: {
    id: number;
    name: string;
  };
  medias?: Array<{
    id: number;
    mediaUrl: string;
    isPrimary: boolean;
    orderIndex: number;
  }>;
  accessType?: string;
  ownerName?: string;
  ownerPhone?: string;
  latitude?: number | null;
  longitude?: number | null;
  isActive?: boolean;
}

// Mock similar projects (you might want to fetch these from an API too)
const similarProjects: Property[] = [
  {
    id: "dihshjs5s5",
    imageLink: "/main/projects/property-1.webp",
    type: "villa",
    title: "فيلا فاخرة – جدة | أبحر الشمالية",
    link: "/projects/obhur-villa",
    rooms: "5 غرف نوم",
    beds: "5 حمامات",
    area: "800 متر مربع",
    location: "جدة، أبحر الشمالية",
  },
  {
    id: "muskslk56",
    imageLink: "/main/projects/property-2.webp",
    type: "villa",
    title: "فيلا نموذج لايت",
    link: "/projects/light-villa",
    rooms: "5 غرف نوم",
    beds: "6 حمامات",
    area: "480 متر مربع",
    location: "جدة، حي النموذج",
  },
  {
    id: "jdoamsl55",
    imageLink: "/main/projects/property-3.webp",
    type: "villa",
    title: "فيلا جوري",
    link: "/projects/jory-villa",
    rooms: "7 غرف نوم",
    beds: "6 حمامات",
    area: "460 متر مربع",
    location: "جدة، حي الزمرد",
  },
];

export default function ProjectDetailsPage() {
  const { propertyId } = useParams();
  const [property, setProperty] = useState<DetailedProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError(null);

        const propertyData = await getPropertyById(propertyId);

        setProperty(propertyData);
      } catch (err) {
        console.error("Error fetching property:", err);
        setError(
          err instanceof Error ? err.message : "فشل في تحميل بيانات العقار"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);
  // Map API property data to the format expected by components
  const mapPropertyToDisplay = (propertyData: DetailedProperty) => {
    // Extract images from medias array, sorted by orderIndex
    const images = propertyData.medias
      ? propertyData.medias
          .sort((a, b) => a.orderIndex - b.orderIndex)
          .map((media) => {
            const url = media.mediaUrl;

            // If the URL is already absolute, return it
            if (url.startsWith("http://") || url.startsWith("https://")) {
              return url;
            }

            // Otherwise prepend the base URL
            return ImageBaseUrl + url;
          })
      : [
          "/main/projects/property-2.webp",
          "/main/projects/property-3.webp",
          "/main/projects/property-4.webp",
        ];

    // Convert guarantees object to array of strings
    const guaranteesArray = propertyData.guarantees
      ? Object.entries(propertyData.guarantees).map(([key, value]) => {
          const guaranteeLabels: Record<string, string> = {
            warranty: "ضمان",
            maintenance: "صيانة",
          };
          const label = guaranteeLabels[key] || key;
          return `${label}: ${value}`;
        })
      : ["10 سنوات هيكل إنشائي", "2 سنة كهرباء وسباكة"];

    // Map details object based on API response
    const details: Record<string, { name: string; value: string }> = {
      area: {
        name: "المساحة",
        value: propertyData.areaM2
          ? `${propertyData.areaM2} متر مربع`
          : "غير محدد",
      },
      district: {
        name: "الحي",
        value: propertyData.area?.name || "غير محدد",
      },
      city: {
        name: "المدينة",
        value:
          propertyData.city?.name ||
          propertyData.area?.city?.name ||
          "غير محدد",
      },
      property_type: {
        name: "نوع العقار",
        value: propertyData.propertyType?.name || "غير محدد",
      },
      bedrooms: {
        name: "غرف النوم",
        value: propertyData.bedrooms
          ? `${propertyData.bedrooms} غرف`
          : "غير محدد",
      },
      bathrooms: {
        name: "الحمامات",
        value: propertyData.bathrooms
          ? `${propertyData.bathrooms} حمام`
          : "غير محدد",
      },
      access_type: {
        name: "نوع الوصول",
        value: propertyData.accessType === "mediated" ? "وسيط" : "مباشر",
      },
      owner: {
        name: "المالك",
        value: propertyData.ownerName || "غير محدد",
      },
      owner_phone: {
        name: "هاتف المالك",
        value: propertyData.ownerPhone || "غير محدد",
      },
      status: {
        name: "الحالة",
        value: propertyData.isActive ? "نشط" : "غير نشط",
      },
    };

    // Add specification-based details
    if (propertyData.specifications) {
      if (propertyData.specifications.pool !== undefined) {
        details.pool = {
          name: "مسبح",
          value: propertyData.specifications.pool ? "نعم" : "لا",
        };
      }
      if (propertyData.specifications.garden !== undefined) {
        details.garden = {
          name: "حديقة",
          value: propertyData.specifications.garden ? "نعم" : "لا",
        };
      }
      if (propertyData.specifications.parking !== undefined) {
        details.parking = {
          name: "موقف سيارات",
          value: propertyData.specifications.parking ? "نعم" : "لا",
        };
      }
      if (propertyData.specifications.furnished !== undefined) {
        details.furnished = {
          name: "مفروش",
          value: propertyData.specifications.furnished ? "نعم" : "لا",
        };
      }
    }

    // Add location coordinates if available
    if (propertyData.latitude && propertyData.longitude) {
      details.coordinates = {
        name: "الإحداثيات",
        value: `${propertyData.latitude}, ${propertyData.longitude}`,
      };
    }

    return {
      id: propertyData.id?.toString() || "0",
      title: propertyData.title || "غير معروف",
      price: propertyData.price
        ? `${parseFloat(propertyData.price).toLocaleString()} ر.س`
        : "غير محدد",
      location: `${
        propertyData.city?.name || propertyData.area?.city?.name || "غير محدد"
      }, ${propertyData.area?.name || ""}`.trim(),
      rooms: propertyData.bedrooms
        ? `${propertyData.bedrooms} غرف نوم`
        : "غير محدد",
      baths: propertyData.bathrooms
        ? `${propertyData.bathrooms} حمامات`
        : "غير محدد",
      area: propertyData.areaM2
        ? `${propertyData.areaM2} متر مربع`
        : "غير محدد",
      description: propertyData.description || "لا يوجد وصف متاح",
      videoUrl: undefined, // Your API response doesn't include videoUrl
      guarantees: guaranteesArray,
      details,
      images,
    };
  };

  // Show loading state
  if (loading) {
    return (
      <div className="container py-[30px] lg:py-[60px] bg-[var(--bg-1)] px-3 space-y-12">
        {/* Image Gallery Skeleton */}
        <div className="animate-pulse">
          <div className="bg-gray-200 rounded-lg h-64 lg:h-96"></div>
        </div>

        <div className="relative flex flex-col md:flex-row gap-4 md:gap-6">
          {/* Booking Form Skeleton */}
          <div className="md:basis-4/12">
            <div className="bg-gray-200 rounded-lg h-96 animate-pulse"></div>
          </div>

          {/* Content Skeleton */}
          <div className="md:basis-8/12 space-y-4 md:space-y-6">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="bg-gray-200 rounded-lg h-32 animate-pulse"
              ></div>
            ))}
          </div>
        </div>

        {/* Similar Projects Skeleton */}
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-gray-200 rounded-lg h-80"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !property) {
    return (
      <div className="container py-[30px] lg:py-[60px] bg-[var(--bg-1)] px-3">
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            خطأ في التحميل
          </h3>
          <p className="text-gray-600 mb-6">{error || "العقار غير موجود"}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              إعادة المحاولة
            </button>
            <a
              href="/properties"
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              العودة للعقارات
            </a>
          </div>
        </div>
      </div>
    );
  }

  const displayProperty = mapPropertyToDisplay(property);

  return (
    <div className="container py-[30px] lg:py-[60px] bg-[var(--bg-1)] px-3 space-y-12">
      {/* Hero Section */}
      <ImageGallery images={displayProperty.images} />

      <div className="relative flex flex-col md:flex-row gap-4 md:gap-6">
        <div className="md:basis-4/12">
          <ProjectBookingForm id={displayProperty.id} />
        </div>

        <div className="md:basis-8/12 space-y-4 md:space-y-6">
          <PropertySummary
            title={displayProperty.title}
            price={displayProperty.price}
            location={displayProperty.location}
            rooms={displayProperty.rooms}
            baths={displayProperty.baths}
            area={displayProperty.area}
          />

          <PropertyDescriptionSection
            description={displayProperty.description}
          />

          <PropertyInfoSection details={displayProperty.details} />

          <GuaranteesSection guarantees={displayProperty.guarantees} />

          {/* Video section is hidden since API doesn't provide videoUrl */}
        </div>
      </div>

      {/* <SimilarProjectsSection
        projects={similarProjects}
        title="مشاريع مشابهة"
      /> */}
    </div>
  );
}
