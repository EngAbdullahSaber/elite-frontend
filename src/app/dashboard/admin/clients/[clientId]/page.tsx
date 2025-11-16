import AppointmentsDataView from "@/components/dashboard/appointments/AppointmentsDataView";
import DashboardSectionCard from "@/components/dashboard/DashboardSectionCard";
import { Suspense } from "react";
import ClientDetailsWrapper from "@/components/dashboard/Clients/ClientDetailsWrapper";
import LoadingClientDetailsPage from "@/components/dashboard/Clients/ClientLoading";
import CustomerAppointmentsDataView from "@/components/dashboard/appointments/CustomerAppointmentsDataView";

type Props = {
  params: { clientId: string };
};

export default function ClientDetailsPage({ params }: Props) {
  return (
    <div className="min-h-screen bg-gray-50/30 pb-8">
      <div className="container mx-auto px-4 py-6">
        <Suspense fallback={<LoadingClientDetailsPage />}>
          <ClientDetailsWrapper clientId={parseInt(params.clientId)} />
        </Suspense>

        {/* Appointments Section */}
        <div className="mt-8">
          <DashboardSectionCard className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                سجل الحجوزات
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                عرض جميع حجوزات العميل وتاريخها وحالتها
              </p>
            </div>
            <div className="p-6">
              <CustomerAppointmentsDataView clientId={params.clientId} />
            </div>
          </DashboardSectionCard>
        </div>
      </div>
    </div>
  );
}
