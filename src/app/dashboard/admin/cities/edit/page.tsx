import CityWithRegionsForm from "@/components/dashboard/admin/cities/CityWithRegionsForm";
import DashboardHeaderTitle from "@/components/dashboard/DashboardHeaderTitle";
import CenteredContainer from "@/components/shared/CenteredContainer";
import { mockedCitiesForEdit } from "@/constants/dashboard/admin/city/contants";
import Link from "next/link";
import { FaCity } from "react-icons/fa";

export default async function CityAgentPage() {
  await new Promise((r) => setTimeout(r, 300)); // simulate loading
  return (
    <div>
      <DashboardHeaderTitle path={["المدن", `تعديل بيانات المدن`]}>
        <Link className="btn-primary" href="/dashboard/admin/cities">
          <FaCity /> عرض جميع المدن
        </Link>
      </DashboardHeaderTitle>

      <CenteredContainer>
        <CityWithRegionsForm
          cities={mockedCitiesForEdit}
          titleText="تعديل مدينة ومناطقها"
        />
      </CenteredContainer>
    </div>
  );
}
