import DashboardHeaderTitle from "@/components/dashboard/DashboardHeaderTitle";
import Link from "next/link";
import { BiGroup } from "react-icons/bi";
import AgentForm from "@/components/dashboard/agents/AgentForm";
import CenteredContainer from "@/components/shared/CenteredContainer";

export default function AddAgentPage() {
  return (
    <div>
      <DashboardHeaderTitle path={["الوسطاء", "إضافة وسيط جديد"]}>
        <Link className="btn-primary" href="/dashboard/admin/agents">
          <BiGroup /> عرض جميع الوسطاء
        </Link>
      </DashboardHeaderTitle>
      <CenteredContainer>
        <AgentForm isAdmin={true} />
      </CenteredContainer>
    </div>
  );
}
