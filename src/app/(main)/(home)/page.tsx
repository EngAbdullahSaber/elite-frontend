import CallToActionSection from "@/components/main/home/CallToActionSection";
import CategorySection from "@/components/main/home/CategorySection";
import ClientsSection from "@/components/main/home/ClientsSection";
import CtaSection from "@/components/main/home/CtaSection";
import FaqSection from "@/components/main/home/FaqSection";
import HeroSection from "@/components/main/home/HeroSection";
import ListedPropertySection from "@/components/main/home/ListedPropertySection";
import RecentlyAddedPropertySection from "@/components/main/home/RecentlyAddedPropertySection";
import ServicesSection from "@/components/main/home/ServicesSection";
import TestimonialSection from "@/components/main/home/TestimonialSection";

export const metadata = {
  description:
    "اكتشف أفضل العقارات والخدمات العقارية عبر منصة مراسل جدة العقاري. تصفّح المشاريع، اقرأ آراء العملاء، وتواصل معنا لتحقيق أهدافك العقارية.",
};

export default function Home() {
  return (
    <div className="">
      <HeroSection />
      <CategorySection />
      <ListedPropertySection />
      {/* <ServicesSection /> */}
      {/* <RecentlyAddedPropertySection /> */}
      <CallToActionSection />
      {/* <TestimonialSection /> */}
      <ClientsSection />
      <CtaSection />
      <FaqSection />
    </div>
  );
}
