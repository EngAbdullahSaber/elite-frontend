"use client";

import React, { useState } from "react";
import { Property } from "@/types/global";
import { useFavoriteProjects } from "@/contexts/FavoriteProjectsContext";
import { toggleFavorite } from "@/services/favorites/favorites";
import toast from "react-hot-toast";

interface FavoriteButtonProps {
  property: Property;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export default function FavoriteButton({
  property,
  size = "md",
  showText = false,
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite: toggleLocalFavorite } =
    useFavoriteProjects();
  const [loading, setLoading] = useState(false);
  const active = isFavorite(property.id);

  // Size classes
  const sizeClasses = {
    sm: "p-1.5",
    md: "p-2",
    lg: "p-3",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const handleToggleFavorite = async () => {
    if (loading) return;

    // Optimistic update - update UI immediately
    const wasActive = active;
    toggleLocalFavorite(property);

    setLoading(true);

    try {
      const favoriteData = {
        propertyId: property.id,
        note: "property favourite",
      };

      console.log("Toggling favorite for property:", property.id);

      const response = await toggleFavorite(favoriteData);
      console.log("Toggle favorite response:", response);

      // Handle different API response structures
      if (response) {
        // If API returns the actual state, sync with it
        if (typeof response.isFavorite === "boolean") {
          if (response.isFavorite !== !wasActive) {
            // If state doesn't match, toggle again to sync
            toggleLocalFavorite(property);
          }
        }
        // If API returns the favorite record, we're good
        else if (response.id && response.property) {
          // Success - no need to change state
        }
      }

      // Success message
      const message = !wasActive
        ? "تم إضافة العقار إلى المفضلة"
        : "تم إزالة العقار من المفضلة";
      toast.success(message, {
        duration: 3000,
        position: "top-center",
        icon: "✅",
        style: {
          background: "#10B981",
          color: "#fff",
          borderRadius: "8px",
          fontSize: "14px",
        },
      });
    } catch (error: any) {
      console.error("Error toggling favorite:", error);

      // Revert optimistic update on error
      toggleLocalFavorite(property);

      // Handle specific error cases
      let errorMessage = "فشل في تحديث المفضلة";

      if (error.response?.status === 401) {
        errorMessage = "يجب تسجيل الدخول لإضافة العقارات إلى المفضلة";
      } else if (error.response?.status === 404) {
        errorMessage = "العقار غير موجود";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
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
      setLoading(false);
    }
  };

  const buttonContent = (
    <>
      {loading ? (
        <div
          className={`${iconSizes[size]} border-2 border-current border-t-transparent rounded-full animate-spin`}
        />
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={iconSizes[size]}
          fill={active ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
      )}
      {showText && (
        <span className="mr-2 text-sm">
          {active ? "مفضل" : "أضف إلى المفضلة"}
        </span>
      )}
    </>
  );

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={loading}
      className={`
                z-10 rounded-full transition-all duration-200 flex items-center justify-center
                ${sizeClasses[size]}
                ${
                  active
                    ? "bg-primary text-white shadow-md"
                    : "bg-white text-primary hover:bg-primary-light hover:shadow-sm"
                }
                ${
                  loading
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer hover:scale-105"
                }
            `}
      aria-label={active ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
      title={active ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
    >
      {buttonContent}
    </button>
  );
}
