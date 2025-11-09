import AboutSection from "@/components/main/aboutUs/AboutSection";
import ExplorePropertiesSection from "@/components/main/aboutUs/ExplorePropertiesSection";
import StatsSection from "@/components/main/aboutUs/StatsSection";
import TeamSection from "@/components/main/aboutUs/TeamSection";
import WhyChooseSection from "@/components/main/aboutUs/WhyChooseSection";
import WorkProcessSection from "@/components/main/aboutUs/WorkProcessSection";

export const metadata = {
  title: "من نحن",
  description:
    "تعرف على مراسل جدة العقاري، رؤيتنا، خطوات العمل، ولماذا نحن الخيار الأفضل لشراء وبيع العقارات في المملكة.",
};

export default async function AboutUsPage() {
  return (
    <>
      <AboutSection />
      <WorkProcessSection />
      <WhyChooseSection />
      <ExplorePropertiesSection />
      <StatsSection />
      <TeamSection />
    </>
  );
}
