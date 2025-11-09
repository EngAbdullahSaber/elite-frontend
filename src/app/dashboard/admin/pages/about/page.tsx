import DashboardHeaderTitle from "@/components/dashboard/DashboardHeaderTitle";
import AboutForm from "@/components/dashboard/admin/pages/about/AboutForm";
import CenteredContainer from "@/components/shared/CenteredContainer";

export default function AboutContentPage() {
  return (
    <div>
      <DashboardHeaderTitle path={["إعدادات", "محتوى صفحة من نحن"]} />

      <CenteredContainer className="space-y-6">
        <AboutForm />
      </CenteredContainer>
    </div>
  );
}
