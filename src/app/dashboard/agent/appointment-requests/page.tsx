import AppointmentRequestsDataView from "@/components/dashboard/appointments/AppointmentRequestsDataView";
import DashboardHeaderTitle from "@/components/dashboard/DashboardHeaderTitle";

export default function AppointmentRequestsPage() {
  return (
    <div>
      <DashboardHeaderTitle path={["طلبات المواعيد"]} />
      <section className="p-3 md:py-6 lg:py-8 md:px-8 lg:px-10 border rounded-2xl bg-white relative z-[1]">
        <AppointmentRequestsDataView />
      </section>
    </div>
  );
}
