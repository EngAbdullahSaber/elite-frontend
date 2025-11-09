"use client";
import DashboardHeaderTitle from "@/components/dashboard/DashboardHeaderTitle";
import DashboardSectionCard from "@/components/dashboard/DashboardSectionCard";
import CampaignsDataView from "@/components/dashboard/admin/campaign/CampaignsDataView";
import Link from "next/link";
import { BiEditAlt } from "react-icons/bi";
import DownloadContent from "@/components/shared//StandaloneDownloadContent";
import { useState } from "react";

export default function CampaignsPage() {
  const [currentData, setCurrentData] = useState<any[]>([]);
  const [currentFilters, setCurrentFilters] = useState<Record<string, any>>({});

  const handleDataUpdate = (data: any[], filters: Record<string, any>) => {
    setCurrentData(data);
    setCurrentFilters(filters);
  };

  return (
    <div>
      <DashboardHeaderTitle path={["الحملات"]}>
        <div className="flex gap-4 flex-wrap">
          <DownloadContent
            module="campaign"
            currentData={currentData}
            filters={currentFilters}
          />
          <Link className="btn-primary" href="/dashboard/admin/campaigns/add">
            <BiEditAlt /> إضافة حملة جديدة
          </Link>
        </div>
      </DashboardHeaderTitle>

      <DashboardSectionCard>
        <CampaignsDataView onDataUpdate={handleDataUpdate} />
      </DashboardSectionCard>
    </div>
  );
}
