// app/dashboard/admin/influncer/add/page.tsx
import DashboardHeaderTitle from "@/components/dashboard/DashboardHeaderTitle";
import Link from "next/link";
import { BiGroup } from "react-icons/bi";
import InfluencerForm from "@/components/dashboard/influncer/InfluncerForm";
import CenteredContainer from "@/components/shared/CenteredContainer";

export default function AddInfluencerPage() {
  return (
    <div>
      <DashboardHeaderTitle path={["المروجين", "إضافة مروج جديد"]}>
        <Link className="btn-primary" href="/dashboard/admin/influncer">
          <BiGroup /> عرض جميع المروجين
        </Link>
      </DashboardHeaderTitle>
      <CenteredContainer>
        <InfluencerForm isAdmin={true} />
      </CenteredContainer>
    </div>
  );
}
