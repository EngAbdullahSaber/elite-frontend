import CenteredContainer from "@/components/shared/CenteredContainer";
import LightPageHeader from "@/components/shared/LightPageHeader";
import PropertyRequestForm from "@/components/main/addProperty/PropertyRequestForm";

export default function AddPropertyRequestPage() {
  return (
    <CenteredContainer>
      <LightPageHeader text="أضف عقارك وسنتولى بيعه" />
      <PropertyRequestForm />
    </CenteredContainer>
  );
}
