// components/main/projects/PropertyPagination.tsx
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface PropertyPaginationProps {
  pageCount: number;
  currentPage: number;
  totalRecords: number;
  perPage: number;
}

export default function PropertyPagination({
  pageCount,
  currentPage,
  totalRecords,
  perPage,
}: PropertyPaginationProps) {
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `?${params.toString()}`;
  };

  if (pageCount <= 1) return null;

  // Calculate visible page numbers
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(pageCount - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < pageCount - 1) {
      rangeWithDots.push("...", pageCount);
    } else {
      rangeWithDots.push(pageCount);
    }

    return rangeWithDots;
  };

  // Calculate start and end entries for display
  const startEntry = (currentPage - 1) * perPage + 1;
  const endEntry = Math.min(currentPage * perPage, totalRecords);

  return (
    <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mt-8">
      {/* Entry Count */}
      <div className="text-sm text-gray-500 order-2 lg:order-1">
        عرض {startEntry} إلى {endEntry} من أصل {totalRecords} عنصر
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-2 order-1 lg:order-2">
        {/* Previous Button */}
        <Link
          href={createPageURL(Math.max(1, currentPage - 1))}
          className={`px-4 py-2 border rounded hover:bg-gray-50 transition-colors ${
            currentPage === 1
              ? "opacity-50 cursor-not-allowed pointer-events-none"
              : ""
          }`}
        >
          السابق
        </Link>

        {/* Page Numbers */}
        {getVisiblePages().map((page, index) =>
          page === "..." ? (
            <span key={`dots-${index}`} className="px-3 py-2">
              ...
            </span>
          ) : (
            <Link
              key={page}
              href={createPageURL(page as number)}
              className={`px-4 py-2 border rounded transition-colors min-w-[44px] text-center ${
                currentPage === page
                  ? "bg-blue-500 text-white border-blue-500"
                  : "hover:bg-gray-50"
              }`}
            >
              {page}
            </Link>
          )
        )}

        {/* Next Button */}
        <Link
          href={createPageURL(Math.min(pageCount, currentPage + 1))}
          className={`px-4 py-2 border rounded hover:bg-gray-50 transition-colors ${
            currentPage === pageCount
              ? "opacity-50 cursor-not-allowed pointer-events-none"
              : ""
          }`}
        >
          التالي
        </Link>
      </div>
    </div>
  );
}
