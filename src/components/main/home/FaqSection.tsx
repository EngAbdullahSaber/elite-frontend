import FaqList from "@/components/shared/FaqList";
import SectionTitle from "@/components/shared/SectionTitle";
import Image from "next/image";

const faqs = [
  { question: "ما هو العقار؟", answer: "العقار هو أرض أو مبانٍ..." },
  { question: "كيف أشتري منزلًا؟", answer: "ابدأ بالبحث مع وسيط عقاري..." },
  { question: "كيف أبيع منزلًا؟", answer: "تواصل مع وسيط للتسعير والتسويق..." },
  { question: "ما هو الرهن العقاري؟", answer: "قرض لشراء عقار يتم سداده على فترة زمنية." },
  { question: "ما هي ضمانات المنزل؟", answer: "عقد يغطي إصلاحات محددة لفترة بعد الشراء." },
];

export default function FaqSection() {
  return (
    <section className="relative bg-white py-[60px] lg:py-[120px]  bg-[url('/pattern-01.png')] bg-contain bg-center ">
      {/* Background layers */}
      <div className="absolute inset-0 bg-white/80 z-[1]" />

      {/* Content wrapper */}
      <div className="relative z-[2]">
        <Image
          alt="faq el"
          width={79}
          height={85}
          className="hidden lg:block absolute top-10 right-10 -scale-[1] -rotate-90 opacity-70"
          src="/main/home/side.png"
        />
        <Image
          alt="faq el"
          width={207}
          height={164}
          className="hidden lg:block absolute bottom-0 left-0 -scale-[1] opacity-70"
          src="/main/home/side-2.png"
        />
        <div className="container">
          <SectionTitle
            arrowTitle="الأسئلة الشائعة"
            title="إذا كان لديك أي سؤال، لدينا الإجابة"
            description="كل ما تحتاج معرفته حول شراء وبيع العقارات."
            bgColor="var(--primary-light)"
          />
          <div className="max-w-[856px] mx-auto">
            <FaqList faqs={faqs} />
          </div>
        </div>
      </div>
    </section>
  );
}
