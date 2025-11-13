"use client";

import { Control, Controller } from "react-hook-form";
import { PropertyFormValues } from "../PropertyForm";
import Card from "@/components/shared/Card";
import TextInput from "@/components/shared/Forms/TextInput";
import SelectDropdown from "@/components/shared/Forms/SelectDropdown";
import { accessTypeLabels, propertyTypeLabels } from "@/types/property";
import TextareaInput from "@/components/shared/Forms/TextareaInput";
import PriceInput from "@/components/shared/Forms/PriceInput";
import { useEffect, useState, useCallback } from "react";
import { getCities, getRegions } from "@/services/cities/cities";
import UserChangerPagination from "../../UserChangerPagination";

interface City {
  id: string;
  name: string;
}

interface Area {
  id: string;
  name: string;
  cityId?: string;
}

interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  hasNextPage: boolean;
}

export default function GeneralInfoSection({
  control,
}: {
  control: Control<PropertyFormValues>;
}) {
  const [cities, setCities] = useState<City[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [areasLoading, setAreasLoading] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState<string>("");

  // City pagination state
  const [citySearch, setCitySearch] = useState("");
  const [cityPagination, setCityPagination] = useState<PaginationMeta>({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    hasNextPage: false,
  });

  // Area pagination state
  const [areaSearch, setAreaSearch] = useState("");
  const [areaPagination, setAreaPagination] = useState<PaginationMeta>({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    hasNextPage: false,
  });

  // Fetch cities with search and pagination
  const fetchCities = useCallback(
    async (page: number = 1, search: string = "", reset: boolean = false) => {
      setCitiesLoading(true);
      try {
        const params: Record<string, string> = {
          page: page.toString(),
          limit: "5",
        };

        if (search) {
          params.search = search;
        }

        const response = await getCities(params);
        const citiesData = response.records || [];
        const paginationData = response;

        // Calculate hasNextPage based on current page and total records
        const totalPages = Math.ceil(
          paginationData.total_records / parseInt(params.limit)
        );
        const hasNextPage = page < totalPages;

        setCities((prev) => (reset ? citiesData : [...prev, ...citiesData]));
        setCityPagination({
          currentPage: paginationData.current_page || page,
          totalPages: totalPages,
          totalRecords: paginationData.total_records || 0,
          hasNextPage: hasNextPage,
        });
      } catch (error) {
        console.error("Error fetching cities:", error);
      } finally {
        setCitiesLoading(false);
      }
    },
    []
  );

  // Fetch areas with search and pagination
  const fetchAreas = useCallback(
    async (page: number = 1, search: string = "", reset: boolean = false) => {
      if (!selectedCityId) return;

      setAreasLoading(true);
      try {
        const params: Record<string, string> = {
          page: page.toString(),
          limit: "5",
          cityId: selectedCityId,
        };

        if (search) {
          params.search = search;
        }

        const response = await getRegions(params);
        const areasData = response.records || [];
        const paginationData = response;

        // Calculate hasNextPage based on current page and total records
        const totalPages = Math.ceil(
          paginationData.total_records / parseInt(params.limit)
        );
        const hasNextPage = page < totalPages;

        setAreas((prev) => (reset ? areasData : [...prev, ...areasData]));
        setAreaPagination({
          currentPage: paginationData.current_page || page,
          totalPages: totalPages,
          totalRecords: paginationData.total_records || 0,
          hasNextPage: hasNextPage,
        });
      } catch (error) {
        console.error("Error fetching areas:", error);
      } finally {
        setAreasLoading(false);
      }
    },
    [selectedCityId]
  );

  // Initial cities fetch
  useEffect(() => {
    fetchCities(1, "", true);
  }, [fetchCities]);

  // Fetch areas when city is selected
  useEffect(() => {
    if (selectedCityId) {
      setAreaSearch("");
      setAreaPagination({
        currentPage: 1,
        totalPages: 1,
        totalRecords: 0,
        hasNextPage: false,
      });
      fetchAreas(1, "", true);
    } else {
      setAreas([]);
    }
  }, [selectedCityId, fetchAreas]);

  // Handle city search
  const handleCitySearch = (search: string) => {
    setCitySearch(search);
    fetchCities(1, search, true);
  };

  // Handle area search
  const handleAreaSearch = (search: string) => {
    setAreaSearch(search);
    fetchAreas(1, search, true);
  };

  // Handle city pagination
  const handleCityLoadMore = () => {
    if (cityPagination.hasNextPage && !citiesLoading) {
      fetchCities(cityPagination.currentPage + 1, citySearch, false);
    }
  };

  // Handle area pagination
  const handleAreaLoadMore = () => {
    if (areaPagination.hasNextPage && !areasLoading && selectedCityId) {
      fetchAreas(areaPagination.currentPage + 1, areaSearch, false);
    }
  };

  const handleCityChange = (city: City | undefined) => {
    if (city) {
      setSelectedCityId(city.id);
      setAreas([]);
      setAreaSearch("");
    } else {
      setSelectedCityId("");
      setAreas([]);
      setAreaSearch("");
    }
  };

  const handleAreaChange = (area: Area | undefined) => {
    // This will be handled by the form control
  };

  // Format cities for UserChangerPagination
  const formatCities = (cities: City[]) =>
    cities.map((city) => ({
      id: parseInt(city.id),
      name: city.name,
      email: "", // You might want to add additional fields if needed
      image: undefined,
    }));

  // Format areas for UserChangerPagination
  const formatAreas = (areas: Area[]) =>
    areas.map((area) => ({
      id: parseInt(area.id),
      name: area.name,
      email: "", // You might want to add additional fields if needed
      image: undefined,
    }));

  // Get selected city object
  const getSelectedCity = () => {
    if (!selectedCityId) return undefined;
    return cities.find((city) => city.id === selectedCityId);
  };

  return (
    <Card title="المعلومات العامة">
      <div className="grid grid-cols-12 gap-6">
        {/* العنوان */}
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <TextInput
              id="title"
              label="اسم العقار"
              placeholder="اكتب اسم العقار"
              {...field}
            />
          )}
        />

        {/* نوع العقار */}
        <Controller
          name="propertyType"
          control={control}
          render={({ field }) => (
            <div className="col-span-12">
              <label
                htmlFor="propertyType"
                className="text-xl font-medium block mb-3"
              >
                نوع العقار
              </label>
              <SelectDropdown
                value={field.value}
                onChange={field.onChange}
                options={Object.entries(propertyTypeLabels).map(
                  ([value, label]) => ({
                    value,
                    label,
                  })
                )}
              />
            </div>
          )}
        />

        {/* نوع الوصول */}
        <Controller
          name="accessType"
          control={control}
          defaultValue="mediated" // القيمة الافتراضية
          render={({ field }) => (
            <div className="col-span-12">
              <label
                htmlFor="accessType"
                className="text-xl font-medium block mb-3"
              >
                نوع الوصول
              </label>
              <SelectDropdown
                value={field.value}
                onChange={field.onChange}
                options={Object.entries(accessTypeLabels).map(
                  ([value, label]) => ({
                    value,
                    label,
                  })
                )}
              />
            </div>
          )}
        />

        {/* المدينة */}
        <div className="col-span-12 md:col-span-6">
          <label className="text-lg font-medium block mb-3">المدينة</label>
          <Controller
            name="cityId"
            control={control}
            render={({ field }) => (
              <UserChangerPagination
                users={formatCities(cities)}
                initialUserId={field.value ? parseInt(field.value) : undefined}
                label="المدينة"
                onChange={(city) => {
                  if (city) {
                    field.onChange(city.id.toString());
                    handleCityChange({
                      id: city.id.toString(),
                      name: city.name,
                    });
                  } else {
                    field.onChange("");
                    handleCityChange(undefined);
                  }
                }}
                hasMore={cityPagination.hasNextPage}
                onLoadMore={handleCityLoadMore}
                loadingMore={citiesLoading}
                onSearch={handleCitySearch}
              />
            )}
          />
          <p className="text-sm text-gray-500 mt-1">
            اختر المدينة التي يقع فيها العقار
          </p>
        </div>

        {/* المنطقة */}
        <div className="col-span-12 md:col-span-6">
          <label className="text-lg font-medium block mb-3">المنطقة</label>
          <Controller
            name="areaId"
            control={control}
            render={({ field }) => (
              <UserChangerPagination
                users={formatAreas(areas)}
                initialUserId={field.value ? parseInt(field.value) : undefined}
                label="المنطقة"
                onChange={(area) => {
                  if (area) {
                    field.onChange(area.id.toString());
                  } else {
                    field.onChange("");
                  }
                }}
                disabled={!selectedCityId}
                hasMore={areaPagination.hasNextPage}
                onLoadMore={handleAreaLoadMore}
                loadingMore={areasLoading}
                onSearch={handleAreaSearch}
              />
            )}
          />
          <p className="text-sm text-gray-500 mt-1">
            {selectedCityId ? "اختر المنطقة" : "يجب اختيار المدينة أولاً"}
          </p>
        </div>

        <PriceInput<PropertyFormValues> control={control} name="price" />

        {/* عدد الغرف */}
        <Controller
          name="rooms"
          control={control}
          render={({ field }) => (
            <TextInput
              id="rooms"
              label="عدد الغرف"
              type="number"
              placeholder="أدخل عدد الغرف"
              {...field}
            />
          )}
        />

        {/* عدد الحمامات */}
        <Controller
          name="bathrooms"
          control={control}
          render={({ field }) => (
            <TextInput
              id="bathrooms"
              label="عدد الحمامات"
              type="number"
              placeholder="أدخل عدد الحمامات"
              {...field}
            />
          )}
        />

        {/* المساحة بالمتر المربع */}
        <Controller
          name="area"
          control={control}
          render={({ field }) => (
            <TextInput
              id="area"
              label="المساحة (م²)"
              type="number"
              placeholder="أدخل المساحة بالمتر المربع"
              {...field}
            />
          )}
        />

        {/* الوصف */}
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextareaInput
              id="description"
              label="الوصف"
              placeholder="اكتب وصف العقار..."
              {...field}
            />
          )}
        />
      </div>
    </Card>
  );
}
