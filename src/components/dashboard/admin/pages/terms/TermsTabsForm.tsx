"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Control,
  Controller,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import Card from "@/components/shared/Card";
import TextInput from "@/components/shared/Forms/TextInput";
import TextareaInput from "@/components/shared/Forms/TextareaInput";
import PrimaryButton from "@/components/shared/Button";
import SoftActionButton from "@/components/shared/SoftActionButton";
import SidebarTabs from "@/components/shared/SidebarTabs";
import toast from "react-hot-toast";
import {
  getSiteSettings,
  updateSiteSettings,
} from "@/services/settings/siteSettings";

export type Term = { title: string; description: string };
export type TermsFormValues = {
  pageTitle: string;
  pageSubtitle: string;
  terms: Term[];
};

// Default terms content to use if no data is found
const defaultTermsContent: Term[] = [
  {
    title: "القبول بالشروط",
    description:
      "باستخدامك لهذه المنصة، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء من هذه الشروط، فيرجى عدم استخدام خدماتنا.",
  },
  {
    title: "استخدام الخدمة",
    description:
      "يجب استخدام المنصة لأغراض قانونية ومشروعة فقط. يُمنع استخدام الخدمة لأي نشاط غير قانوني أو غير مصرح به.",
  },
  {
    title: "الحسابات والمستخدمين",
    description:
      "أنت مسؤول عن الحفاظ على سرية حسابك وكلمة المرور. توافق على قبول المسؤولية عن جميع الأنشطة التي تحدث تحت حسابك.",
  },
  {
    title: "الخصوصية",
    description:
      "بياناتك الشخصية محمية وفقًا لسياسة الخصوصية الخاصة بنا. باستخدامك للخدمة، فإنك توافق على معالجة بياناتك وفقًا لهذه السياسة.",
  },
  {
    title: "الملكية الفكرية",
    description:
      "جميع المحتويات والمواد الموجودة على المنصة محمية بحقوق الملكية الفكرية. لا يسمح باستخدامها دون إذن كتابي مسبق.",
  },
  {
    title: "الضمان والمسؤولية",
    description:
      "نقدم الخدمة كما هي دون أي ضمانات. لا نتحمل المسؤولية عن أي أضرار ناتجة عن استخدام أو عدم القدرة على استخدام الخدمة.",
  },
  {
    title: "التعديلات",
    description:
      "نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إشعارك بأي تغييرات جوهرية عبر البريد الإلكتروني أو عبر المنصة.",
  },
  {
    title: "إنهاء الخدمة",
    description:
      "يحق لنا تعليق أو إنهاء وصولك إلى الخدمة في أي وقت دون إشعار لأي سبب، بما في ذلك انتهاك هذه الشروط.",
  },
];

// Helper function to parse HTML content to terms structure
const parseHtmlToTerms = (htmlContent: string): Term[] => {
  if (!htmlContent) return [];

  try {
    // Create a temporary DOM parser
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");

    const terms: Term[] = [];
    let currentTitle = "";
    let currentDescription = "";

    // Get all elements and process them
    const elements = doc.body.children;

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];

      if (element.tagName === "H2" || element.tagName === "H3") {
        // If we have a previous term, save it
        if (currentTitle && currentDescription) {
          terms.push({
            title: currentTitle,
            description: currentDescription.trim(),
          });
        }
        // Start new term
        currentTitle = element.textContent || "";
        currentDescription = "";
      } else {
        // Add to current description
        if (currentDescription) {
          currentDescription += "\n\n";
        }
        currentDescription += element.textContent || "";
      }
    }

    // Don't forget the last term
    if (currentTitle && currentDescription) {
      terms.push({
        title: currentTitle,
        description: currentDescription.trim(),
      });
    }

    return terms.length > 0 ? terms : defaultTermsContent;
  } catch (error) {
    console.error("Error parsing HTML to terms:", error);
    return defaultTermsContent;
  }
};

// Helper function to convert terms to HTML
const convertTermsToHtml = (terms: Term[]): string => {
  if (!terms.length) return "";

  let html = "";

  terms.forEach((term) => {
    if (term.title) {
      html += `<h2>${term.title}</h2>`;
    }
    if (term.description) {
      // Convert line breaks to paragraphs
      const paragraphs = term.description.split("\n\n").filter((p) => p.trim());
      paragraphs.forEach((paragraph) => {
        html += `<p>${paragraph.trim()}</p>`;
      });
    }
  });

  return html;
};

// Helper function to extract title and subtitle from HTML
const extractTitleAndSubtitle = (
  htmlContent: string
): { title: string; subtitle: string } => {
  if (!htmlContent) {
    return {
      title: "الشروط والأحكام",
      subtitle: "يرجى قراءة شروط الخدمة هذه بعناية قبل حجز خدمتنا.",
    };
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");

    // Try to find h1 for title and first p for subtitle
    const h1 = doc.querySelector("h1");
    const firstParagraph = doc.querySelector("p");

    return {
      title: h1?.textContent?.trim() || "الشروط والأحكام",
      subtitle:
        firstParagraph?.textContent?.trim() ||
        "يرجى قراءة شروط الخدمة هذه بعناية قبل حجز خدمتنا.",
    };
  } catch (error) {
    console.error("Error extracting title and subtitle:", error);
    return {
      title: "الشروط والأحكام",
      subtitle: "يرجى قراءة شروط الخدمة هذه بعناية قبل حجز خدمتنا.",
    };
  }
};

// Helper function to build complete HTML with title and subtitle
const buildCompleteHtml = (
  title: string,
  subtitle: string,
  terms: Term[]
): string => {
  let html = "";

  // Add title as h1
  if (title) {
    html += `<h1>${title}</h1>`;
  }

  // Add subtitle as first paragraph
  if (subtitle) {
    html += `<p>${subtitle}</p>`;
  }

  // Add terms content
  terms.forEach((term) => {
    if (term.title) {
      html += `<h2>${term.title}</h2>`;
    }
    if (term.description) {
      const paragraphs = term.description.split("\n\n").filter((p) => p.trim());
      paragraphs.forEach((paragraph) => {
        html += `<p>${paragraph.trim()}</p>`;
      });
    }
  });

  return html;
};

export default function TermsTabsForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<TermsFormValues>({
    defaultValues: {
      pageTitle: "الشروط والأحكام",
      pageSubtitle: "يرجى قراءة شروط الخدمة هذه بعناية قبل حجز خدمتنا.",
      terms: defaultTermsContent,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: control as unknown as Control<any>,
    name: "terms",
  });

  const watchedTerms = useWatch({ control, name: "terms" }) as
    | Term[]
    | undefined;
  const [activeIndex, setActiveIndex] = useState(0);

  // Fetch site settings data on component mount
  useEffect(() => {
    fetchSiteSettings();
  }, []);

  const fetchSiteSettings = async () => {
    try {
      setIsLoading(true);

      // Fetch site settings
      const siteSettings = await getSiteSettings();

      if (siteSettings && siteSettings.termsHtml) {
        // Extract title and subtitle from HTML
        const { title, subtitle } = extractTitleAndSubtitle(
          siteSettings.termsHtml
        );

        // Parse HTML content to terms structure (excluding title and first paragraph)
        const termsFromHtml = parseHtmlToTerms(siteSettings.termsHtml);

        // Reset form with fetched data
        reset({
          pageTitle: title,
          pageSubtitle: subtitle,
          terms: termsFromHtml,
        });
      } else {
        // If no terms HTML found, use defaults
        toast.warning(
          "لم يتم العثور على محتوى الشروط والأحكام، سيتم استخدام المحتوى الافتراضي"
        );
      }
    } catch (error) {
      console.error("Error fetching site settings:", error);
      toast.error("فشل في تحميل بيانات الشروط والأحكام");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const total = watchedTerms?.length ?? fields.length;
    if (!total) {
      setActiveIndex(0);
      return;
    }
    if (activeIndex > total - 1) setActiveIndex(total - 1);
  }, [watchedTerms?.length, fields.length, setActiveIndex]);

  const titles = useMemo(() => {
    const list =
      watchedTerms ??
      (fields as Array<{ title?: string }>).map((f) => ({
        title: (f as any).title ?? "",
      }));
    return list.map(
      (t, i) => `${String(i + 1).padStart(2, "0")}. ${t.title || "بند جديد"}`
    );
  }, [watchedTerms, fields]);

  const onSubmit = async (values: TermsFormValues) => {
    try {
      setIsSubmitting(true);

      // Build complete HTML with title, subtitle, and terms
      const completeHtml = buildCompleteHtml(
        values.pageTitle,
        values.pageSubtitle,
        values.terms
      );

      // Prepare update data
      const updateData = {
        termsHtml: completeHtml,
      };

 
      // Update the site settings
      await updateSiteSettings(updateData);

      toast.success("تم تحديث الشروط والأحكام بنجاح", {
        duration: 4000,
        position: "top-center",
        icon: "✅",
        style: {
          background: "#10B981",
          color: "#fff",
          borderRadius: "8px",
          fontSize: "14px",
        },
      });

     } catch (error: any) {
      console.error("Error updating site settings:", error);

      const errorMessage =
        error?.response?.data?.message ||
        "فشل في حفظ التغييرات. يرجى المحاولة مرة أخرى.";

      toast.error(errorMessage, {
        duration: 5000,
        position: "top-center",
        icon: "❌",
        style: {
          background: "#EF4444",
          color: "#fff",
          borderRadius: "8px",
          fontSize: "14px",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Reset to original fetched data
    fetchSiteSettings();
    toast.success("تم إلغاء التغييرات", {
      duration: 3000,
      position: "top-center",
    });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-12 gap-6">
        <Card title="بيانات الصفحة" className="mb-2 col-span-12">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="mr-2 text-gray-600">جاري تحميل البيانات...</span>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-12 gap-6">
      <Card title="بيانات الصفحة" className="mb-2 col-span-12">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-6">
            <Controller
              control={control}
              name="pageTitle"
              render={({ field }) => (
                <TextInput
                  id="terms-page-title"
                  label="عنوان الصفحة"
                  placeholder="عنوان الصفحة"
                  {...field}
                />
              )}
            />
          </div>
          <div className="col-span-12 md:col-span-6">
            <Controller
              control={control}
              name="pageSubtitle"
              render={({ field }) => (
                <TextInput
                  id="terms-page-subtitle"
                  label="وصف الصفحة"
                  placeholder="وصف مختصر"
                  {...field}
                />
              )}
            />
          </div>
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>ملاحظة:</strong> يمكنك تعديل عنوان ووصف الصفحة كما يمكنك
            إضافة وتعديل البنود أدناه.
          </p>
        </div>
      </Card>

      {/* Sidebar tabs */}
      <div className="col-span-12 xl:!col-span-4">
        <aside className="sticky top-24">
          <Card>
            <SidebarTabs
              titles={titles}
              activeIndex={activeIndex}
              onSelect={(i) => setActiveIndex(i)}
              onRemove={(i) => {
                const total = watchedTerms?.length ?? fields.length;
                if (total <= 1) return;
                let nextActive = activeIndex;
                if (i < activeIndex) nextActive = activeIndex - 1;
                else if (i === activeIndex)
                  nextActive = activeIndex > 0 ? activeIndex - 1 : 0;
                remove(i);
                const newTotal = total - 1;
                if (nextActive > newTotal - 1)
                  nextActive = Math.max(0, newTotal - 1);
                setActiveIndex(nextActive);
              }}
              canRemove={(i, total) => total > 1}
              getKey={(t, i) => `${t}-${i}`}
            />
            <button
              type="button"
              onClick={() => {
                const next = (watchedTerms?.length ?? fields.length) + 1;
                const padded = String(next).padStart(2, "0");
                append({
                  title: `بند جديد (${padded})`,
                  description: "",
                } as any);
                setActiveIndex(watchedTerms?.length ?? fields.length);
              }}
              className="mt-3 text-right focus:outline-none flex gap-2 items-center font-semibold py-3 px-5 rounded-full transition bg-white text-primary border border-primary hover:bg-primary hover:text-white"
            >
              + إضافة بند جديد
            </button>
          </Card>
        </aside>
      </div>

      {/* Right side: page title/subtitle and current term */}
      <div className="col-span-12 xl:!col-span-8 space-y-4">
        <Card title="عنوان البند" className="mb-2">
          <Controller
            control={control}
            key={activeIndex}
            name={`terms.${activeIndex}.title`}
            render={({ field }) => (
              <TextInput
                id="term-title"
                label="العنوان"
                placeholder="عنوان البند"
                {...field}
              />
            )}
          />
        </Card>

        <Card title="نص البند">
          <Controller
            control={control}
            key={`desc-${activeIndex}`}
            name={`terms.${activeIndex}.description`}
            render={({ field }) => (
              <TextareaInput
                id="term-description"
                placeholder="اكتب وصف البند هنا"
                {...field}
                rows={8}
              />
            )}
          />
          <div className="mt-2 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>تلميح:</strong> استخدم سطرين فارغين (Enter مرتين) لفصل
              الفقرات. سيتم تحويلها إلى فقرات منفصلة في HTML.
            </p>
          </div>
        </Card>
      </div>

      <div className="col-span-12 flex items-center gap-6 flex-wrap mt-1">
        <PrimaryButton type="submit" disabled={isSubmitting || !isDirty}>
          {isSubmitting ? "جاري الحفظ..." : "حفظ التغييرات"}
        </PrimaryButton>
        {isDirty && (
          <SoftActionButton onClick={handleCancel} disabled={isSubmitting}>
            إلغاء
          </SoftActionButton>
        )}
      </div>
    </form>
  );
}
