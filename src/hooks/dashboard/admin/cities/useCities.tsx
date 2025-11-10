// hooks/dashboard/admin/cities/useCities.ts
"use client";

import { CityRow } from "@/types/dashboard/city";
import { useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { getCitiesWithRegionsCount } from "@/services/cities/cities";

export function useCities() {
  const searchParams = useSearchParams();

  return useCallback(
    async (
      _signal?: AbortSignal
    ): Promise<{
      rows: CityRow[];
      error?: Error | null;
      totalCount?: number;
    }> => {
      try {
        // Extract filter parameters from URL
        const search = searchParams.get("search") || "";
        const status = searchParams.get("status") || "";

        // Prepare filter parameters for API
        const filters: Record<string, string> = {};
        if (search) filters.search = search;
        if (status) filters.status = status;

        // Get cities with areas count AND filters
        const response = await getCitiesWithRegionsCount(_signal, filters);

        const rows: CityRow[] = response.records.map((city: any) => ({
          id: city.id,
          name: city.name,
          regionsCount: city.areasCount,
          isActive: city.isActive,
          createdAt: city.createdAt,
        }));

        // Apply client-side sorting (if needed, otherwise handle on server)
        const sort = searchParams.get("sort");
        const dir = searchParams.get("dir");

        let sortedRows = rows;

        if (sort) {
          const direction = dir === "desc" ? -1 : 1;
          sortedRows = [...rows].sort((a, b) => {
            if (sort === "name") {
              return a.name.localeCompare(b.name, "ar") * direction;
            }
            if (sort === "regionsCount") {
              return (a.regionsCount - b.regionsCount) * direction;
            }
            if (sort === "id") {
              return (a.id - b.id) * direction;
            }
            if (sort === "isActive") {
              return ((a.isActive ? 1 : 0) - (b.isActive ? 1 : 0)) * direction;
            }
            return 0;
          });
        }

        return {
          rows: sortedRows,
          totalCount: response.total_records,
          error: null,
        };
      } catch (err: any) {
        console.error("Error fetching cities:", err);
        return {
          rows: [],
          totalCount: 0,
          error: err,
        };
      }
    },
    [searchParams]
  );
}
