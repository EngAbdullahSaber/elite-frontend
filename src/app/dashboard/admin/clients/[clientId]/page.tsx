import AppointmentsDataView from "@/components/dashboard/appointments/AppointmentsDataView";
import DashboardSectionCard from "@/components/dashboard/DashboardSectionCard";
import { Suspense } from "react";
import ClientDetailsWrapper from "@/components/dashboard/Clients/ClientDetailsWrapper";
import LoadingClientDetailsPage from "@/components/dashboard/Clients/ClientLoading";

export default function ClientDetailsPage() {
  const clientId = 1;

  return (
    <div>
      <Suspense fallback={<LoadingClientDetailsPage />}>
        <ClientDetailsWrapper clientId={clientId} />
      </Suspense>

      <DashboardSectionCard className="mt-4 lg:mt-6">
        <h2 className="h3 text-gray-800 mb-6">سجل الحجوزات</h2>
        <AppointmentsDataView clientId={clientId} />
      </DashboardSectionCard>
    </div>
  );
}
