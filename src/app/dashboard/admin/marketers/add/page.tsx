import DashboardHeaderTitle from "@/components/dashboard/DashboardHeaderTitle";
import MarketerForm from "@/components/dashboard/marketers/MarketerForm";
import PartnerForm from "@/components/dashboard/partner/PartnerForm";
import CenteredContainer from "@/components/shared/CenteredContainer";
import Link from "next/link";
import { BiGroup } from "react-icons/bi";

export default function AddMarketerPage() {
  return (
    <div>
      <DashboardHeaderTitle path={["المسوقين", "إضافة مسوق جديد"]}>
        <Link className="btn-primary" href="/dashboard/admin/marketers">
          <BiGroup /> عرض جميع المسوقين
        </Link>
      </DashboardHeaderTitle>

      <CenteredContainer>
        <PartnerForm isAdmin={true} />
      </CenteredContainer>
    </div>
  );
}
