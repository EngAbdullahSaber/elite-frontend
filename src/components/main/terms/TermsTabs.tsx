"use client";

import { getSiteSettings } from "@/services/settings/siteSettings";
import { useMemo, useState, useEffect } from "react";

function toId(s: string) {
  return s
    .trim()
    .toLowerCase()
    .replace(/[^\u0600-\u06FF\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

// Helper function to parse HTML and extract sections
function parseTermsHtml(
  html: string
): Array<{ title: string; description: string }> {
  const sections: Array<{ title: string; description: string }> = [];

  // Create a temporary DOM parser
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Get all heading elements and their following content
  const headings = doc.querySelectorAll("h1, h2, h3, h4, h5, h6");

  headings.forEach((heading, index) => {
    const title = heading.textContent?.trim() || "";

    // Get content until next heading
    let description = "";
    let nextElement = heading.nextElementSibling;

    while (nextElement && !nextElement.matches("h1, h2, h3, h4, h5, h6")) {
      description += nextElement.outerHTML;
      nextElement = nextElement.nextElementSibling;
    }

    // If no description found, try to get text content
    if (!description) {
      description = heading.nextSibling?.textContent?.trim() || "";
    }

    // Clean up the description - remove extra whitespace
    description = description.trim();

    if (title) {
      sections.push({
        title,
        description: description || "لا يوجد محتوى مفصل لهذا البند.",
      });
    }
  });

  // Fallback if no headings found
  if (sections.length === 0) {
    const paragraphs = doc.querySelectorAll("p");
    paragraphs.forEach((p, index) => {
      const text = p.textContent?.trim();
      if (text) {
        sections.push({
          title: `البند ${index + 1}`,
          description: text,
        });
      }
    });
  }

  return sections;
}

export default function TermsTabs() {
  const [termsData, setTermsData] = useState<
    Array<{ title: string; description: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const settings = await getSiteSettings();

        if (settings.termsHtml) {
          const parsedSections = parseTermsHtml(settings.termsHtml);
          setTermsData(parsedSections);
        } else {
          setTermsData([]);
        }
      } catch (err) {
        console.error("Error fetching terms:", err);
        setError("فشل في تحميل الشروط والأحكام. يرجى المحاولة مرة أخرى.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTerms();
  }, []);

  const sections = useMemo(
    () => termsData.map((i) => ({ ...i, id: toId(i.title) })),
    [termsData]
  );

  const copyLink = async (hash: string) => {
    try {
      const url = `${location.origin}${location.pathname}${location.search}#${hash}`;
      await navigator.clipboard.writeText(url);
    } catch {}
  };

  if (isLoading) {
    return (
      <div className="container px-3 relative z-[1]">
        <div className="rounded-2xl bg-white border border-neutral-200 p-5 md:p-8 lg:p-10">
          <div className="flex justify-center items-center py-10">
            <div className="animate-pulse text-lg text-neutral-600">
              جاري تحميل الشروط والأحكام...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container px-3 relative z-[1]">
        <div className="rounded-2xl bg-white border border-neutral-200 p-5 md:p-8 lg:p-10">
          <div className="flex justify-center items-center py-10">
            <div className="text-red-600 text-lg">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  if (sections.length === 0) {
    return (
      <div className="container px-3 relative z-[1]">
        <div className="rounded-2xl bg-white border border-neutral-200 p-5 md:p-8 lg:p-10">
          <div className="flex justify-center items-center py-10">
            <div className="text-neutral-600 text-lg">
              لا توجد شروط وأحكام متاحة حالياً.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-3 relative z-[1]">
      <div className="rounded-2xl bg-white border border-neutral-200 p-5 md:p-8 lg:p-10">
        {/* Header row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="h3">{sections[0]?.title}</h3>
            <p className="mt-2 text-neutral-600">{sections[0]?.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-full border border-neutral-300 hover:bg-neutral-50 text-sm"
              aria-label="طباعة الشروط"
            >
              طباعة
            </button>
          </div>
        </div>

        <div className="border-t border-dashed my-6 lg:my-8" />

        {/* Grid: TOC + content */}
        <div className="grid grid-cols-12 gap-6">
          {/* TOC */}
          <aside className="col-span-12 lg:col-span-4 2xl:col-span-3">
            <div className="sticky top-24 rounded-2xl border border-neutral-200 bg-[var(--bg-2)] p-4">
              <div className="font-semibold mb-3">محتويات الصفحة</div>
              <nav className="space-y-2" aria-label="جدول المحتويات">
                {sections.slice(1).map((s, i) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="block rounded-xl px-4 py-2 text-neutral-800 hover:bg-white transition"
                  >
                    <span className="ml-2 text-neutral-500">{`${(i + 1)
                      .toString()
                      .padStart(2, "0")}.`}</span>
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <main className="col-span-12 lg:col-span-8 2xl:col-start-5 2xl:col-span-8">
            <div role="tabpanel" className="space-y-8">
              {sections.slice(1).map((s, idx) => (
                <section
                  key={s.id}
                  id={s.id}
                  aria-labelledby={`${s.id}-title`}
                  className="scroll-mt-28"
                >
                  <div className="flex items-start gap-3">
                    <h4
                      id={`${s.id}-title`}
                      className="text-2xl font-bold text-neutral-900"
                    >
                      {`${(idx + 1).toString().padStart(2, "0")}. ${s.title}`}
                    </h4>
                    <button
                      onClick={() => copyLink(s.id)}
                      className="mt-1 text-xs rounded-full border border-neutral-300 px-2 py-1 hover:bg-neutral-50"
                      aria-label={`نسخ الرابط إلى ${s.title}`}
                      title="نسخ الرابط"
                    >
                      نسخ الرابط
                    </button>
                  </div>
                  <div
                    className="mt-3 leading-8 text-neutral-700 prose prose-neutral max-w-none"
                    dangerouslySetInnerHTML={{ __html: s.description }}
                  />
                  <div className="mt-5 h-px w-full bg-gradient-to-l from-transparent via-neutral-200 to-transparent" />
                </section>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
