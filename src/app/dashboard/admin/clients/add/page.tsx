import DashboardHeaderTitle from "@/components/dashboard/DashboardHeaderTitle";
import BasicInfoForm from "@/components/main/customer/personal-info/BasicInfoForm";
import CenteredContainer from "@/components/shared/CenteredContainer";
import Link from "next/link";
import { BiGroup } from "react-icons/bi";

export default function AddClientPage() {
  return (
    <div>
      <DashboardHeaderTitle path={["العملاء", "إضافة عميل جديد"]}>
        <Link className="btn-primary" href="/dashboard/admin/clients">
          <BiGroup /> عرض جميع العملاء
        </Link>
      </DashboardHeaderTitle>

      <CenteredContainer>
        <BasicInfoForm isAdmin={true} />
      </CenteredContainer>
    </div>
  );
}
