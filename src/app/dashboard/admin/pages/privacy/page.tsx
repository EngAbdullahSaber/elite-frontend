import DashboardHeaderTitle from "@/components/dashboard/DashboardHeaderTitle";
import CenteredContainer from "@/components/shared/CenteredContainer";
import PrivacyTabsForm from "@/components/dashboard/admin/pages/privacy/PrivacyTabsForm";

export default function PrivacyContentPage() {
    return (
        <div>
            <DashboardHeaderTitle path={["إعدادات", "محتوى صفحة سياسة الخصوصية"]} />
            <CenteredContainer className="space-y-6">
                <PrivacyTabsForm />
            </CenteredContainer>
        </div>
    );
}


