"use client";
import AgentDetailsWrapper from "@/components/dashboard/agents/AgentDetailsWrapper";
import LoadingAgentDetailsPage from "@/components/dashboard/appointments/AgentLoading";
import AppointmentsDataView from "@/components/dashboard/appointments/AppointmentsDataView";
import DashboardSectionCard from "@/components/dashboard/DashboardSectionCard";
import { useParams } from "next/navigation";
import { Suspense } from "react";

export default function AgentDetailsPage() {
  const { agentId } = useParams();
  console.log(agentId);
  return (
    <div>
      <Suspense fallback={<LoadingAgentDetailsPage />}>
        <AgentDetailsWrapper agentId={agentId} />
      </Suspense>

      <DashboardSectionCard className="mt-4 lg:mt-6">
        <h2 className="h3 text-gray-800 mb-6">
          {" "}
          سجل الحجوزات المرتبطة بالوسيط
        </h2>
        <AppointmentsDataView agentId={agentId} />
      </DashboardSectionCard>
    </div>
  );
}
