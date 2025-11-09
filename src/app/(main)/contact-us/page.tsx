import ContactSection from "@/components/main/contactUs/ContactSection";
import HelpSection from "@/components/main/contactUs/HelpSection";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: 'اتصل بنا',
  description: 'تواصل معنا للحصول على الدعم أو الاستفسارات حول خدمات مراسل جدة العقاري. نحن هنا لمساعدتك في كل ما يتعلق بالعقارات.',
};


export default function ContactUs() {

  return (
    <>
      <HelpSection />
      <ContactSection />
    </>
  );
}
