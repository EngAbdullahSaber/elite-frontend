// components/main/projects/PropertyCardsDisplay.tsx
"use client";

import useProperties from "@/hooks/dashboard/admin/properties/useProperties";
import Link from "next/link";
import Image from "next/image";
import { ImageBaseUrl } from "@/libs/app.config";

export default function PropertyCardsDisplay({
  isAdmin = false,
}: {
  isAdmin?: boolean;
}) {
  const { data, loading } = useProperties();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="border rounded-lg p-4 animate-pulse">
            <div className="bg-gray-200 h-48 rounded-md mb-4"></div>
            <div className="bg-gray-200 h-4 rounded mb-2"></div>
            <div className="bg-gray-200 h-4 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">لا توجد عقارات</div>
        <p className="text-gray-400 mt-2">
          لم يتم العثور على أي عقارات تطابق معايير البحث
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((property) => {
        // Get primary image or first image
        const primaryImage =
          property.medias?.find((media) => media.isPrimary) ||
          property.medias?.[0];

        return (
          <Link
            key={property.id}
            href={
              isAdmin
                ? `/dashboard/admin/properties/edit/${property.id}`
                : `/projects/${property.id}`
            }
            className="block group"
          >
            <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:border-blue-300">
              {/* Property Image */}
              <div className="relative h-48 bg-gray-100">
                {primaryImage ? (
                  <img
                    src={
                      primaryImage.mediaUrl?.startsWith("http")
                        ? primaryImage.mediaUrl
                        : ImageBaseUrl + primaryImage.mediaUrl
                    }
                    alt={property.title}
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      e.currentTarget.src = "/placeholder-property.jpg";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-gray-400">لا توجد صورة</span>
                  </div>
                )}
                {/* Property Type Badge */}
                <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded text-sm">
                  {property.propertyType?.name || "غير محدد"}
                </div>
                {/* Price Badge */}
                <div className="absolute top-3 right-3 bg-green-600 text-white px-2 py-1 rounded text-sm font-semibold">
                  {property.price
                    ? `${Number(property.price).toLocaleString()} ر.س`
                    : "السعر غير متوفر"}
                </div>
              </div>

              {/* Property Details */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
                  {property.title}
                </h3>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {property.description}
                </p>

                {/* Property Specifications */}
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <span>🛏️</span>
                    <span>{property.bedrooms} غرف</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>🚿</span>
                    <span>{property.bathrooms} حمام</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>📐</span>
                    <span>{property.areaM2} م²</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>🏙️</span>
                    <span>{property.city?.name || "غير محدد"}</span>
                  </div>
                </div>

                {/* Area and Access Type */}
                <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-3">
                  <span>{property.area?.name || "المنطقة غير محددة"}</span>
                  <span
                    className={`px-2 py-1 rounded ${
                      property.accessType === "direct"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {property.accessType === "direct"
                      ? "وصول مباشر"
                      : "وصول وسيط"}
                  </span>
                </div>

                {/* Additional Specifications */}
                {property.specifications &&
                  Object.keys(property.specifications).length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(property.specifications)
                          .slice(0, 3)
                          .map(
                            ([key, value]) =>
                              value === true && (
                                <span
                                  key={key}
                                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                                >
                                  {key}
                                </span>
                              )
                          )}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
