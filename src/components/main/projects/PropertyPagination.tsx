// components/main/projects/PropertyPagination.tsx
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { use } from "react";

interface PropertyPaginationProps {
  pageCount: number;
  currentPage: number;
}

export default function PropertyPagination({
  pageCount,
  currentPage,
}: PropertyPaginationProps) {
  const searchParams = use SearchParams();

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
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < pageCount - 1) {
      rangeWithDots.push('...', pageCount);
    } else {
      rangeWithDots.push(pageCount);
    }

    return rangeWithDots;
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      {/* Previous Button */}
      <Link
        href={createPageURL(Math.max(1, currentPage - 1))}
        className={`px-4 py-2 border rounded hover:bg-gray-50 transition-colors ${
          currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={(e) => currentPage === 1 && e.preventDefault()}
      >
        السابق
      </Link>

      {/* Page Numbers */}
      {getVisiblePages().map((page, index) =>
        page === '...' ? (
          <span key={`dots-${index}`} className="px-3 py-2">
            ...
          </span>
        ) : (
          <Link
            key={page}
            href={createPageURL(page as number)}
            className={`px-4 py-2 border rounded transition-colors ${
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
          currentPage === pageCount ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={(e) => currentPage === pageCount && e.preventDefault()}
      >
        التالي
      </Link>
    </div>
  );
}