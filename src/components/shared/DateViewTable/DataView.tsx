"use client";
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
    currentPage?: number;
    perPage?: number;
    totalRecords?: number;
  }>;
  onDataUpdate?: (data: TableRow<T>[], filters: Record<string, any>) => void;
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
  onDataUpdate,
}: DataViewProps<T>) {
  const searchParams = useSearchParams();
  const [rows, setRows] = useState<TableRow<T>[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(pageSize);
  const [error, setError] = useState<string | null>(null);
  const [currentFilters, setCurrentFilters] = useState<Record<string, any>>({});

  useEffect(() => {
    const controller = new AbortController();
    fetchRows(controller.signal);
    return () => controller.abort();
  }, [getRows, searchParams]); // Add searchParams to dependency array

  const fetchRows = async (signal?: AbortSignal) => {
    setIsLoading(true);
    try {
      const result = await getRows(signal);
      // Extract data from API response
      const {
        rows: dataRows,
        error: dataError,
        totalCount,
        totalRecords: apiTotalRecords,
        currentPage: apiCurrentPage,
        perPage: apiPerPage,
      } = result;

      // Use API-provided pagination data or fallback to calculated values
      setTotalRecords(apiTotalRecords || apiTotalRecords || totalCount || 0);
      setCurrentPage(
        apiCurrentPage || parseInt(searchParams.get("page") || "1")
      );
      setPerPage(apiPerPage || pageSize);
      setError(dataError ? dataError.message : null);
      setRows(dataRows);

      // Call onDataUpdate when data is successfully fetched
      if (onDataUpdate && dataRows) {
        onDataUpdate(dataRows, currentFilters);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch data");
      setRows([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: Record<string, any>) => {
    setCurrentFilters(newFilters);
  };

  // Calculate page count based on API data
  const pageCount = Math.ceil(totalRecords / perPage);
  console.log(pageCount);
  console.log(totalRecords);
  console.log(perPage);
  return (
    <>
      <FilterContainer
        filters={filters}
        showSearch={showSearch}
        showSort={showSort}
        searchPlaceholder={searchPlaceholder}
        sortConfig={sortConfig}
        onFilterChange={handleFilterChange}
      />

      {isLoading ? (
        <TableSkeleton columns={columns} rowCount={perPage} />
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

      {totalRecords > 0 && (
        <PropertyPagination
          pageCount={pageCount}
          currentPage={currentPage}
          totalRecords={totalRecords}
          perPage={perPage}
        />
      )}
    </>
  );
}
