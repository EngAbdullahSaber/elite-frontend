import DashboardHeaderTitle from "@/components/dashboard/DashboardHeaderTitle";
import HomeForm from "@/components/dashboard/admin/pages/home/HomeForm";
import CenteredContainer from "@/components/shared/CenteredContainer";

export default function HomeContentPage() {
  return (
    <div>
      <DashboardHeaderTitle path={["إعدادات", "محتوى الصفحة الرئيسية"]} />

      <CenteredContainer className="space-y-6">
        <HomeForm />
      </CenteredContainer>
    </div>
  );
}
