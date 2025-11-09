"use client";
import DashboardHeaderTitle from "@/components/dashboard/DashboardHeaderTitle";
import { BiPlus } from "react-icons/bi";
import Link from "next/link";
import PropertySubmissionsDataView from "@/components/dashboard/admin/propertySubmissions/PropertySubmissionsDataView";
import { useState, useCallback } from "react";
import { propertySubmissionRow } from "@/types/dashboard/property-submissions";
import StandaloneDownloadContent from "@/components/shared/StandaloneDownloadContent";

export default function PropertySubmissionsPage() {
  const [currentData, setCurrentData] = useState<propertySubmissionRow[]>([]);
  const [currentFilters, setCurrentFilters] = useState<Record<string, any>>({});

  const handleDataUpdate = (
    data: propertySubmissionRow[],
    filters: Record<string, any>
  ) => {
    setCurrentData(data);
    setCurrentFilters(filters);
  };

  return (
    <div>
      <DashboardHeaderTitle path={["طلبات عرض العقار"]}>
        <div className="flex gap-4 flex-wrap">
          <StandaloneDownloadContent
            module="property_listing_request"
            currentData={currentData}
            filters={currentFilters}
          />
          <Link className="btn-primary" href="/add-property">
            <BiPlus /> إضافة طلب عرض عقار
          </Link>
        </div>
      </DashboardHeaderTitle>

      <section className="p-3 md:py-6 lg:py-8 md:px-8 lg:px-10 border rounded-2xl bg-white relative z-[1]">
        <PropertySubmissionsDataView onDataUpdate={handleDataUpdate} />
      </section>
    </div>
  );
}
