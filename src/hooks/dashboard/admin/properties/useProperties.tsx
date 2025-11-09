// hooks/dashboard/admin/properties/useProperties.ts
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getProperties,
  PropertyFilterParams,
  Property,
  PropertiesResponse,
} from "@/services/properties/properties";

export default function useProperties() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<Property[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [pageCount, setPageCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Extract all filter parameters from URL
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("perPage") || "12", 10);
        const search = searchParams.get("search") || undefined;
        const type = searchParams.get("type") || undefined;
        const city = searchParams.get("city") || undefined;
        const priceMin = searchParams.get("priceMin")
          ? parseInt(searchParams.get("priceMin")!)
          : undefined;
        const priceMax = searchParams.get("priceMax")
          ? parseInt(searchParams.get("priceMax")!)
          : undefined;

        // Build filter parameters for API
        const filterParams: PropertyFilterParams = {
          page,
          limit,
          search,
          type,
          city,
          priceMin,
          priceMax,
          // Add other filters as needed
        };

        const response: PropertiesResponse = await getProperties(
          filterParams,
          signal
        );

        if (signal.aborted) return;

        setData(response.records);
        setTotalCount(response.total_records);
        setCurrentPage(response.current_page);
        setPerPage(response.per_page);
        setPageCount(response.total_pages);
      } catch (err: any) {
        if (err.name === "AbortError" || signal.aborted) {
          return;
        }

        console.error("Error fetching properties:", err);
        setError(
          err instanceof Error ? err : new Error("فشل في جلب بيانات العقارات")
        );
        setData([]);
        setTotalCount(0);
        setPageCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [searchParams]);

  return {
    data,
    totalCount,
    currentPage,
    perPage,
    pageCount,
    loading,
    error,
  };
}
