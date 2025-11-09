import DashboardHeaderTitle from "@/components/dashboard/DashboardHeaderTitle";
import PropertyForm from "@/components/dashboard/properties/PropertyForm";
import Link from "next/link";
import { FaHome } from "react-icons/fa";

export default function AddPropertyPage() {
  return (
    <div>
      <DashboardHeaderTitle path={["العقارات", "إضافة عقار جديد"]}>
        <Link className="btn-primary" href="/dashboard/admin/projects">
          <FaHome /> عرض جميع العقارات
        </Link>
      </DashboardHeaderTitle>

      <PropertyForm />
    </div>
  );
}
