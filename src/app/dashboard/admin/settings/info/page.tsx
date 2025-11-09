// app/dashboard/admin/settings/site-info/page.tsx
"use client";

import { useState, useEffect } from "react";
import DashboardHeaderTitle from "@/components/dashboard/DashboardHeaderTitle";
import CenteredContainer from "@/components/shared/CenteredContainer";
import { getSiteSettings } from "@/services/settings/siteSettings";
import WebsiteInfoForm, {
  mapApiResponseToForm,
} from "@/components/dashboard/admin/settings/WebsiteInfoForm";

export default function SiteInfoPage() {
  const [siteSettings, setSiteSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSiteSettings();
  }, []);

  const fetchSiteSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const settings = await getSiteSettings();
      setSiteSettings(settings);
    } catch (err) {
      setError("فشل في تحميل إعدادات الموقع");
      console.error("Error fetching site settings:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div>
        <DashboardHeaderTitle path={["معلومات الموقع"]} />
        <CenteredContainer>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="mr-2 text-gray-600">
              جاري تحميل إعدادات الموقع...
            </span>
          </div>
        </CenteredContainer>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <DashboardHeaderTitle path={["معلومات الموقع"]} />
        <CenteredContainer>
          <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-800 text-center">
            <p>{error}</p>
            <button
              onClick={fetchSiteSettings}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              إعادة المحاولة
            </button>
          </div>
        </CenteredContainer>
      </div>
    );
  }

  // Map API response to form values
  const formValues = siteSettings ? mapApiResponseToForm(siteSettings) : {};

  return (
    <div>
      <DashboardHeaderTitle path={["معلومات الموقع"]} />
      <CenteredContainer className="space-y-6">
        <WebsiteInfoForm defaultValues={formValues} />
      </CenteredContainer>
    </div>
  );
}
