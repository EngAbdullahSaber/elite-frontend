// services/settings/siteSettings.ts

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

export interface SiteSettings {
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
  snapchatUrl: string | null;
  tiktokUrl: string | null;
  youtubeUrl: string;
  updatedBy: UpdatedByUser;
}

export interface UpdateSiteSettingsData {
  latitude?: string;
  longitude?: string;
  introVideoUrl?: string;
  customerCount?: number;
  yearsExperience?: number;
  projectCount?: number;
  email?: string;
  phoneNumber?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  snapchatUrl?: string | null;
  tiktokUrl?: string | null;
  youtubeUrl?: string;
}

// GET - Fetch site settings
export async function getSiteSettings(
  signal?: AbortSignal
): Promise<SiteSettings> {
  try {
    const response = await api.get("/cms/settings/site", {
      signal,
    });

    // Handle different response structures
    return response.data.data || response.data.record || response.data;
  } catch (error) {
    console.error("Error fetching site settings:", error);
    throw error;
  }
}

// PATCH - Partial update site settings

export async function updateSiteSettings(
  data: UpdateSiteSettingsData,
  signal?: AbortSignal
): Promise<SiteSettings> {
  try {
    const response = await api.patch("/cms/settings/site", data, {
      signal,
    });

    return response.data.data || response.data.record || response.data;
  } catch (error) {
    console.error("Error patching site settings:", error);
    throw error;
  }
}

// Additional utility functions

// GET - Get site statistics (if needed separately)
export async function getSiteStatistics(signal?: AbortSignal): Promise<{
  customerCount: number;
  yearsExperience: number;
  projectCount: number;
}> {
  try {
    const response = await api.get("/cms/settings/site/statistics", {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching site statistics:", error);
    throw error;
  }
}

// POST - Update site location
export async function updateSiteLocation(
  latitude: string,
  longitude: string,
  signal?: AbortSignal
): Promise<SiteSettings> {
  try {
    const response = await api.post(
      "/cms/settings/site/location",
      { latitude, longitude },
      { signal }
    );

    return response.data.data || response.data.record || response.data;
  } catch (error) {
    console.error("Error updating site location:", error);
    throw error;
  }
}

// POST - Update social media links
export async function updateSocialMediaLinks(
  socialMedia: {
    twitterUrl?: string;
    instagramUrl?: string;
    snapchatUrl?: string | null;
    tiktokUrl?: string | null;
    youtubeUrl?: string;
  },
  signal?: AbortSignal
): Promise<SiteSettings> {
  try {
    const response = await api.post(
      "/cms/settings/site/social-media",
      socialMedia,
      { signal }
    );

    return response.data.data || response.data.record || response.data;
  } catch (error) {
    console.error("Error updating social media links:", error);
    throw error;
  }
}

// POST - Update contact information
export async function updateContactInfo(
  contactInfo: {
    email?: string;
    phoneNumber?: string;
  },
  signal?: AbortSignal
): Promise<SiteSettings> {
  try {
    const response = await api.post("/cms/settings/site/contact", contactInfo, {
      signal,
    });

    return response.data.data || response.data.record || response.data;
  } catch (error) {
    console.error("Error updating contact information:", error);
    throw error;
  }
}

// POST - Update company statistics
export async function updateCompanyStats(
  stats: {
    customerCount?: number;
    yearsExperience?: number;
    projectCount?: number;
  },
  signal?: AbortSignal
): Promise<SiteSettings> {
  try {
    const response = await api.post("/cms/settings/site/stats", stats, {
      signal,
    });

    return response.data.data || response.data.record || response.data;
  } catch (error) {
    console.error("Error updating company statistics:", error);
    throw error;
  }
}

// POST - Upload intro video
export async function uploadIntroVideo(
  videoFile: File,
  signal?: AbortSignal
): Promise<SiteSettings> {
  try {
    const formData = new FormData();
    formData.append("video", videoFile);

    const response = await api.post(
      "/cms/settings/site/intro-video",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        signal,
      }
    );

    return response.data.data || response.data.record || response.data;
  } catch (error) {
    console.error("Error uploading intro video:", error);
    throw error;
  }
}

// DELETE - Remove intro video
export async function removeIntroVideo(
  signal?: AbortSignal
): Promise<SiteSettings> {
  try {
    const response = await api.delete("/cms/settings/site/intro-video", {
      signal,
    });

    return response.data.data || response.data.record || response.data;
  } catch (error) {
    console.error("Error removing intro video:", error);
    throw error;
  }
}
