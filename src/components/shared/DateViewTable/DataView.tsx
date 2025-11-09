"use client";
/**
 * 📊 DataView Component
 *
 * A generic table wrapper that handles:
 * - Fetching paginated data using the `getRows` function
 * - Displaying filters, search, and sort controls via `FilterContainer`
 * - Rendering loading skeletons, error states, and the final table
 * - Managing pagination and showing entry count summary
 *
 * This component is designed to be reusable across different data types by leveraging generics (`<T>`).
 */
import { useSearchParams } from "next/navigation";
import {
  FilterConfig,
  SortConfig,
  TableColumn,
  TableRow,
} from "@/types/components/Table";
import TableSkeleton from "./TableSkeleton";
import PropertyPagination from "../../main/projects/PropertyPagination";
import FilterContainer from "./FilterContainer";
import { MenuActionItem } from "../Header/MenuActionList";
import { useEffect, useState } from "react";
import Table from "./Table";
import TableError from "./TableError";

type DataViewProps<T = Record<string, any>> = {
  columns: TableColumn<T>[];
  filters?: FilterConfig[];
  sortConfig: SortConfig;
  showSearch?: boolean;
  searchPlaceholder?: string;
  showSort?: boolean;
  actionsMenuItems?: (row: T, onClose?: () => void) => MenuActionItem[];
  showActions?: boolean;
  pageSize?: number;
  getRows: (signal?: AbortSignal) => Promise<{
    rows: TableRow<T>[];
    error?: Error | null;
    totalCount?: number;
  }>;
  onDataUpdate?: (data: TableRow<T>[], filters: Record<string, any>) => void; // Add this prop
};

export default function DataView<T = Record<string, any>>({
  columns,
  filters = [],
  sortConfig,
  showSearch = true,
  searchPlaceholder,
  showSort = true,
  actionsMenuItems,
  showActions = false,
  pageSize = 10,
  getRows,
  onDataUpdate, // Add this prop
}: DataViewProps<T>) {
  const searchParams = useSearchParams();
  const [rows, setRows] = useState<TableRow<T>[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [totalRowsCount, setTotalRowsCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [currentFilters, setCurrentFilters] = useState<Record<string, any>>({});

  useEffect(() => {
    const controller = new AbortController();
    fetchRows(controller.signal);
    return () => controller.abort();
  }, [getRows]);

  const fetchRows = async (signal?: AbortSignal) => {
    setIsLoading(true);
    try {
      const { rows, error, totalCount } = await getRows(signal);
      setTotalRowsCount(totalCount ?? 0);
      setError(error ? error.message : null);
      setRows(rows);

      // Call onDataUpdate when data is successfully fetched
      if (onDataUpdate && rows) {
        console.log("Calling onDataUpdate with:", rows.length, "rows");
        onDataUpdate(rows, currentFilters);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle filter changes and update current filters
  const handleFilterChange = (newFilters: Record<string, any>) => {
    setCurrentFilters(newFilters);
    // You might want to refetch data here based on new filters
  };

  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;

  const startEntry = (currentPage - 1) * pageSize + 1;
  const endEntry = Math.min(currentPage * pageSize, totalRowsCount);
  const pageCount = Math.ceil(totalRowsCount / pageSize);

  return (
    <>
      <FilterContainer
        filters={filters}
        showSearch={showSearch}
        showSort={showSort}
        searchPlaceholder={searchPlaceholder}
        sortConfig={sortConfig}
        onFilterChange={handleFilterChange} // Pass filter change handler
      />

      {isLoading ? (
        <TableSkeleton columns={columns} rowCount={pageSize} />
      ) : error ? (
        <TableError message={error} onRetry={fetchRows} />
      ) : (
        <Table<T>
          columns={columns}
          rows={rows ?? []}
          showActions={showActions}
          actionsMenuItems={actionsMenuItems}
        />
      )}

      {totalRowsCount > 0 && (
        <div className="flex justify-between items-center gap-3 pt-5 lg:pt-7 flex-wrap">
          <PropertyPagination pageCount={pageCount} />
          <span className="text-sm text-gray-500 mr-auto">
            Showing {startEntry} to {endEntry} of {totalRowsCount} entries
          </span>
        </div>
      )}
    </>
  );
}
