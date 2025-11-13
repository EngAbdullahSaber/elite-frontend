"use client";
import { useEffect, useState } from "react";
import DashboardHeaderTitle from "../DashboardHeaderTitle";
import DownloadContent from "@/components/shared/DownloadContent";
import Link from "next/link";
import { BiGroup } from "react-icons/bi";
import AgentDetails from "./AgentDetails";
import { getAgentById } from "@/services/agents/agents";
import { AgentRow } from "@/types/dashboard/agent";
import LoadingAgentDetailsPage from "@/components/dashboard/appointments/AgentLoading";
import { ImageBaseUrl } from "@/libs/app.config";

type Props = {
  agentId: number;
};

export default function AgentDetailsWrapper({ agentId }: Props) {
  const [agent, setAgent] = useState<AgentRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        setLoading(true);
        setError(null);

        const agentData = await getAgentById(agentId);

        if (!agentData) {
          setError("الوسيط غير موجود");
          return;
        }

        // Map API response to the expected format for AgentDetails component
        const mappedAgent: AgentRow = {
          id: agentData.id.toString(),
          name: agentData?.user?.fullName || "غير متوفر",
          email: agentData?.user?.email || "غير متوفر",
          phone: agentData?.user?.phoneNumber || "غير متوفر",
          status: agentData.status,
          activationStatus: agentData.user?.isActive ? "active" : "inactive",
          joinedAt: agentData.createdAt,
          city: agentData.city?.name || "غير متوفر",
          kycStatus: agentData.status,
          kycNotes: agentData.kycNotes || "لا توجد ملاحظات",
          verificationStatus: agentData.user?.verificationStatus || "غير محدد",
          identityProofUrl: ImageBaseUrl + agentData.identityProofUrl,
          residencyDocumentUrl: ImageBaseUrl + agentData.residencyDocumentUrl,
          userId: agentData.user?.id.toString(),
          address: agentData.address || "غير متوفر",
          dateOfBirth: agentData.user?.dateOfBirth,
          gender: agentData.user?.gender,
          nationality: agentData.user?.nationality,
          // Add image from user profile
          image: ImageBaseUrl + agentData.user?.profilePhotoUrl || null,
        };

        setAgent(mappedAgent);
      } catch (err) {
        console.error("Error fetching agent details:", err);
        setError("فشل في تحميل بيانات الوسيط");
      } finally {
        setLoading(false);
      }
    };

    if (agentId) {
      fetchAgent();
    }
  }, [agentId]);

  if (loading) {
    return <LoadingAgentDetailsPage />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64">
        <div className="text-red-500 text-center">
          <h3 className="text-lg font-semibold mb-4">{error}</h3>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            حاول مرة أخرى
          </button>
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64">
        <div className="text-gray-500 text-center">
          <h3 className="text-lg font-semibold mb-4">الوسيط غير موجود</h3>
          <Link className="btn-primary" href="/dashboard/admin/agents">
            <BiGroup /> العودة إلى قائمة الوسطاء
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <DashboardHeaderTitle path={["الوسطاء", `تفاصيل الوسيط - ${agent.name}`]}>
        <div className="flex gap-4 flex-wrap">
          <DownloadContent text="تحميل المعلومات" />
          <Link className="btn-primary" href="/dashboard/admin/agents">
            <BiGroup /> عرض جميع الوسطاء
          </Link>
        </div>
      </DashboardHeaderTitle>

      <AgentDetails agent={agent} />
    </>
  );
}
