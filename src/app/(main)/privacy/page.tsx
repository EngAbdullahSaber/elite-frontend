"use client";

import React, { useState, useEffect } from "react";
import PolicyGroup from "@/components/main/privacy/PolicyGroup";
import PageHeader from "@/components/shared/PageHeader";
import { getSiteSettings } from "@/services/settings/siteSettings";

// Helper function to parse privacy HTML into PolicyGroup format
function parsePrivacyHtml(html: string): { title: string; items: string[] }[] {
  const policies: { title: string; items: string[] }[] = [];

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Get all heading elements
  const headings = doc.querySelectorAll("h1, h2, h3, h4, h5, h6");

  headings.forEach((heading) => {
    const title = heading.textContent?.trim() || "";

    if (title) {
      // Collect content until next heading
      const items: string[] = [];
      let nextElement = heading.nextElementSibling;

      while (nextElement && !nextElement.matches("h1, h2, h3, h4, h5, h6")) {
        const textContent = nextElement.textContent?.trim();
        if (textContent) {
          items.push(textContent);
        }
        nextElement = nextElement.nextElementSibling;
      }

      // If no items found, try to get direct text content after heading
      if (items.length === 0) {
        let nextNode = heading.nextSibling;
        while (nextNode && nextNode.nodeType === Node.TEXT_NODE) {
          const text = nextNode.textContent?.trim();
          if (text) {
            items.push(text);
          }
          nextNode = nextNode.nextSibling;
        }
      }

      policies.push({
        title,
        items: items.length > 0 ? items : ["لا يوجد محتوى مفصل لهذا البند."],
      });
    }
  });

  // Fallback: if no headings found, use paragraphs as items
  if (policies.length === 0) {
    const paragraphs = doc.querySelectorAll("p");
    const items: string[] = [];

    paragraphs.forEach((p) => {
      const text = p.textContent?.trim();
      if (text) {
        items.push(text);
      }
    });

    if (items.length > 0) {
      policies.push({
        title: "سياسة الخصوصية",
        items,
      });
    }
  }

  return policies;
}

export default function PrivacyPage() {
  const [privacyGroups, setPrivacyGroups] = useState<
    { title: string; items: string[] }[][]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrivacyData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const settings = await getSiteSettings();

        if (settings.privacyHtml) {
          const parsedPolicies = parsePrivacyHtml(settings.privacyHtml);
          // Group policies into arrays for PolicyGroup component
          setPrivacyGroups([parsedPolicies]);
        } else {
          setPrivacyGroups([]);
        }
      } catch (err) {
        console.error("Error fetching privacy policy:", err);
        setError("فشل في تحميل سياسة الخصوصية. يرجى المحاولة مرة أخرى.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrivacyData();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-bg-2">
        <PageHeader
          title="سياسة الخصوصية"
          description="جاري تحميل سياسة الخصوصية..."
        />
        <div className="bg-bg-2 relative before:absolute before:w-full before:h-[150px] before:top-0 before:left-0 before:bg-dark">
          <div className="container px-3 relative z-[1] lg:mb-[60px]">
            <div className="flex justify-center items-center py-20">
              <div className="animate-pulse text-lg text-neutral-600">
                جاري تحميل سياسة الخصوصية...
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-bg-2">
        <PageHeader
          title="سياسة الخصوصية"
          description="حدث خطأ أثناء تحميل سياسة الخصوصية"
        />
        <div className="bg-bg-2 relative before:absolute before:w-full before:h-[150px] before:top-0 before:left-0 before:bg-dark">
          <div className="container px-3 relative z-[1] lg:mb-[60px]">
            <div className="flex justify-center items-center py-20">
              <div className="text-red-600 text-lg text-center">{error}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-2">
      <PageHeader
        title="سياسة الخصوصية"
        description="نحن نحترم خصوصيتك وملتزمون بحماية بياناتك الشخصية."
      />
      <div className="bg-bg-2 relative before:absolute before:w-full before:h-[150px] before:top-0 before:left-0 before:bg-dark">
        <div className="container px-3 relative z-[1] lg:mb-[60px] space-y-4 lg:space-y-6">
          {privacyGroups.length > 0 ? (
            privacyGroups.map((group, idx) => (
              <PolicyGroup key={idx} policies={group} />
            ))
          ) : (
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-center text-neutral-600">
              لا توجد سياسة خصوصية متاحة حالياً.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
