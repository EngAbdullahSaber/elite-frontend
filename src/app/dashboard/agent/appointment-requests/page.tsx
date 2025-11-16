import AppointmentsDataViewRequests from "@/components/dashboard/appointments/AppointmentsDataViewRequests";
import DashboardHeaderTitle from "@/components/dashboard/DashboardHeaderTitle";
import Link from "next/link";
import { BiPlus } from "react-icons/bi";

export default function AppointmentsPage() {
  return (
    <div>
      <DashboardHeaderTitle path={["طلبات المواعيد"]}></DashboardHeaderTitle>

      <section className="p-3 md:py-6 lg:py-8 md:px-8 lg:px-10 border rounded-2xl bg-white relative z-[1]">
        <AppointmentsDataViewRequests viewType={"requests"} />
      </section>
    </div>
  );
}
