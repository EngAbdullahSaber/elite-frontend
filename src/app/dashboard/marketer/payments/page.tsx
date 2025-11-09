import DashboardHeaderTitle from "@/components/dashboard/DashboardHeaderTitle";
import DashboardSectionCard from "@/components/dashboard/DashboardSectionCard";
import PaymentsInformation from "@/components/dashboard/PaymentsInformation";


export default function AgentPaymentsPage() {

    return (
        <div>
            <DashboardHeaderTitle path={["المدفوعات"]} />
            <PaymentsInformation />
            <DashboardSectionCard className="mt-4 lg:mt-6" title="سجل المدفوعات">
                جدول المدفوعات
            </DashboardSectionCard>
        </div>
    );
}


