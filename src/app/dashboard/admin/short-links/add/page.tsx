// app/dashboard/admin/short-links/add/page.tsx
import DashboardHeaderTitle from "@/components/dashboard/DashboardHeaderTitle";
import Link from "next/link";
import { BiGroup } from "react-icons/bi";
import CenteredContainer from "@/components/shared/CenteredContainer";
import ShortLinkForm from "@/components/dashboard/short-links/ShortLinkForm";

export default function AddShortLinkPage() {
  return (
    <div>
      <DashboardHeaderTitle path={["الروابط القصيرة", "إضافة رابط قصير جديد"]}>
        <Link className="btn-primary" href="/dashboard/admin/short-links">
          <BiGroup /> عرض جميع الروابط
        </Link>
      </DashboardHeaderTitle>
      <CenteredContainer>
        <ShortLinkForm isAdmin={true} />
      </CenteredContainer>
    </div>
  );
}
