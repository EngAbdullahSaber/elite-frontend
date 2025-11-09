"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import FaqList from "@/components/shared/FaqList";
import { getGroups } from "@/services/faqs/faqs";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  createdAt?: string;
  updatedAt?: string;
}

interface FAQGroup {
  id: number;
  title: string;
  items: FAQItem[];
  createdAt?: string;
  updatedAt?: string;
}

// Static fallback data
const fallbackFaqGroups: FAQGroup[] = [
  {
    id: 1,
    title: "شراء منزل جديد",
    items: [
      {
        id: 1,
        question: "ما هي خطوات شراء المنزل؟",
        answer: "تبدأ بتحديد الميزانية، ثم البحث، ثم التفاوض، وأخيرًا التوثيق.",
      },
      {
        id: 2,
        question: "هل يمكن الحصول على تمويل عقاري؟",
        answer: "نعم، توفر البنوك برامج تمويل متنوعة حسب الدخل.",
      },
      {
        id: 3,
        question: "ما هي الرسوم الإضافية؟",
        answer: "تشمل رسوم التسجيل، الضرائب، وأتعاب المحامي أو الوسيط.",
      },
      {
        id: 4,
        question: "هل يمكن زيارة العقار قبل الشراء؟",
        answer: "بالطبع، ننصح بزيارة العقار أكثر من مرة قبل اتخاذ القرار.",
      },
    ],
  },
  {
    id: 2,
    title: "بيع عقار سكني",
    items: [
      {
        id: 5,
        question: "كيف أحدد سعر البيع؟",
        answer: "يُفضل تقييم العقار عبر خبير أو مقارنة السوق المحلي.",
      },
      {
        id: 6,
        question: "هل يجب توثيق العقد؟",
        answer: "نعم، لضمان الحقوق القانونية للطرفين.",
      },
      {
        id: 7,
        question: "هل يمكن البيع بدون وسيط؟",
        answer: "نعم، لكن وجود وسيط يسهل الإجراءات ويزيد فرص البيع.",
      },
      {
        id: 8,
        question: "ما هي مدة إتمام البيع؟",
        answer:
          "تختلف حسب التفاوض والإجراءات، لكنها غالبًا تستغرق من أسبوعين إلى شهر.",
      },
    ],
  },
];

export default function FeqTaps() {
  const [faqGroups, setFaqGroups] = useState<FAQGroup[]>(fallbackFaqGroups);
  const [activeTitle, setActiveTitle] = useState<string>(
    fallbackFaqGroups[0].title
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Support deep link via ?group=<slug>
  const toSlug = (s: string) =>
    s
      .trim()
      .toLowerCase()
      .replace(/[^\u0600-\u06FF\w\s-]/g, "")
      .replace(/\s+/g, "-");

  // Fetch FAQ groups from CMS
  useEffect(() => {
    async function fetchFaqGroups() {
      try {
        setLoading(true);
        setError(null);

        const response = await getGroups();

        // Handle different response structures
        const faqData =
          response?.records || response?.data?.records || response;

        if (faqData && Array.isArray(faqData) && faqData.length > 0) {
          // Filter out groups with no items and ensure items array exists
          const validGroups = faqData
            .filter((group: FAQGroup) => group.items && group.items.length > 0)
            .map((group: FAQGroup) => ({
              ...group,
              items: group.items || [],
            }));

          if (validGroups.length > 0) {
            setFaqGroups(validGroups);
            setActiveTitle(validGroups[0].title);
          } else {
            // If no valid groups from API, use fallback
            setFaqGroups(fallbackFaqGroups);
            setError("لا توجد مجموعات أسئلة متاحة");
          }
        } else {
          // If API returns empty or invalid data, use fallback
          setFaqGroups(fallbackFaqGroups);
          setError("فشل في تحميل الأسئلة الشائعة");
        }
      } catch (err) {
        console.error("Error fetching FAQ groups:", err);
        setError("فشل في تحميل الأسئلة الشائعة");
        setFaqGroups(fallbackFaqGroups);
      } finally {
        setLoading(false);
      }
    }

    fetchFaqGroups();
  }, []);

  // Handle URL deep linking
  useEffect(() => {
    if (loading || !faqGroups.length) return;

    const url = new URL(window.location.href);
    const g = url.searchParams.get("group");
    if (!g) return;

    const bySlug = faqGroups.find((f) => toSlug(f.title) === g);
    if (bySlug) setActiveTitle(bySlug.title);
  }, [loading, faqGroups]);

  // Update URL when active title changes
  useEffect(() => {
    if (loading || !faqGroups.length) return;

    const url = new URL(window.location.href);
    url.searchParams.set("group", toSlug(activeTitle));
    history.replaceState(null, "", url.toString());
  }, [activeTitle, loading, faqGroups]);

  const activeFaq = faqGroups.find((g) => g.title === activeTitle);

  // Loading state
  if (loading) {
    return (
      <>
        {/* Sidebar Loading */}
        <div className="col-span-12 lg:col-span-4 2xl:col-span-3">
          <aside className="sticky top-24 flex flex-col-reverse lg:flex-col gap-4 lg:gap-6">
            <div className="bg-[var(--bg-2)] rounded-2xl p-3 md:p-6 mb-6 border border-neutral-200">
              <div className="flex flex-col gap-2">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div
                    key={item}
                    className="h-12 bg-gray-200 rounded-full animate-pulse"
                  ></div>
                ))}
              </div>
            </div>

            {/* Banner Loading */}
            <div className="px-6 py-10 rounded-2xl overflow-hidden relative isolate bg-gray-200 animate-pulse">
              <div className="h-6 bg-gray-300 rounded w-32 mb-4"></div>
              <div className="h-10 bg-gray-300 rounded-full w-32"></div>
            </div>
          </aside>
        </div>

        {/* Content Loading */}
        <div className="col-span-12 lg:col-span-8 2xl:col-start-5 2xl:col-span-8">
          <div className="h-8 bg-gray-200 rounded-lg animate-pulse w-48 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-gray-100 rounded-lg p-4 animate-pulse"
              >
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Sidebar */}
      <div className="col-span-12 lg:col-span-4 2xl:col-span-3">
        <aside className="sticky top-24 flex flex-col-reverse lg:flex-col gap-4 lg:gap-6 ">
          {error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-4">
              <p className="text-yellow-800 text-sm">{error}</p>
            </div>
          )}

          <div className="bg-[var(--bg-2)] rounded-2xl p-3 md:p-6 mb-6 border border-neutral-200">
            <div
              role="tablist"
              aria-orientation="vertical"
              className="flex flex-col gap-2"
            >
              {faqGroups.map((group, index) => {
                const active = activeTitle === group.title;
                return (
                  <button
                    key={group.id}
                    role="tab"
                    aria-selected={active}
                    aria-controls={`panel-${toSlug(group.title)}`}
                    id={`tab-${toSlug(group.title)}`}
                    onClick={() => setActiveTitle(group.title)}
                    className={`text-right focus:outline-none flex gap-2 items-center font-medium py-3 px-5 rounded-full transition
                      ${
                        active
                          ? "bg-primary text-white shadow-sm"
                          : "text-neutral-800 hover:bg-white"
                      }
                    `}
                  >
                    <span className="inline-block w-8 text-neutral-500">
                      {`${index + 1}`.padStart(2, "0")}.
                    </span>
                    <span className="truncate">{group.title}</span>
                    <span
                      className={`ms-auto text-xs ${
                        active ? "text-white/80" : "text-neutral-500"
                      }`}
                    >
                      {group.items.length} سؤال
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Banner */}
          <div className="px-6 py-10 rounded-2xl overflow-hidden relative isolate bg-[url('/main/faq/faq-banner-img.jpg')] bg-cover bg-center bg-no-repeat">
            <div className="absolute inset-0 bg-black/35 -z-10" />
            <h4 className="mb-6 text-2xl font-semibold text-white">
              ابحث عن عقارك المثالي
            </h4>
            <Link
              className="py-3 px-6 bg-white rounded-full font-semibold text-primary inline-block hover:brightness-95"
              href="/contact-us"
              aria-label="تواصل معنا"
            >
              تواصل معنا
            </Link>
          </div>
        </aside>
      </div>

      {/* Content */}
      <div className="col-span-12 lg:col-span-8 2xl:col-start-5 2xl:col-span-8">
        <h2
          className="h2 mb-5 lg:mb-8"
          id={`panel-${toSlug(activeTitle)}`}
          role="tabpanel"
          aria-labelledby={`tab-${toSlug(activeTitle)}`}
        >
          {activeTitle}
        </h2>
        <FaqList faqs={activeFaq?.items ?? []} />
      </div>
    </>
  );
}
