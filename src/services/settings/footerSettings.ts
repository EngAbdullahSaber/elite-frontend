// services/settings/footerSettings.ts

import { api } from "@/libs/axios";

export interface UpdatedByUser {
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
}

export interface FooterSettings {
  id: number;
  createdAt: string;
  updatedAt: string;
  footerParagraph: string;
  newsletterTitle: string;
  newsletterParagraph: string;
  updatedBy: UpdatedByUser;
}

export interface UpdateFooterSettingsData {
  footerParagraph?: string;
  newsletterTitle?: string;
  newsletterParagraph?: string;
}

// GET - Fetch footer settings
export async function getFooterSettings(
  signal?: AbortSignal
): Promise<FooterSettings> {
  try {
    const response = await api.get("/cms/settings/footer", {
      signal,
    });

    // Handle different response structures
    return response.data.data || response.data.record || response.data;
  } catch (error) {
    console.error("Error fetching footer settings:", error);
    throw error;
  }
}

// PATCH - Partial update footer settings
export async function patchFooterSettings(
  data: UpdateFooterSettingsData,
  signal?: AbortSignal
): Promise<FooterSettings> {
  try {
    const response = await api.patch("/cms/settings/footer", data, {
      signal,
    });

    return response.data.data || response.data.record || response.data;
  } catch (error) {
    console.error("Error patching footer settings:", error);
    throw error;
  }
}

// POST - Reset footer settings to default
export async function resetFooterSettings(
  signal?: AbortSignal
): Promise<FooterSettings> {
  try {
    const response = await api.post(
      "/cms/settings/footer/reset",
      {},
      {
        signal,
      }
    );

    return response.data.data || response.data.record || response.data;
  } catch (error) {
    console.error("Error resetting footer settings:", error);
    throw error;
  }
}

// Additional utility functions for specific updates

// POST - Update footer paragraph/copyright
export async function updateFooterParagraph(
  footerParagraph: string,
  signal?: AbortSignal
): Promise<FooterSettings> {
  try {
    const response = await api.post(
      "/cms/settings/footer/paragraph",
      { footerParagraph },
      { signal }
    );

    return response.data.data || response.data.record || response.data;
  } catch (error) {
    console.error("Error updating footer paragraph:", error);
    throw error;
  }
}

// POST - Update newsletter settings
export async function updateNewsletterSettings(
  newsletterTitle: string,
  newsletterParagraph: string,
  signal?: AbortSignal
): Promise<FooterSettings> {
  try {
    const response = await api.post(
      "/cms/settings/footer/newsletter",
      { newsletterTitle, newsletterParagraph },
      { signal }
    );

    return response.data.data || response.data.record || response.data;
  } catch (error) {
    console.error("Error updating newsletter settings:", error);
    throw error;
  }
}

// POST - Update newsletter title only
export async function updateNewsletterTitle(
  newsletterTitle: string,
  signal?: AbortSignal
): Promise<FooterSettings> {
  try {
    const response = await api.post(
      "/cms/settings/footer/newsletter/title",
      { newsletterTitle },
      { signal }
    );

    return response.data.data || response.data.record || response.data;
  } catch (error) {
    console.error("Error updating newsletter title:", error);
    throw error;
  }
}

// POST - Update newsletter paragraph only
export async function updateNewsletterParagraph(
  newsletterParagraph: string,
  signal?: AbortSignal
): Promise<FooterSettings> {
  try {
    const response = await api.post(
      "/cms/settings/footer/newsletter/paragraph",
      { newsletterParagraph },
      { signal }
    );

    return response.data.data || response.data.record || response.data;
  } catch (error) {
    console.error("Error updating newsletter paragraph:", error);
    throw error;
  }
}

// GET - Export footer settings (if needed)
export async function exportFooterSettings(
  signal?: AbortSignal
): Promise<Blob> {
  try {
    const response = await api.get("/cms/settings/footer/export", {
      responseType: "blob",
      signal,
    });

    return response.data;
  } catch (error) {
    console.error("Error exporting footer settings:", error);
    throw error;
  }
}

// POST - Import footer settings (if needed)
export async function importFooterSettings(
  file: File,
  signal?: AbortSignal
): Promise<FooterSettings> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/cms/settings/footer/import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      signal,
    });

    return response.data.data || response.data.record || response.data;
  } catch (error) {
    console.error("Error importing footer settings:", error);
    throw error;
  }
}
