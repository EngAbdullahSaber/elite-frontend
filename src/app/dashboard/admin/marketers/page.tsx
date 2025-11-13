import DashboardHeaderTitle from "@/components/dashboard/DashboardHeaderTitle";
import DashboardSectionCard from "@/components/dashboard/DashboardSectionCard";
import MarketersDataView from "@/components/dashboard/marketers/MarketersDataView";
import Link from "next/link";
import { BiEditAlt } from "react-icons/bi";
import PartnersDataView from "@/components/dashboard/partner/PartnersDataView";

export default function MarketersPage() {
  return (
    <div>
      <DashboardHeaderTitle path={["المسوقين"]}>
        <div className="flex gap-4 flex-wrap">
          <Link className="btn-primary" href="/dashboard/admin/marketers/add">
            <BiEditAlt /> إضافة مسوق
          </Link>
        </div>
      </DashboardHeaderTitle>

      <DashboardSectionCard>
        <PartnersDataView />
      </DashboardSectionCard>
    </div>
  );
}
