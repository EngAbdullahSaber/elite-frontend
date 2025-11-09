import DashboardHeaderTitle from "@/components/dashboard/DashboardHeaderTitle";
import PropertyRequestForm from "@/components/main/addProperty/PropertyRequestForm";
import CenteredContainer from "@/components/shared/CenteredContainer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BiGroup, BiUser } from "react-icons/bi";

type Props = {
  params: { requestId: string };
};

export default async function EditPropertyRequestPage({ params }: Props) {
  const requestId = Number(params.requestId);

  // Validate requestId
  if (isNaN(requestId)) {
    notFound();
  }

  return (
    <div>
      <DashboardHeaderTitle
        path={["طلبات العقارات", `تعديل طلب العقار #${requestId}`]}
      >
        <div className="flex gap-4 flex-wrap">
          <Link
            className="btn-primary"
            href={`/dashboard/admin/property-submissions/${requestId}`}
          >
            <BiUser /> صفحة الطلب
          </Link>
          <Link
            className="btn-primary"
            href="/dashboard/admin/property-submissions"
          >
            <BiGroup /> عرض جميع الطلبات
          </Link>
        </div>
      </DashboardHeaderTitle>
      <CenteredContainer>
        <PropertyRequestForm requestId={requestId} />
      </CenteredContainer>
    </div>
  );
}
