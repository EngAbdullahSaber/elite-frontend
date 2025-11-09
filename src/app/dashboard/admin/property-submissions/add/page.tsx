"use client";

import DashboardHeaderTitle from "@/components/dashboard/DashboardHeaderTitle";
import PropertyRequestForm from "@/components/main/addProperty/PropertyRequestForm";
import CenteredContainer from "@/components/shared/CenteredContainer";
import Link from "next/link";
import { BiGroup, BiHomeAlt } from "react-icons/bi";

export default function AddPropertySubmissionPage() {
  return (
    <div>
      <DashboardHeaderTitle path={["طلبات عرض العقار", "إضافة طلب جديد"]}>
        <Link
          className="btn-primary"
          href="/dashboard/admin/property-submissions"
        >
          <BiGroup /> عرض جميع الطلبات
        </Link>
      </DashboardHeaderTitle>

      <CenteredContainer>
        <PropertyRequestForm />
      </CenteredContainer>
    </div>
  );
}
