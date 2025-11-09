import DashboardHeaderTitle from "@/components/dashboard/DashboardHeaderTitle";
import CampaignForm from "@/components/dashboard/admin/campaign/CampaignFormUpdate";
import CenteredContainer from "@/components/shared/CenteredContainer";
import Link from "next/link";
import { BiListUl } from "react-icons/bi";

export default function CampaignsPage() {
  return (
    <div>
      <DashboardHeaderTitle path={["الحملات", "إضافة حملة جديدة"]}>
        <Link className="btn-primary" href="/dashboard/marketer/campaigns">
          <BiListUl /> عرض جميع الحملات
        </Link>
      </DashboardHeaderTitle>

      <CenteredContainer>
        <CampaignForm />
      </CenteredContainer>
    </div>
  );
}
