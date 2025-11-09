"use client";

import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import Card from "@/components/shared/Card";
import TextInput from "@/components/shared/Forms/TextInput";
import TextareaInput from "@/components/shared/Forms/TextareaInput";
import Uploader from "@/components/shared/Forms/Uploader";
import { FileItem } from "@/utils/upload";
import PrimaryButton from "@/components/shared/Button";
import SoftActionButton from "@/components/shared/SoftActionButton";
import EditFAQSection from "../EditFAQSection";
import {
  getPageSections,
  updateSection,
  type Section,
} from "@/services/AboutUsPage/AboutUsPage";
import toast from "react-hot-toast";

type FAQItem = {
  question: string;
  answer: string;
};

export type HomeContentForm = {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: FileItem[];

  categoryTitle: string;
  categoryDescription: string;

  projectsTitle: string;
  projectsDescription: string;

  servicesTitle: string;
  servicesDescription: string;

  recentProjectsTitle: string;
  recentProjectsDescription: string;

  testimonialTitle: string;
  testimonialSubtitle: string;

  partnersTitle: string;
  partnersSubtitle: string;
  partnersLogos: FileItem[];

  faqTitle: string;
  faqSubtitle: string;
  faqs: FAQItem[];
};

// Section IDs mapping
const SECTION_IDS = {
  HERO: 1,
  CATEGORY: 2,
  PROJECTS: 12,
  SERVICES: 13,
  RECENT_PROJECTS: 14,
  PARTNERS: 15,
  TESTIMONIAL: 16, // You'll need to add this to your API
  FAQ: 17, // You'll need to add this to your API
};

const MAIN_PAGE_ID = 1; // Home page ID

const clientLogos = [
  "/main/home/clients/client-1.webp",
  "/main/home/clients/client-2.webp",
  "/main/home/clients/client-3.webp",
  "/main/home/clients/client-4.webp",
  "/main/home/clients/client-5.webp",
  "/main/home/clients/client-6.webp",
  "/main/home/clients/client-7.webp",
];

const defaultFaqs = [
  { question: "ما هو العقار؟", answer: "العقار هو أرض أو مبانٍ..." },
  { question: "كيف أشتري منزلًا؟", answer: "ابدأ بالبحث مع وسيط عقاري..." },
  { question: "كيف أبيع منزلًا؟", answer: "تواصل مع وسيط للتسعير والتسويق..." },
  {
    question: "ما هو الرهن العقاري؟",
    answer: "قرض لشراء عقار يتم سداده على فترة زمنية.",
  },
  {
    question: "ما هي ضمانات المنزل؟",
    answer: "عقد يغطي إصلاحات محددة لفترة بعد الشراء.",
  },
];

const defaultValues: HomeContentForm = {
  heroTitle: "طريقة أسرع وأذكى للعثور على عقارك المثالي",
  heroSubtitle:
    "تصفّح آلاف القوائم المصنّفة بدقة، وفِلتر النتائج حسب المدينة، النوع والميزانية.",
  heroImage: [
    {
      url: "/main/home/primary-hero-img-1.jpg",
      name: "primary-hero-img-1.jpg",
      type: "image/jpeg",
      isPrimary: false,
    },
    {
      url: "/main/home/primary-hero-img-2.jpg",
      name: "primary-hero-img-2.jpg",
      type: "image/jpeg",
      isPrimary: true,
    },
  ],

  categoryTitle: "اختر الفئة المناسبة",
  categoryDescription:
    "يمكن شراء العقارات أو بيعها، وهي فرصة استثمارية قيّمة. قيمة العقار تعتمد على الموقع والاستخدام.",

  projectsTitle: "قائمة المشاريع",
  projectsDescription:
    "يمكن شراء العقارات ، ويمكن أن تكون فرصة استثمارية قيّمة.",

  servicesTitle: "شاهد كيف يمكن أن نساعدك",
  servicesDescription: "يمكن شراء العقارات أو بيعها أو تأجيرها أو استئجارها...",

  recentProjectsTitle: "أحدث المشاريع",
  recentProjectsDescription:
    "اكتشف أحدث الوحدات العقارية المضافة حديثًا — فرص سكنية واستثمارية مختارة بعناية لتناسب تطلعاتك.",

  testimonialTitle: "آراء عملائنا",
  testimonialSubtitle:
    "يمكن شراء العقارات أو بيعها ,وهي فرصة استثمارية قيّمة. قيمة العقار تعتمد على الموقع والاستخدام.",

  partnersTitle: "عملاؤنا",
  partnersSubtitle:
    "نفخر بثقة عملائنا الذين يمثلون نخبة من الشركات والمؤسسات الرائدة في مجال العقارات.",
  partnersLogos: clientLogos.map((url, i) => ({
    url,
    name: url.split("/").pop() || `client-${i + 1}.webp`,
    type: "image/webp",
    isPrimary: i === 0,
  })),

  faqTitle: "إذا كان لديك أي سؤال، لدينا الإجابة",
  faqSubtitle: "كل ما تحتاج معرفته حول شراء وبيع العقارات.",
  faqs: defaultFaqs,
};

export default function HomeForm() {
  const [sections, setSections] = useState<Record<number, Section>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [updatingSections, setUpdatingSections] = useState<
    Record<number, boolean>
  >({});

  const {
    handleSubmit,
    control,
    reset,
    formState: { isDirty },
  } = useForm<HomeContentForm>({
    defaultValues,
  });

  // Load page sections on component mount
  useEffect(() => {
    loadPageSections();
  }, []);

  const loadPageSections = async () => {
    try {
      setIsLoading(true);
      const response = await getPageSections(MAIN_PAGE_ID, {
        limit: 50,
        sortBy: "createdAt",
        sortOrder: "DESC",
      });

      // Create a map of sections by ID
      const sectionsMap: Record<number, Section> = {};
      response.records.forEach((section) => {
        sectionsMap[section.id] = section;
      });

      setSections(sectionsMap);

      // Update form with fetched data
      const formData: Partial<HomeContentForm> = {};

      // Map sections to form fields
      Object.values(SECTION_IDS).forEach((sectionId) => {
        const section = sectionsMap[sectionId];
        if (section) {
          switch (sectionId) {
            case SECTION_IDS.HERO:
              formData.heroTitle = section.title;
              formData.heroSubtitle = section.description;
              break;
            case SECTION_IDS.CATEGORY:
              formData.categoryTitle = section.title;
              formData.categoryDescription = section.description;
              break;
            case SECTION_IDS.PROJECTS:
              formData.projectsTitle = section.title;
              formData.projectsDescription = section.description;
              break;
            case SECTION_IDS.SERVICES:
              formData.servicesTitle = section.title;
              formData.servicesDescription = section.description;
              break;
            case SECTION_IDS.RECENT_PROJECTS:
              formData.recentProjectsTitle = section.title;
              formData.recentProjectsDescription = section.description;
              break;
            case SECTION_IDS.PARTNERS:
              formData.partnersTitle = section.title;
              formData.partnersSubtitle = section.description;
              break;
            // Add cases for TESTIMONIAL and FAQ when they exist in API
          }
        }
      });

      reset({ ...defaultValues, ...formData });
    } catch (error) {
      console.error("Error loading home page sections:", error);
      toast.error("فشل في تحميل بيانات الصفحة الرئيسية");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSection = async (
    sectionId: number,
    data: { title?: string; description?: string }
  ) => {
    try {
      setUpdatingSections((prev) => ({ ...prev, [sectionId]: true }));

      const updatedSection = await updateSection(sectionId, data);

      // Update the specific section in state
      setSections((prev) => ({
        ...prev,
        [sectionId]: updatedSection,
      }));

      toast.success("تم تحديث القسم بنجاح", {
        duration: 4000,
        position: "top-center",
        icon: "✅",
      });

      // Reset form state after successful save
      // This will mark the form as clean
      // You might need to get the current form values and reset with them
    } catch (error: any) {
      console.error(`Error updating section ${sectionId}:`, error);
      const errorMessage =
        error.response?.data?.message || error.message || "فشل في تحديث القسم";
      toast.error(errorMessage, {
        duration: 4000,
        position: "top-center",
        icon: "❌",
      });
    } finally {
      setUpdatingSections((prev) => ({ ...prev, [sectionId]: false }));
    }
  };

  const onSave = async (values: HomeContentForm) => {
    try {
      // Update each section individually
      const updatePromises = [];

      // Hero Section
      if (sections[SECTION_IDS.HERO]) {
        updatePromises.push(
          handleUpdateSection(SECTION_IDS.HERO, {
            title: values.heroTitle,
            description: values.heroSubtitle,
          })
        );
      }

      // Category Section
      if (sections[SECTION_IDS.CATEGORY]) {
        updatePromises.push(
          handleUpdateSection(SECTION_IDS.CATEGORY, {
            title: values.categoryTitle,
            description: values.categoryDescription,
          })
        );
      }

      // Projects Section
      if (sections[SECTION_IDS.PROJECTS]) {
        updatePromises.push(
          handleUpdateSection(SECTION_IDS.PROJECTS, {
            title: values.projectsTitle,
            description: values.projectsDescription,
          })
        );
      }

      // Services Section
      if (sections[SECTION_IDS.SERVICES]) {
        updatePromises.push(
          handleUpdateSection(SECTION_IDS.SERVICES, {
            title: values.servicesTitle,
            description: values.servicesDescription,
          })
        );
      }

      // Recent Projects Section
      if (sections[SECTION_IDS.RECENT_PROJECTS]) {
        updatePromises.push(
          handleUpdateSection(SECTION_IDS.RECENT_PROJECTS, {
            title: values.recentProjectsTitle,
            description: values.recentProjectsDescription,
          })
        );
      }

      // Partners Section
      if (sections[SECTION_IDS.PARTNERS]) {
        updatePromises.push(
          handleUpdateSection(SECTION_IDS.PARTNERS, {
            title: values.partnersTitle,
            description: values.partnersSubtitle,
          })
        );
      }

      // Wait for all updates to complete
      await Promise.all(updatePromises);
    } catch (error) {
      console.error("Error saving home page sections:", error);
    }
  };

  const onCancel = () => {
    // Reset form to original fetched values
    const formData: Partial<HomeContentForm> = {};

    Object.values(SECTION_IDS).forEach((sectionId) => {
      const section = sections[sectionId];
      if (section) {
        switch (sectionId) {
          case SECTION_IDS.HERO:
            formData.heroTitle = section.title;
            formData.heroSubtitle = section.description;
            break;
          case SECTION_IDS.CATEGORY:
            formData.categoryTitle = section.title;
            formData.categoryDescription = section.description;
            break;
          case SECTION_IDS.PROJECTS:
            formData.projectsTitle = section.title;
            formData.projectsDescription = section.description;
            break;
          case SECTION_IDS.SERVICES:
            formData.servicesTitle = section.title;
            formData.servicesDescription = section.description;
            break;
          case SECTION_IDS.RECENT_PROJECTS:
            formData.recentProjectsTitle = section.title;
            formData.recentProjectsDescription = section.description;
            break;
          case SECTION_IDS.PARTNERS:
            formData.partnersTitle = section.title;
            formData.partnersSubtitle = section.description;
            break;
        }
      }
    });

    reset({ ...defaultValues, ...formData });
  };

  // Get last update time from sections
  const getLastUpdateTime = () => {
    const timestamps = Object.values(sections).map((section) =>
      new Date(section.updatedAt).getTime()
    );
    const latestTimestamp = Math.max(...timestamps);
    return new Date(latestTimestamp);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            جاري تحميل بيانات الصفحة الرئيسية...
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-6">
      {/* Hero Section */}
      <Card title="القسم الرئيسي" collapsible>
        <div className="space-y-4">
          <Controller
            name="heroTitle"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                id="hero-title"
                label="العنوان الرئيسي"
                placeholder="اكتب جملة جذابة للزائر"
              />
            )}
          />
          <Controller
            name="heroSubtitle"
            control={control}
            render={({ field }) => (
              <TextareaInput
                {...field}
                id="hero-subtitle"
                label="النص الفرعي"
                placeholder="اشرح بإيجاز ما يميز منصتك"
              />
            )}
          />
          <Uploader
            control={control}
            name="heroImage"
            label="صور الخلفية"
            accept="image/*"
            allowMultiple
            allowPrimary={false}
            maxFiles={2}
            rules={["الحد الأقصى لحجم الملف 9MB", "الحد الأقصى ملقان"]}
          />

          {/* Section Info */}
          {sections[SECTION_IDS.HERO] && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-600">
                  آخر تحديث:{" "}
                  {new Date(
                    sections[SECTION_IDS.HERO].updatedAt
                  ).toLocaleDateString("ar-EG")}
                </span>
                {updatingSections[SECTION_IDS.HERO] && (
                  <span className="text-sm text-orange-600">
                    جاري التحديث...
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Categories */}
      <Card title="الفئات" collapsible>
        <div className="space-y-4">
          <Controller
            name="categoryTitle"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                id="cat-title"
                label="عنوان القسم"
                placeholder="مثال: أنواع العقارات"
              />
            )}
          />
          <Controller
            name="categoryDescription"
            control={control}
            render={({ field }) => (
              <TextareaInput
                {...field}
                id="cat-desc"
                label="الوصف"
                placeholder="اشرح بإيجاز محتوى هذا القسم"
              />
            )}
          />

          {sections[SECTION_IDS.CATEGORY] && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-600">
                  آخر تحديث:{" "}
                  {new Date(
                    sections[SECTION_IDS.CATEGORY].updatedAt
                  ).toLocaleDateString("ar-EG")}
                </span>
                {updatingSections[SECTION_IDS.CATEGORY] && (
                  <span className="text-sm text-orange-600">
                    جاري التحديث...
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Projects */}
      <Card title="المشاريع" collapsible>
        <div className="space-y-4">
          <Controller
            name="projectsTitle"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                id="projects-title"
                label="عنوان القسم"
                placeholder="مثال: قائمة المشاريع"
              />
            )}
          />
          <Controller
            name="projectsDescription"
            control={control}
            render={({ field }) => (
              <TextareaInput
                {...field}
                id="projects-desc"
                label="الوصف"
                placeholder="اشرح بإيجاز محتوى المشاريع"
              />
            )}
          />

          {sections[SECTION_IDS.PROJECTS] && (
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-purple-600">
                  آخر تحديث:{" "}
                  {new Date(
                    sections[SECTION_IDS.PROJECTS].updatedAt
                  ).toLocaleDateString("ar-EG")}
                </span>
                {updatingSections[SECTION_IDS.PROJECTS] && (
                  <span className="text-sm text-orange-600">
                    جاري التحديث...
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Services */}
      <Card title="الخدمات" collapsible>
        <div className="space-y-4">
          <Controller
            name="servicesTitle"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                id="services-title"
                label="عنوان القسم"
                placeholder="مثال: خدماتنا"
              />
            )}
          />
          <Controller
            name="servicesDescription"
            control={control}
            render={({ field }) => (
              <TextareaInput
                {...field}
                id="services-desc"
                label="الوصف"
                placeholder="اشرح كيف تساعد خدماتك العملاء"
              />
            )}
          />

          {sections[SECTION_IDS.SERVICES] && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-yellow-600">
                  آخر تحديث:{" "}
                  {new Date(
                    sections[SECTION_IDS.SERVICES].updatedAt
                  ).toLocaleDateString("ar-EG")}
                </span>
                {updatingSections[SECTION_IDS.SERVICES] && (
                  <span className="text-sm text-orange-600">
                    جاري التحديث...
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Recent Projects */}
      <Card title="أحدث المشاريع" collapsible>
        <div className="space-y-4">
          <Controller
            name="recentProjectsTitle"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                id="recent-projects-title"
                label="عنوان القسم"
                placeholder="مثال: أحدث المشاريع"
              />
            )}
          />
          <Controller
            name="recentProjectsDescription"
            control={control}
            render={({ field }) => (
              <TextareaInput
                {...field}
                id="recent-projects-desc"
                label="الوصف"
                placeholder="اشرح بإيجاز محتوى المشاريع الحديثة"
              />
            )}
          />

          {sections[SECTION_IDS.RECENT_PROJECTS] && (
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-indigo-600">
                  آخر تحديث:{" "}
                  {new Date(
                    sections[SECTION_IDS.RECENT_PROJECTS].updatedAt
                  ).toLocaleDateString("ar-EG")}
                </span>
                {updatingSections[SECTION_IDS.RECENT_PROJECTS] && (
                  <span className="text-sm text-orange-600">
                    جاري التحديث...
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Testimonials */}
      <Card title="آراء العملاء" collapsible>
        <div className="space-y-4">
          <Controller
            name="testimonialTitle"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                id="test-title"
                label="عنوان القسم"
                placeholder="مثال: ماذا يقول عملاؤنا"
              />
            )}
          />
          <Controller
            name="testimonialSubtitle"
            control={control}
            render={({ field }) => (
              <TextareaInput
                {...field}
                id="test-subtitle"
                label="النص الفرعي"
                placeholder="أدخل اقتباس قصير من تجربة عميل"
              />
            )}
          />
        </div>
      </Card>

      {/* Partners */}
      <Card title="شركاؤنا" collapsible>
        <div className="space-y-4">
          <Controller
            name="partnersTitle"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                id="partners-title"
                label="عنوان القسم"
                placeholder="مثال: شركاؤنا في النجاح"
              />
            )}
          />
          <Controller
            name="partnersSubtitle"
            control={control}
            render={({ field }) => (
              <TextareaInput
                {...field}
                id="partners-subtitle"
                label="النص الفرعي"
                placeholder="اشرح بإيجاز ثقة عملائك"
              />
            )}
          />
          <Uploader
            control={control}
            name="partnersLogos"
            label="شعارات الشركاء"
            accept="image/*"
            allowMultiple
            allowPrimary={false}
          />

          {sections[SECTION_IDS.PARTNERS] && (
            <div className="p-3 bg-pink-50 border border-pink-200 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-pink-600">
                  آخر تحديث:{" "}
                  {new Date(
                    sections[SECTION_IDS.PARTNERS].updatedAt
                  ).toLocaleDateString("ar-EG")}
                </span>
                {updatingSections[SECTION_IDS.PARTNERS] && (
                  <span className="text-sm text-orange-600">
                    جاري التحديث...
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* FAQ */}
      <Card title="الأسئلة الشائعة" collapsible>
        <div className="space-y-4">
          <Controller
            name="faqTitle"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                id="faq-title"
                label="عنوان القسم"
                placeholder="مثال: لديك أسئلة؟"
              />
            )}
          />
          <Controller
            name="faqSubtitle"
            control={control}
            render={({ field }) => (
              <TextareaInput
                {...field}
                id="faq-subtitle"
                label="النص الفرعي"
                placeholder="اشرح بإيجاز محتوى الأسئلة"
              />
            )}
          />

          {/* Dynamic list */}
          <EditFAQSection control={control} name="faqs" />
        </div>
      </Card>

      <div className="col-span-12 flex items-center gap-6 flex-wrap">
        <PrimaryButton
          type="submit"
          loading={Object.values(updatingSections).some((status) => status)}
          disabled={
            !isDirty || Object.values(updatingSections).some((status) => status)
          }
        >
          {Object.values(updatingSections).some((status) => status)
            ? "جاري الحفظ..."
            : "حفظ التغييرات"}
        </PrimaryButton>
        <SoftActionButton
          onClick={onCancel}
          type="button"
          disabled={
            !isDirty || Object.values(updatingSections).some((status) => status)
          }
        >
          إلغاء
        </SoftActionButton>

        {Object.keys(sections).length > 0 && (
          <div className="text-sm text-gray-500">
            آخر تحديث: {getLastUpdateTime().toLocaleDateString("ar-EG")}
          </div>
        )}

        <SoftActionButton
          onClick={loadPageSections}
          type="button"
          className="text-blue-600 hover:bg-blue-100"
        >
          تحديث البيانات
        </SoftActionButton>
      </div>
    </form>
  );
}
