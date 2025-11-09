import DashboardHeaderTitle from "@/components/dashboard/DashboardHeaderTitle";
import DashboardSectionCard from "@/components/dashboard/DashboardSectionCard";
import PaymentsInformation from "@/components/dashboard/PaymentsInformation";
import AgentPaymentsDataView from "@/components/dashboard/agents/AgentPaymentsDataView";


export default function AgentPaymentsPage() {

    return (
        <div>
            <DashboardHeaderTitle path={["المدفوعات"]} />
            <PaymentsInformation />
            <DashboardSectionCard className="mt-4 lg:mt-6" title="سجل المدفوعات">
                <AgentPaymentsDataView />
            </DashboardSectionCard>
        </div>
    );
}


