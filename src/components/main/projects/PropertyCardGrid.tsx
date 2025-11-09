"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Property } from "@/types/global";
import FavoriteButton from "@/components/shared/FavoriteButton";
import { FaMapMarkerAlt } from "react-icons/fa";
import { BiEdit } from "react-icons/bi";
import { propertyTypeLabels } from "@/types/property";

interface PropertyCardGridProps {
  property: any;
  isAdmin?: boolean;
}

export default function PropertyCardGrid({
  property,
  isAdmin = false,
}: PropertyCardGridProps) {
  // Safe data extraction with fallbacks
  const propertyId = property.id || property._id;
  const href = `/projects/${propertyId}`;
  const title = property.title || "عقار";
  const location =
    property.area?.name || property.city?.name || "موقع غير محدد";
  const price = property.price ? parseFloat(property.price) : 0;

  // Get first media URL or use placeholder
  const imageUrl =
    property.medias?.find((media: any) => media.isPrimary)?.mediaUrl ||
    property.medias?.[0]?.mediaUrl ||
    "/placeholder-property.jpg";

  // Property type handling
  const propertyType = property.propertyType?.name || "شقة";
  const propertyTypeKey = getPropertyTypeKey(propertyType);

  // Helper function to map property type names to keys
  function getPropertyTypeKey(typeName: string): string {
    const typeMap: { [key: string]: string } = {
      شقة: "apartment",
      فيلا: "villa",
      أرض: "land",
      عمارة: "building",
    };
    return typeMap[typeName] || "apartment";
  }

  return (
    <div className="w-full max-[520px]:w-full min-[520px]:max-w-[480px] mx-auto bg-white shadow-lg rounded-xl overflow-hidden flex flex-col border border-gray-100 transition hover:shadow-2xl hover:-translate-y-1 hover:border-primary/30">
      <div className="relative h-[200px] sm:h-[240px] md:h-[260px] group overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            // Fallback if image fails to load
            (e.target as HTMLImageElement).src = "/placeholder-property.jpg";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-0" />
        <Link
          href={`/projects?type=${propertyTypeKey}`}
          aria-label={`عرض مشاريع من نوع ${
            propertyTypeLabels[propertyTypeKey] || propertyType
          }`}
          className="absolute top-3 left-3 z-10 bg-white text-primary rounded-full py-1.5 px-3 text-xs font-semibold shadow hover:bg-primary-light transition"
        >
          {propertyTypeLabels[propertyTypeKey] || propertyType}
        </Link>
        <div className="absolute w-[100px] top-3 right-3 flex items-center gap-2 z-10">
          <FavoriteButton property={property} />

          {isAdmin && (
            <Link
              href={`/dashboard/admin/projects/edit/${propertyId}`}
              className="bg-white p-2 rounded-full shadow hover:bg-gray-300 transition"
            >
              <BiEdit className="w-5 h-5 text-gray-600" />
            </Link>
          )}
        </div>
      </div>

      <div className="p-4 sm:p-5 flex flex-col gap-3">
        {location && (
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <FaMapMarkerAlt className="text-primary" />
            <span>{location}</span>
          </div>
        )}

        <Link
          href={href}
          className="text-lg sm:text-xl font-bold text-neutral-800 hover:text-primary transition line-clamp-2 min-h-[3rem]"
          title={title}
        >
          {title}
        </Link>

        <ul className="flex justify-between text-sm text-neutral-600 mt-2">
          {property.bedrooms > 0 && (
            <li className="flex items-center gap-2">
              <i className="las la-bed text-lg text-primary" />
              <span>{property.bedrooms} غرف</span>
            </li>
          )}
          {property.bathrooms > 0 && (
            <li className="flex items-center gap-2">
              <i className="las la-bath text-lg text-primary" />
              <span>{property.bathrooms} حمام</span>
            </li>
          )}
          {property.areaM2 && (
            <li className="flex items-center gap-2">
              <i className="las la-arrows-alt text-lg text-primary" />
              <span>{property.areaM2} م²</span>
            </li>
          )}
        </ul>

        <div className="border-t border-dashed my-3" />

        <div className="flex justify-between items-center">
          <p className="text-sm font-semibold text-primary">
            {price.toLocaleString()} ريال
          </p>

          <Link
            href={href}
            className="inline-flex items-center gap-2 text-xs md:text-sm font-medium text-primary border border-primary px-2 py-2 rounded-full hover:bg-primary hover:text-white transition duration-200"
            aria-label={`اقرأ المزيد عن ${title}`}
          >
            <span>اقرأ المزيد</span>
            <i className="las la-arrow-left text-base" />
          </Link>
        </div>
      </div>
    </div>
  );
}
