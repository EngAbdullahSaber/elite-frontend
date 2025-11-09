"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardHeaderTitle from "@/components/dashboard/DashboardHeaderTitle";
import Link from "next/link";
import { BiUser, BiGroup } from "react-icons/bi";
import AgentForm from "@/components/dashboard/agents/AgentForm";
import CenteredContainer from "@/components/shared/CenteredContainer";
import { getAgentById } from "@/services/agents/agents";
import { AgentRow } from "@/types/dashboard/agent";

type Props = {
  params: { agentId: string };
};

export default function EditAgentPage({ params }: Props) {
  const [agent, setAgent] = useState<AgentRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        setLoading(true);
        setError(null);

        const agentId = parseInt(params.agentId);
        if (isNaN(agentId)) {
          setError("معرف الوسيط غير صالح");
          return;
        }

        const agentData = await getAgentById(agentId);

        if (!agentData) {
          setError("الوسيط غير موجود");
          return;
        }

        // Map API response to AgentRow format
        const mappedAgent: AgentRow = {
          id: agentData.id.toString(),
          name: agentData?.user?.fullName || "غير متوفر",
          email: agentData?.user?.email || "غير متوفر",
          phone: agentData?.user?.phoneNumber || "غير متوفر",
          status: agentData.status,
          activationStatus: agentData.user?.isActive ? "active" : "inactive",
          joinedAt: agentData.createdAt,
          city: agentData.city?.name || "غير متوفر",
          cityId: agentData.city?.id, // Add cityId for the form
          kycStatus: agentData.status,
          kycNotes: agentData.kycNotes || "لا توجد ملاحظات",
          verificationStatus: agentData.user?.verificationStatus || "غير محدد",
          identityProofUrl: agentData.identityProofUrl,
          residencyDocumentUrl: agentData.residencyDocumentUrl,
          userId: agentData.user?.id, // Add userId for the form
          address: agentData.address || "غير متوفر",
          dateOfBirth: agentData.user?.dateOfBirth,
          gender: agentData.user?.gender,
          nationality: agentData.user?.nationality,
          image: agentData.user?.profilePhotoUrl || null,
        };

        setAgent(mappedAgent);
      } catch (err) {
        console.error("Error fetching agent:", err);
        setError("فشل في تحميل بيانات الوسيط");
      } finally {
        setLoading(false);
      }
    };

    fetchAgent();
  }, [params.agentId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="mr-2">جاري التحميل...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64">
        <div className="text-red-500 text-center">
          <h3 className="text-lg font-semibold mb-4">{error}</h3>
          <Link className="btn-primary" href="/dashboard/admin/agents">
            <BiGroup /> العودة إلى قائمة الوسطاء
          </Link>
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
    <div>
      <DashboardHeaderTitle
        path={["الوسطاء", `تعديل بيانات الوسيط: ${agent.name}`]}
      >
        <div className="flex gap-4 flex-wrap">
          <Link
            className="btn-primary"
            href={`/dashboard/admin/agents/${agent.id}`}
          >
            <BiUser /> صفحة الوسيط
          </Link>
          <Link className="btn-primary" href="/dashboard/admin/agents">
            <BiGroup /> عرض جميع الوسطاء
          </Link>
        </div>
      </DashboardHeaderTitle>

      <CenteredContainer>
        <AgentForm agent={agent} isAdmin={true} />
      </CenteredContainer>
    </div>
  );
}
