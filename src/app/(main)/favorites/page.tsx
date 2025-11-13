"use client";

import { useState, useEffect } from "react";
import ListProperty from "@/components/main/home/ListProperty";
import PropertyPagination from "@/components/main/projects/PropertyPagination";
import { getFavorites } from "@/services/favorites/favorites";
import { Property } from "@/types/property";

// Define types based on your API response
interface FavoriteRecord {
  id: number;
  createdAt: string;
  updatedAt: string;
  note: string;
  user: {
    id: number;
    fullName: string;
    email: string;
  };
  property: Property;
}

interface FavoritesResponse {
  total: number;
  page: number;
  limit: number;
  data: FavoriteRecord[];
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [flag, setFlag] = useState(false);
  const [totalFavorites, setTotalFavorites] = useState(0);

  const itemsPerPage = 8;

  useEffect(() => {
    fetchFavorites();
  }, [currentPage, flag]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getFavorites({
        page: currentPage,
        limit: itemsPerPage,
        sortBy: "createdAt",
        sortOrder: "DESC",
      });

      // Handle the actual API response structure
      let favoritesData: FavoriteRecord[] = [];
      let totalCount = 0;

      if (response && typeof response === "object") {
        // If response has data array (your actual structure)
        if ("data" in response && Array.isArray(response.data)) {
          favoritesData = response.data;
          totalCount = response.total || 0;
        }
        // If response is the data array directly
        else if (Array.isArray(response)) {
          favoritesData = response;
          totalCount = response.length;
        }
        // If response has records array (alternative structure)
        else if ("records" in response && Array.isArray(response.records)) {
          favoritesData = response.records;
          totalCount = response.total_records || response.total || 0;
        }
        // If response has nested data property
        else if (response.data && Array.isArray(response.data.data)) {
          favoritesData = response.data.data;
          totalCount = response.data.total || 0;
        }
      }

      // Extract properties from favorites with better error handling
      const favoriteProperties = favoritesData
        .map((record) => {
          try {
            // Ensure property exists and has all required fields
            const property = record.property || {};

            // Validate that we have at least basic property data
            if (!property.id && !record.id) {
              console.warn("Invalid favorite record:", record);
              return null;
            }

            return {
              id: property.id || record.id,
              title: property.title || "بدون عنوان",
              description: property.description || "",
              price: property.price || "0",
              bedrooms: property.bedrooms || 0,
              bathrooms: property.bathrooms || 0,
              areaM2: property.areaM2 || "0",
              propertyType: property.propertyType || {
                name: "غير محدد",
                id: 0,
              },
              city: property.city || { name: "غير محدد", id: 0 },
              area: property.area,
              specifications: property.specifications || {},
              guarantees: property.guarantees || {},
              medias: property.medias || [],
              accessType: property.accessType || "mediated",
              isActive:
                property.isActive !== undefined ? property.isActive : true,
              createdAt: property.createdAt || record.createdAt,
              updatedAt: property.updatedAt || record.updatedAt,
              // Include any additional properties that might be needed
              ...property,
            };
          } catch (error) {
            console.error("Error processing favorite record:", error, record);
            return null;
          }
        })
        .filter((property): property is Property => property !== null);

      setFavorites(favoriteProperties);
      setTotalFavorites(totalCount);

      // Calculate total pages
      const calculatedTotalPages = Math.ceil(totalCount / itemsPerPage);
      setTotalPages(calculatedTotalPages > 0 ? calculatedTotalPages : 1);
    } catch (err: any) {
      console.error("Error fetching favorites:", err);

      let errorMessage = "فشل في تحميل العقارات المفضلة";

      if (err.response?.status === 401) {
        errorMessage = "يجب تسجيل الدخول لعرض المفضلة";
      } else if (err.response?.status === 403) {
        errorMessage = "غير مصرح لك بالوصول إلى المفضلة";
      } else if (err.response?.status === 404) {
        errorMessage = "لم يتم العثور على أي عقارات مفضلة";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      } else if (err.code === "NETWORK_ERROR") {
        errorMessage = "خطأ في الاتصال بالشبكة";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Refresh favorites when component mounts or user logs in/out
  useEffect(() => {
    // Check if user is logged in
    const user =
      typeof window !== "undefined" ? sessionStorage.getItem("user") : null;
    if (!user) {
      setError("يجب تسجيل الدخول لعرض المفضلة");
      setLoading(false);
      return;
    }
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="py-[30px] lg:py-[60px] bg-[var(--bg-2)] px-3">
        <div className="container">
          <div className="h2 mt-4 mb-10 bg-gray-200 rounded w-64 h-10 animate-pulse mx-auto"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-64 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <div className="h-10 bg-gray-200 rounded w-64 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="py-[30px] lg:py-[60px] bg-[var(--bg-2)] px-3">
        <div className="container">
          <h2 className="h2 mt-4 mb-10">المشاريع المفضلة</h2>
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
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={fetchFavorites}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                إعادة المحاولة
              </button>
              <a
                href="/projects"
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors inline-block"
              >
                استكشاف العقارات
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state
  if (favorites.length === 0 && !loading) {
    return (
      <div className="py-[30px] lg:py-[60px] bg-[var(--bg-2)] px-3">
        <div className="container">
          <h2 className="h2 mt-4 mb-10">المشاريع المفضلة</h2>
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <div className="text-gray-400 mb-4">
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
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              لا توجد عقارات مفضلة
            </h3>
            <p className="text-gray-600 mb-6">
              لم تقم بإضافة أي عقارات إلى المفضلة بعد. ابدأ باستكشاف العقارات
              وأضف المفضلة لديك.
            </p>
            <a
              href="/projects"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors inline-block"
            >
              استكشاف العقارات
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-[30px] lg:py-[60px] bg-[var(--bg-2)] px-3">
      <div className="container">
        <div className="flex justify-between items-center mb-10">
          <h2 className="h2 mt-4">المشاريع المفضلة</h2>
          <div className="text-gray-600 text-sm">
            عرض {favorites.length} من أصل {totalFavorites} عقار
            {currentPage > 1 && ` - الصفحة ${currentPage} من ${totalPages}`}
          </div>
        </div>

        <ListProperty
          flag={flag}
          setFlag={setFlag}
          properties={favorites}
          max={itemsPerPage}
        />

        {totalPages > 1 && (
          <PropertyPagination
            pageCount={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
