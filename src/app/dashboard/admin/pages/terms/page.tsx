import DashboardHeaderTitle from "@/components/dashboard/DashboardHeaderTitle";
import CenteredContainer from "@/components/shared/CenteredContainer";
import TermsTabsForm from "@/components/dashboard/admin/pages/terms/TermsTabsForm";

export default function TermsContentPage() {
  return (
    <div>
      <DashboardHeaderTitle path={["إعدادات", "محتوى صفحة الشروط والأحكام"]} />
      <CenteredContainer className="space-y-6">
        <TermsTabsForm />
      </CenteredContainer>
    </div>
  );
}
