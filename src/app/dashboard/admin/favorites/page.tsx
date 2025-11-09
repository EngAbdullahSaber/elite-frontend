"use client";

import DashboardHeaderTitle from "@/components/dashboard/DashboardHeaderTitle";
import DashboardSectionCard from "@/components/dashboard/DashboardSectionCard";
import FavoritePropertiesForm from "@/components/dashboard/Property Filter/FavoritePropertiesForm";
import CenteredContainer from "@/components/shared/CenteredContainer";

export default function FavoritPropertiesPage() {
  // If you need to get the current user ID
  // const { data: session } = useSession();
  // const userId = session?.user?.id;

  return (
    <div>
      <DashboardHeaderTitle path={["العقارات المفضلة"]} />
      <CenteredContainer>
        <DashboardSectionCard
          className="mt-4 lg:mt-6"
          title="إدارة العقارات المفضلة"
        >
          <p className="text-gray-600 mb-6">
            اختر حتى 5 عقارات مفضلة. سيتم عرض هذه العقارات في قائمة المفضلة
            الخاصة بك.
          </p>
          <FavoritePropertiesForm />
        </DashboardSectionCard>
      </CenteredContainer>
    </div>
  );
}
