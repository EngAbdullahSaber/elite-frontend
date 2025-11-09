"use client";
import DashboardHeaderTitle from "@/components/dashboard/DashboardHeaderTitle";
import DownloadList from "@/components/shared/DownloadContent";
import PropertiesDataView from "@/components/main/projects/PropertiesDataView";
import Link from "next/link";
import { BiEditAlt } from "react-icons/bi";
import { useState } from "react";
import StandaloneDownloadContent from "@/components/shared/StandaloneDownloadContent";

export default function PropertiesPage() {
  const [currentData, setCurrentData] = useState<any[]>([]);
  const [currentFilters, setCurrentFilters] = useState<Record<string, any>>({});

  const handleDataUpdate = (data: any[], filters: Record<string, any>) => {
    setCurrentData(data);
    setCurrentFilters(filters);
  };

  return (
    <div>
      <DashboardHeaderTitle path={["العقارات"]}>
        <div className="flex gap-4 flex-wrap">
          <Link className="btn-primary" href="/dashboard/admin/properties/add">
            <BiEditAlt /> إضافة عقار
          </Link>
        </div>
      </DashboardHeaderTitle>

      <PropertiesDataView isAdmin={true} />
    </div>
  );
}
