
"use client";

import WorkingDaysForm from "@/components/dashboard/agentRole/Schedule/WorkingDaysForm";
import DashboardHeaderTitle from "@/components/dashboard/DashboardHeaderTitle";
import CenteredContainer from "@/components/shared/CenteredContainer";




export default function AgentDashboard() {

    return (
        <div>
            <DashboardHeaderTitle path={["الوكلاء", "أيام وساعات العمل"]} />

            <CenteredContainer className="space-y-6">
                <WorkingDaysForm />
            </CenteredContainer>
        </div>
    );
}
