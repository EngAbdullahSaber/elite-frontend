"use client";
import AppointmentsDataView from "@/components/dashboard/appointments/AppointmentsDataView";
import DashboardHeaderTitle from "@/components/dashboard/DashboardHeaderTitle";
import DownloadList from "@/components/shared/DownloadContent";
import StandaloneDownloadContent from "@/components/shared/StandaloneDownloadContent";
import Link from "next/link";
import { useState } from "react";
import { BiPlus } from "react-icons/bi";

export default function AppointmentsPage() {
  const [currentData, setCurrentData] = useState<any[]>([]);
  const [currentFilters, setCurrentFilters] = useState<Record<string, any>>({});

  const handleDataUpdate = (data: any[], filters: Record<string, any>) => {
    setCurrentData(data);
    setCurrentFilters(filters);
  };

  return (
    <div>
      <DashboardHeaderTitle path={["المواعيد"]}>
        <div className="flex gap-4 flex-wrap">
          <StandaloneDownloadContent
            module="appointment"
            currentData={currentData}
            filters={currentFilters}
          />{" "}
          <Link
            className="btn-primary"
            href="/dashboard/admin/appointments/add"
          >
            <BiPlus /> إضافة موعد
          </Link>
        </div>
      </DashboardHeaderTitle>

      <section className="p-3 md:py-6 lg:py-8 md:px-8 lg:px-10 border rounded-2xl bg-white relative z-[1]">
        <AppointmentsDataView onDataUpdate={handleDataUpdate} />
      </section>
    </div>
  );
}
