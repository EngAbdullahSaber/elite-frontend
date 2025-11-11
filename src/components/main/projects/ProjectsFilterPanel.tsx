// components/main/projects/ProjectsFilterPanel.tsx
"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SelectInput from "@/components/shared/Forms/SelectInput";
import PriceRangeSlider from "@/components/shared/PriceRangeSlider";
import ResetFiltersButton from "@/components/shared/ResetFiltersButton";
import { useDebounce } from "@/hooks/useDebounce";
import SearchField from "@/components/shared/Forms/SearchField";
import { useCities } from "@/hooks/dashboard/admin/cities/useCities";

type PriceRange = { min: number; max: number };
type Filters = {
  search: string;
  type: string;
  city: string;
  priceRange: PriceRange;
  [key: string]: any;
};

type CityOption = {
  value: string;
  label: string;
};

export default function ProjectsFilterPanel({
  defaultPriceRange = { min: 0, max: 100000000000 },
}: {
  defaultPriceRange?: PriceRange;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const citiesHook = useCities();

  // State for cities data
  const [cities, setCities] = useState<CityOption[]>([]);
  const [loadingCities, setLoadingCities] = useState(true);

  // Initialize state from URL parameters
  const [filters, setFilters] = useState<Filters>(() => {
    const params = new URLSearchParams(searchParams.toString());
    return {
      search: params.get("search") ?? "",
      type: params.get("type") ?? "",
      city: params.get("city") ?? "",
      priceRange: {
        min: Number(searchParams.get("priceMin")) || defaultPriceRange.min,
        max: Number(searchParams.get("priceMax")) || defaultPriceRange.max,
      },
    };
  });

  // Fetch cities data on component mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoadingCities(true);
        const result = await citiesHook();

        if (result.rows && result.rows.length > 0) {
          const cityOptions: CityOption[] = [
            { value: "", label: "جميع المدن" },
            ...result.rows
              .filter((city) => city.isActive) // Only show active cities
              .map((city) => ({
                value: city.id.toString(),
                label: city.name,
              })),
          ];
          setCities(cityOptions);
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
        // Fallback to empty cities array
        setCities([{ value: "", label: "جميع المدن" }]);
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, [citiesHook]);

  // Debounced values for better performance
  const debouncedSearch = useDebounce(filters.search, 500);
  const debouncedPriceRange = useDebounce(filters.priceRange, 500);

  // Update URL when search changes
  useEffect(() => {
    updateQuery("search", debouncedSearch);
  }, [debouncedSearch]);

  // Update URL when price range changes
  useEffect(() => {
    handlePriceChange(debouncedPriceRange);
  }, [debouncedPriceRange]);

  const updateQuery = (key: string, value: string | number | undefined) => {
    const params = new URLSearchParams(searchParams.toString());

    // Remove page parameter when filters change
    if (key !== "page") {
      params.delete("page");
    }

    if (value !== undefined && value !== "") {
      params.set(key, value.toString());
    } else {
      params.delete(key);
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handlePriceChange = (priceRange: PriceRange) => {
    const params = new URLSearchParams(searchParams.toString());

    // Remove page parameter when price changes
    params.delete("page");

    if (
      priceRange.min === defaultPriceRange.min &&
      priceRange.max === defaultPriceRange.max
    ) {
      params.delete("priceMin");
      params.delete("priceMax");
    } else {
      params.set("priceMin", priceRange.min.toString());
      params.set("priceMax", priceRange.max.toString());
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));

    // Update URL immediately for select filters
    if (key !== "search") {
      updateQuery(key, value);
    }
  };

  const handlePriceSliderChange = (value: number[]) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: {
        min: value[0],
        max: value[1],
      },
    }));
  };

  const handleReset = () => {
    // Create empty URLSearchParams to remove all query parameters
    const params = new URLSearchParams();

    // Navigate to the base URL without any query parameters
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });

    // Reset all filters to their default values
    setFilters({
      search: "",
      type: "",
      city: "",
      priceRange: defaultPriceRange,
    });
  };

  const hasActiveFilters = () => {
    return (
      filters.search !== "" ||
      filters.type !== "" ||
      filters.city !== "" ||
      filters.priceRange.min !== defaultPriceRange.min ||
      filters.priceRange.max !== defaultPriceRange.max
    );
  };

  // Property type options (you might want to fetch these from an API too)
  const propertyTypeOptions = [
    { value: "", label: "جميع أنواع العقارات" },
    { value: "apartments", label: "شقة" },
    { value: "villas", label: "فيلا" },
    { value: "residential-land", label: "اراضى سكنية" },
    { value: "commercial-land", label: "اراضى تجارية" },
    { value: "offices", label: "مكاتب إدارية" },
  ];

  return (
    <div className="sticky top-24 p-4 lg:py-6 lg:px-8 bg-white rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-2xl font-semibold">فلترة</h4>
        {hasActiveFilters() && <ResetFiltersButton onClick={handleReset} />}
      </div>

      <div className="border-b border-dashed my-6 opacity-50" />

      <SearchField
        value={filters.search}
        onChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
        placeholder="ابحث في العقارات..."
      />

      <div className="border-t border-dashed my-6" />

      <ul className="flex flex-col gap-4">
        <li>
          <SelectInput
            label="نوع العقار"
            name="type"
            value={filters.type}
            onChange={(val) => handleFilterChange("type", val)}
            options={propertyTypeOptions}
          />
        </li>
        <li>
          <SelectInput
            label="المدينة"
            name="city"
            value={filters.city}
            onChange={(val) => handleFilterChange("city", val)}
            options={
              loadingCities ? [{ value: "", label: "جاري التحميل..." }] : cities
            }
            disabled={loadingCities}
          />
          {loadingCities && (
            <p className="text-xs text-gray-500 mt-1">جاري تحميل المدن...</p>
          )}
        </li>
      </ul>

      <div className="border-t border-dashed my-6" />

      <div className="mb-4">
        <p className="text-[var(--neutral-700)] text-xl font-medium mb-2">
          نطاق السعر
        </p>
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>{filters.priceRange.min.toLocaleString()} ر.س</span>
          <span>{filters.priceRange.max.toLocaleString()} ر.س</span>
        </div>
      </div>

      <PriceRangeSlider
        value={[filters.priceRange.min, filters.priceRange.max]}
        onChange={handlePriceSliderChange}
        min={defaultPriceRange.min}
        max={defaultPriceRange.max}
        step={10000}
      />

      <div className="border-t border-dashed my-6" />

      {/* Only show the bottom reset button if there are active filters */}
      {hasActiveFilters() && (
        <div className="mt-4">
          <ResetFiltersButton onClick={handleReset} />
        </div>
      )}
    </div>
  );
}
