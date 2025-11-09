import DashboardHeaderTitle from "@/components/dashboard/DashboardHeaderTitle";
import DashboardSectionCard from "@/components/dashboard/DashboardSectionCard";
import InfluencerDataView from "@/components/dashboard/influncer/InfluencerDataView";
import DownloadList from "@/components/shared/DownloadContent";
import Link from "next/link";
import { BiEditAlt } from "react-icons/bi";

export default function InfluencerPage() {
  return (
    <div>
      <DashboardHeaderTitle path={["المروجين"]}>
        <div className="flex gap-4 flex-wrap">
          <Link className="btn-primary" href="/dashboard/admin/influncer/add">
            <BiEditAlt /> إضافة مروج
          </Link>
        </div>
      </DashboardHeaderTitle>

      <DashboardSectionCard>
        <InfluencerDataView />
      </DashboardSectionCard>
    </div>
  );
}
