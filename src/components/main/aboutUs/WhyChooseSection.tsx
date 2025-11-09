"use client";
import SectionTitle from "@/components/shared/SectionTitle";
import Image from "next/image";
import { BiLike } from "react-icons/bi";
import { BsBuilding, BsBuildings } from "react-icons/bs";
import { useEffect, useState } from "react";
import { getPageSections } from "@/services/AboutUsPage/AboutUsPage";
import { getFooterSettings } from "@/services/settings/footerSettings";

// Types for API response
interface PageSection {
  id: number;
  createdAt: string;
  updatedAt: string;
  sectionKey: string;
  title: string;
  description: string;
  page: {
    id: number;
    createdAt: string;
    updatedAt: string;
    slug: string;
    title: string;
    description: string;
  };
}

interface FooterSettings {
  id: number;
  createdAt: string;
  updatedAt: string;
  latitude: string;
  longitude: string;
  introVideoUrl: string;
  customerCount: number;
  yearsExperience: number;
  projectCount: number;
  email: string;
  phoneNumber: string;
  twitterUrl: string;
  instagramUrl: string;
  snapchatUrl: string;
  tiktokUrl: string;
  youtubeUrl: string;
  updatedBy: {
    id: number;
    createdAt: string;
    updatedAt: string;
    phoneNumber: string;
    email: string;
    fullName: string;
    userType: string;
    profilePhotoUrl: string | null;
    nationalIdUrl: string | null;
    residencyIdUrl: string | null;
    verificationStatus: string;
    verifiedAt: string;
    passwordHash: string;
    emailOtp: string | null;
    emailOtpExpiresAt: string | null;
    resetOtp: string | null;
    resetOtpExpiresAt: string | null;
    isActive: boolean;
  };
}

interface WhyChooseSectionProps {
  pageId?: number;
  sectionIds?: number[];
}

const WhyChooseSection = ({
  pageId = 10,
  sectionIds = [7, 8, 9],
}: WhyChooseSectionProps) => {
  const [sectionData, setSectionData] = useState<PageSection[]>([]);
  const [footerSettings, setFooterSettings] = useState<FooterSettings | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock services data - you can also fetch this from API if needed
  const services = [
    {
      icon: <BsBuildings className="text-[40px] text-[#9C742B]" />,
      title: "لو كنت مطور أو مالك عقار",
      description:
        "فمراسل جدة العقاري هو الخيار الأمثل لتسويق عقارك بشكل مثالي تصوير العقارات عن طريق فريق تصوير احترافي إنشاء منشورات وملفات ومحتويات جذابة للتعريف عن مشروعك نقل التغطيات على وسائل التواصل الاجتماعي بمشاهدات عالية حملات ممولة إلكترونية لاستهداف عميلك المحتمل مرافقة عملائك أثناء معاينة العقار لتعزيز تجربة العميل تقديم خدمات تمويلية بالشراكة لتسهيل عملية تملك العميل",
    },
    {
      icon: <BsBuilding className="text-[40px] text-primary" />,
      title: "أما لو كنت العميل",
      description:
        "فأنت محل اهتمامنا ، و دائماً تجدني قريباً منك لتقديم أفضل الخيارات التي تلائمك ، وتحقيق مايتطلبه الأمر لك ، لتحظى بتجربة شراء فريدة من نوعها ، بكل مصداقية وتقديم استشارات عقارية تُسهل عليك اتخاذ القرار الأمثل باختيار مسكنك الملائم والأفضل",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch both page sections and footer settings in parallel
        const [sectionsResponse, footerResponse] = await Promise.all([
          getPageSections(pageId),
          getFooterSettings(),
        ]);

        // Extract the records array from the response
        const allSections = sectionsResponse?.records || [];

        // Filter sections based on the provided sectionIds
        const filteredSections = allSections.filter((sec: PageSection) =>
          sectionIds.includes(sec.id)
        );

        setSectionData(filteredSections);
        setFooterSettings(footerResponse);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
        console.error("Error fetching why choose section data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to get section by ID
  const getSectionById = (id: number): PageSection | undefined => {
    return sectionData.find((section) => section.id === id);
  };

  // Default data in case API fails or data is not available
  const defaultSectionData = {
    7: {
      title: "ارتقِ بتجربة السكن مع أفضل العقارات لدينا",
      description:
        "دائما يتم ترديد عبارة لسنا الوحيدين ولكن نحن الأفضل هذه العبارة لا أرددها فقط بل ألتزم بها بمعنى الكلمة وذلك بتقديم منظومة من الخدمات العقارية الاستثنائية ، لجميع الأطراف المعنية بالمجال العقاري",
    },
    8: {
      title: "لو كنت مطور أو مالك عقار",
      description: services[0].description,
    },
    9: {
      title: "أما لو كنت العميل",
      description: services[1].description,
    },
  };

  if (loading) {
    return (
      <div className="py-[60px] md:py-[120px] bg-[var(--bg-2)] relative z-[1] px-3">
        <div className="container">
          <div className="text-center">جاري التحميل...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-[60px] md:py-[120px] bg-[var(--bg-2)] relative z-[1] px-3">
        <div className="container">
          <div className="text-center text-red-500">
            خطأ في تحميل البيانات: {error}
          </div>
        </div>
      </div>
    );
  }

  // Get the actual data or fallback to defaults
  const mainSection = getSectionById(7) || {
    title: defaultSectionData[7].title,
    description: defaultSectionData[7].description,
  };

  const service1Section = getSectionById(8);
  const service2Section = getSectionById(9);

  // Update services with API data if available
  const updatedServices = [
    {
      ...services[0],
      title: service1Section?.title || services[0].title,
      description: service1Section?.description || services[0].description,
    },
    {
      ...services[1],
      title: service2Section?.title || services[1].title,
      description: service2Section?.description || services[1].description,
    },
  ];

  // Get years of experience from footer settings or default to 10
  const yearsExperience = footerSettings?.yearsExperience || 10;

  return (
    <div className="py-[60px] md:py-[120px] bg-[var(--bg-2)] relative z-[1] px-3">
      <div className="container">
        <div className="grid grid-cols-12 gap-4 lg:gap-6">
          {/* Left Image Section */}
          <div className="col-span-12 lg:col-span-6">
            <div className="relative z-[1] text-center text-xxl-start pb-lg-0">
              <Image
                alt="image"
                width={526}
                height={633}
                className="z-[1] relative"
                src="/main/about/why-choose-img.webp"
              />

              <div className="flex flex-col sm:flex-row items-center gap-4 rounded-xl p-3 lg:p-6 bg-tertiary text-white z-10 absolute top-12 right-0 2xl:-right-24 shadow-lg">
                <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-full bg-white text-secondary  flex items-center justify-center">
                  <BiLike className="text-[20px] lg:text-[28px]" />
                </div>
                <div className="text-center sm:text-start">
                  <h3 className="text-lg lg:text-2xl font-bold mb-1">
                    <span>{yearsExperience}</span>+
                  </h3>
                  <p className="text-sm">سنوات من الخبرة</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content Section */}
          <div className="col-span-12 lg:col-span-6">
            <SectionTitle
              arrowTitle="لماذا تختارنا"
              title={mainSection.title}
              description={mainSection.description}
              bgColor="white"
              className="text-start"
            />

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {updatedServices.map((service, index) => (
                <li
                  key={index}
                  className="bg-[var(--bg-1)] rounded-xl p-6 shadow-sm hover:shadow-md transition duration-300 text-center"
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center bg-[var(--primary-light)] text-primary">
                      {service.icon}
                    </div>
                    <h4 className="text-xl font-bold text-[var(--primary-dark)]">
                      {service.title}
                    </h4>
                    <p className="text-sm text-[var(--neutral-600)] leading-relaxed max-w-[280px]">
                      {service.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseSection;
