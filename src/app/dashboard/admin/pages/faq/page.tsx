import DashboardHeaderTitle from "@/components/dashboard/DashboardHeaderTitle";
import FaqTabsForm from "@/components/dashboard/admin/pages/FaqTabsForm";
import CenteredContainer from "@/components/shared/CenteredContainer";

export default function FAQContentPage() {
  return (
    <div>
      <DashboardHeaderTitle path={["إعدادات", "محتوى صفحة الأسئلة الشائعة"]} />

      <CenteredContainer className="space-y-6">
        <FaqTabsForm />
      </CenteredContainer>
    </div>
  );
}
