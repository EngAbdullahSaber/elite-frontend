// hooks/settings/useSiteSettings.ts

import { useState, useEffect } from "react";
import {
  SiteSettings,
  getSiteSettings,
  updateSiteSettings,
} from "@/services/settings/siteSettings";

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSiteSettings();
      setSettings(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch site settings"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (data: Partial<SiteSettings>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedSettings = await updateSiteSettings(data);
      setSettings(updatedSettings);
      return updatedSettings;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update site settings";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    error,
    refetch: fetchSettings,
    updateSettings,
  };
}
