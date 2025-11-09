"use client";

import { useForm } from "react-hook-form";
import MainSectionForm from "./MainSectionForm";
import ReservationSectionForm from "./ReservationSectionForm";
import DiscoverPropertiesSectionForm from "./DiscoverPropertiesSectionForm";
import WhyChooseUsSectionForm from "./WhyChooseUsSectionForm";
import TeamSectionForm from "./TeamSectionForm";
import PrimaryButton from "@/components/shared/Button";
import SoftActionButton from "@/components/shared/SoftActionButton";

export type TeamMember = {
  imageUrl: string;
  name: string;
  job: string;
};

export type BookingStep = {
  title: string;
  description: string;
};

export type AboutContentForm = {
  // Main section
  mainTitle: string;
  mainSubtitle: string;
  mainFeatures: string[]; // 4 نصوص (معاملات آمنة، ضمان جودة، ...)

  // Booking process
  bookingTitle: string;
  bookingSubtitle: string;
  bookingSteps: { title: string; description: string; imageUrl?: string }[];

  // Why choose us
  whyTitle: string;
  whySubtitle: string;
  developerDescription: string;
  clientDescription: string;

  // Explore properties
  exploreTitle: string;
  exploreSubtitle: string;
  stats: { label: string; value: string }[];

  // Team
  teamTitle: string;
  teamSubtitle: string;
  team: { imageUrl: string; name: string; job: string }[];
};

const members: TeamMember[] = [
  {
    name: "خالد العتيبي",
    job: "خبير تسويق رقاري",
    imageUrl: "/main/about/team/member-1.webp",
  },
  {
    name: "عبدالله الشهري",
    job: "مستشار عقاري أول",
    imageUrl: "/main/about/team/member-1.webp",
  },
  {
    name: "فهد السبيعي",
    job: "مدير علاقات العملاء",
    imageUrl: "/main/about/team/member-1.webp",
  },
  {
    name: "ماجد البلوشي",
    job: "محلل بيانات عقارية",
    imageUrl: "/main/about/team/member-1.webp",
  },
  {
    name: "سامي القحطاني",
    job: "مصمم محتوى بصري",
    imageUrl: "/main/about/team/member-1.webp",
  },
  {
    name: "تركي المطيري",
    job: "مدير العمليات",
    imageUrl: "/main/about/team/member-1.webp",
  },
  {
    name: "علي البركاتي",
    job: "خبير تمويل عقاري",
    imageUrl: "/main/about/team/member-1.webp",
  },
];

export default function AboutForm() {
  const { handleSubmit, control } = useForm<AboutContentForm>({
    defaultValues: {
      mainTitle: "نبني مساحات حديثة ونوفر عقارات للبيع والشراء",
      mainSubtitle: "ابحث عن منزل أحلامك",
      mainFeatures: [
        "معاملات آمنة 100%",
        "ضمان أفضل جودة",
        "تكاليف ضريبية منخفضة جدًا",
        "خدمة مستمرة 24/7",
      ],

      bookingTitle: "كيفية حجز تذاكر الطيران: دليل خطوة بخطوة",
      bookingSubtitle:
        "يمكن شراء العقارات أو بيعها أو تأجيرها، وهي فرصة استثمارية قيّمة. قيمة العقارات قابلة للنمو...",
      bookingSteps: [
        {
          title: "اختيار البحث",
          description:
            "ابدأ بتحديد نوع العقار الذي يناسب احتياجاتك، مثل السكني أو التجاري.",
          imageUrl: "/steps/step1.png",
        },
        {
          title: "تحديد الوجهة",
          description:
            "اختر المدينة أو الحي الذي ترغب في السكن أو الاستثمار فيه.",
          imageUrl: "/steps/step2.png",
        },
        {
          title: "سهولة الحجز",
          description: "أكمل عملية الحجز بسهولة عبر خطوات واضحة وسريعة.",
          imageUrl: "/steps/step3.png",
        },
      ],

      whyTitle: "ارتقِ بتجربة السكن مع أفضل العقارات لدين",
      whySubtitle:
        "دائما يتم ترديد عبارة لسنا الوحيدين ولكن نحن الأفضل هذه العبارة لا أرددها فقط بل ألتزم بها بمعنى الكلمة وذلك بتقديم منظومة من الخدمات العقارية الاستثنائية ، لجميع الأطراف المعنية بالمجال العقاري",
      developerDescription:
        "فمراسل جدة العقاري هو الخيار الأمثل لتسويق عقارك بشكل مثالي تصوير العقارات عن طريق فريق تصوير احترافي إنشاء منشورات وملفات ومحتويات جذابة للتعريف عن مشروعك نقل التغطيات على وسائل التواصل الاجتماعي بمشاهدات عالية حملات ممولة إلكترونية لاستهداف عميلك المحتمل مرافقة عملائك أثناء معاينة العقار لتعزيز تجربة العميل تقديم خدمات تمويلية بالشراكة لتسهيل عملية تملك العميل",
      clientDescription:
        "فأنت محل اهتمامنا ، و دائماً تجدني قريباً منك لتقديم أفضل الخيارات التي تلائمك ، وتحقيق مايتطلبه الأمر لك ، لتحظى بتجربة شراء فريدة من نوعها ، بكل مصداقية وتقديم استشارات عقارية تُسهل عليك اتخاذ القرار الأمثل باختيار مسكنك الملائم والأفضل",

      exploreTitle: "نظرة تفصيلية داخل عقاراتنا",
      exploreSubtitle:
        "يمكن شراء العقارات أو بيعها ،وهي فرصة استثمارية قيّمة. قيمة العقارات قابلة للنمو...",
      stats: [
        { label: "عقار مكتمل", value: "14k" },
        { label: "رضا العملاء", value: "457+" },
        { label: "وكلاء خبراء", value: "78+" },
        { label: "جوائز محققة", value: "10+" },
      ],

      teamTitle: "فريقنا المميز",
      teamSubtitle:
        "تعرف على أعضاء فريقنا الذين يقفون خلف نجاحنا، حيث يجمعون بين الخبرة، الشغف، والاحترافية لتقديم أفضل الخدمات العقارية وتحقيق تطلعات عملائنا.",
      team: members,
    },
  });

  const onSave = (values: AboutContentForm) => {
    console.log("Saving about us content", values);
  };

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-6">
      <MainSectionForm control={control} />
      <ReservationSectionForm control={control} />
      <WhyChooseUsSectionForm control={control} />
      <DiscoverPropertiesSectionForm control={control} />
      <TeamSectionForm control={control} />

      <div className="col-span-12 flex items-center gap-6 flex-wrap">
        <PrimaryButton type="submit">حفظ التغييرات</PrimaryButton>
        <SoftActionButton onClick={() => {}}>إلغاء</SoftActionButton>
      </div>
    </form>
  );
}
