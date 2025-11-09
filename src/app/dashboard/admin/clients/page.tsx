"use client";
import DashboardHeaderTitle from "@/components/dashboard/DashboardHeaderTitle";
import DownloadList from "@/components/shared/DownloadContent";
import Link from "next/link";
import { BiEditAlt } from "react-icons/bi";
import ClientsDataView from "@/components/dashboard/Clients/ClientsDataView";
import DashboardSectionCard from "@/components/dashboard/DashboardSectionCard";
import { useState } from "react";
import StandaloneDownloadContent from "@/components/shared/StandaloneDownloadContent";

export default function ClientsPage() {
  const [currentData, setCurrentData] = useState<any[]>([]);
  const [currentFilters, setCurrentFilters] = useState<Record<string, any>>({});

  const handleDataUpdate = (data: any[], filters: Record<string, any>) => {
    setCurrentData(data);
    setCurrentFilters(filters);
  };

  return (
    <div>
      <DashboardHeaderTitle path={["العملاء"]}>
        <div className="flex gap-4 flex-wrap">
          <StandaloneDownloadContent
            module="user"
            currentData={currentData}
            filters={currentFilters}
          />{" "}
          <Link className="btn-primary" href="/dashboard/admin/clients/add">
            <BiEditAlt /> إضافة عميل{" "}
          </Link>
        </div>
      </DashboardHeaderTitle>
      <DashboardSectionCard>
        <ClientsDataView onDataUpdate={handleDataUpdate} />
      </DashboardSectionCard>
    </div>
  );
}
