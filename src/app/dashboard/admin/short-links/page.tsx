import DashboardHeaderTitle from "@/components/dashboard/DashboardHeaderTitle";
import DashboardSectionCard from "@/components/dashboard/DashboardSectionCard";
import ShortLinksDataViewDataView from "@/components/dashboard/short-links/ShortLinksDataView";
import Link from "next/link";
import { BiEditAlt } from "react-icons/bi";

export default function InfluencerPage() {
  return (
    <div>
      <DashboardHeaderTitle path={["روابط الحملات"]}>
        <div className="flex gap-4 flex-wrap">
          <Link className="btn-primary" href="/dashboard/admin/short-links/add">
            <BiEditAlt /> إضافة رابط حملة
          </Link>
        </div>
      </DashboardHeaderTitle>

      <DashboardSectionCard>
        <ShortLinksDataViewDataView />
      </DashboardSectionCard>
    </div>
  );
}
