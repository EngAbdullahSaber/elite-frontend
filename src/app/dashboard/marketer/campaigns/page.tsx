import DashboardHeaderTitle from "@/components/dashboard/DashboardHeaderTitle";
import DashboardSectionCard from "@/components/dashboard/DashboardSectionCard";
import CampaignsDataView from "@/components/dashboard/admin/campaign/CampaignsDataView";
import Link from "next/link";
import DownloadList from "@/components/shared/DownloadContent";
import { BiEditAlt } from "react-icons/bi";

export default function CampaignsPage() {
  return (
    <div>
      <DashboardHeaderTitle path={["الحملات"]}>
        <div className="flex gap-4 flex-wrap">
          <DownloadList />
          <Link
            className="btn-primary"
            href="/dashboard/marketer/campaigns/add"
          >
            <BiEditAlt /> إضافة حملة جديدة
          </Link>
        </div>
      </DashboardHeaderTitle>

      <DashboardSectionCard>
        <CampaignsDataView />
      </DashboardSectionCard>
    </div>
  );
}
