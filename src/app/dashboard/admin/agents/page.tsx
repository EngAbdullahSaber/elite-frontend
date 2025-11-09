"use client";
import AgentsDataView from "@/components/dashboard/agents/AgentsDataView";
import DashboardHeaderTitle from "@/components/dashboard/DashboardHeaderTitle";
import DashboardSectionCard from "@/components/dashboard/DashboardSectionCard";
import DownloadList from "@/components/shared/DownloadContent";
import StandaloneDownloadContent from "@/components/shared/StandaloneDownloadContent";
import Link from "next/link";
import { useState } from "react";
import { BiEditAlt } from "react-icons/bi";

export default function AgentsPage() {
  const [currentData, setCurrentData] = useState<any[]>([]);
  const [currentFilters, setCurrentFilters] = useState<Record<string, any>>({});

  const handleDataUpdate = (data: any[], filters: Record<string, any>) => {
    setCurrentData(data);
    setCurrentFilters(filters);
  };

  return (
    <div>
      <DashboardHeaderTitle path={["الوسطاء"]}>
        <div className="flex gap-4 flex-wrap">
          <StandaloneDownloadContent
            module="agent"
            currentData={currentData}
            filters={currentFilters}
          />{" "}
          <Link className="btn-primary" href="/dashboard/admin/agents/add">
            <BiEditAlt /> إضافة وسيط
          </Link>
        </div>
      </DashboardHeaderTitle>

      <DashboardSectionCard>
        <AgentsDataView onDataUpdate={handleDataUpdate} />
      </DashboardSectionCard>
    </div>
  );
}
