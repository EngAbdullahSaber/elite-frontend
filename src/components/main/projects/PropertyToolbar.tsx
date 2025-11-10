"use client";

import React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import SortSelect from "@/components/shared/SortSelect";

const sortOptions = [
  { value: "latest", label: "الأحدث" },
  { value: "price-low", label: "السعر: الأقل أولاً" },
  { value: "price-high", label: "السعر: الأعلى أولاً" },
  { value: "area", label: "المساحة" },
];

interface PropertyToolbarProps {
  total: number;
  shown: number;
}

export default function PropertyToolbar({
  total,
  shown,
}: PropertyToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentView = searchParams.get("view") || "grid";
  const currentSort = searchParams.get("sort") || sortOptions[0]?.value || "";

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleViewChange = (view: "grid" | "list") => {
    updateParam("view", view);
  };

  const handleSortChange = (value: string) => {
    updateParam("sort", value);
  };

  return (
    <div className="bg-white rounded-xl py-4 px-5 shadow-md w-full">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Result Count */}
        <p className="text-sm font-medium text-[var(--neutral-500)]">
          عرض {shown} من أصل {total} نتيجة
        </p>

        {/* View Mode + Sort */}
        <div className="flex flex-1 flex-col md:flex-row items-center gap-4 w-full sm:w-auto justify-between ">
          {/* View Mode */}
          <div className="flex gap-3">
            {/* <button
                            onClick={() => handleViewChange('grid')}
                            className={`flex items-center gap-2 px-3 py-1 rounded-md transition ${currentView === 'grid'
                                ? 'bg-[var(--primary-light)] text-primary font-semibold'
                                : 'text-[var(--neutral-500)] hover:text-primary'
                                }`}
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                            </svg>
                            <span>شبكة</span>
                        </button>

                        <button
                            onClick={() => handleViewChange('list')}
                            className={`flex items-center gap-2 px-3 py-1 rounded-md transition ${currentView === 'list'
                                ? 'bg-[var(--primary-light)] text-primary font-semibold'
                                : 'text-[var(--neutral-500)] hover:text-primary'
                                }`}
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                            <span>قائمة</span>
                        </button> */}
          </div>

          {/* Sort Dropdown */}
          <div className="flex-grow sm:max-w-[240px]">
            <SortSelect
              options={sortOptions}
              value={currentSort}
              onChange={handleSortChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
