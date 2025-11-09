// components/main/projects/PropertiesDataView.tsx
"use client";

import ProjectsFilterPanel from "./ProjectsFilterPanel";
import PropertyCardsDisplay from "./PropertyCardsDisplay";
import PropertyPagination from "./PropertyPagination";
import PropertyToolbar from "./PropertyToolbar";
import useProperties from "@/hooks/dashboard/admin/properties/useProperties";

export default function PropertiesDataView({
  isAdmin = false,
}: {
  isAdmin?: boolean;
}) {
  const { data, totalCount, currentPage, pageCount, loading } = useProperties();

  const shownCount = data?.length || 0;
  const totalRecords = totalCount || 0;

  return (
    <div className="container">
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        <div className="flex-1">
          <ProjectsFilterPanel />
        </div>
        <div className="flex-2">
          <div className="grid grid-cols-12 gap-4 xl:gap-6">
            <div className="col-span-12">
              <PropertyToolbar total={totalRecords} shown={shownCount} />
            </div>
            <div className="col-span-12 space-y-4 xl:space-y-6">
              <PropertyCardsDisplay
                isAdmin={isAdmin}
                data={data}
                loading={loading}
              />
              {!loading && totalRecords > 0 && pageCount > 1 && (
                <PropertyPagination
                  pageCount={pageCount}
                  currentPage={currentPage}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
