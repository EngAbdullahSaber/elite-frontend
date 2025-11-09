import CitiesDataView from "@/components/dashboard/admin/cities/CitiesDataView";
import CityWithRegionsForm from "@/components/dashboard/admin/cities/CityWithRegionsForm";
import DashboardHeaderTitle from "@/components/dashboard/DashboardHeaderTitle";
import DashboardSectionCard from "@/components/dashboard/DashboardSectionCard";
import { mockedUnSavedCities } from "@/constants/dashboard/admin/city/contants";
import Link from "next/link";
import { BiEditAlt } from "react-icons/bi";

export default function CitiesPage() {
  return (
    <div>
      <DashboardHeaderTitle path={["المدن والمناطق"]}>
        <div className="flex gap-4 flex-wrap">
          <Link className="btn-primary" href="/dashboard/admin/cities/edit">
            <BiEditAlt /> تعديل مدينة
          </Link>
        </div>
      </DashboardHeaderTitle>

      <div className="grid z-[1] grid-cols-12 gap-4 mb-6 lg:gap-6 ">
        <div className="col-span-12 lg:col-span-12">
          <DashboardSectionCard className="col-span-12 lg:col-span-12">
            <CitiesDataView />
          </DashboardSectionCard>
        </div>

        {/* <div className="col-span-12 lg:col-span-6">
          <CityWithRegionsForm
            cities={mockedUnSavedCities}
            titleText="إضافة مدينة ومناطقها"
          />
        </div> */}
      </div>
    </div>
  );
}
