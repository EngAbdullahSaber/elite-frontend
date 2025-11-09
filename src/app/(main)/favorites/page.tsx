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
    // ... other user fields
  };
  property: Property;
}

interface FavoritesResponse {
  total_records: number;
  current_page: number;
  per_page: number;
  records: FavoriteRecord[];
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalFavorites, setTotalFavorites] = useState(0);

  const itemsPerPage = 8; // Match your max prop

  useEffect(() => {
    fetchFavorites();
  }, [currentPage]); // Refetch when page changes

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);

      const response: FavoritesResponse = await getFavorites({
        page: currentPage,
        limit: itemsPerPage,
        sortBy: "createdAt",
        sortOrder: "DESC",
      });

      console.log("Favorites API Response:", response); // Debug log

      // Extract properties from favorites
      const favoriteProperties = response.records.map(
        (record) => record.property
      );

      setFavorites(favoriteProperties);
      setTotalPages(Math.ceil(response.total_records / response.per_page));
      setTotalFavorites(response.total_records);
    } catch (err) {
      console.error("Error fetching favorites:", err);
      setError("فشل في تحميل العقارات المفضلة");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Optional: Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
            <button
              onClick={fetchFavorites}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              إعادة المحاولة
            </button>
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
              href="/properties"
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
          </div>
        </div>

        <ListProperty properties={favorites} max={itemsPerPage} />

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
