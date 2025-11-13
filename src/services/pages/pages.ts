// services/cms/pages.ts

import { api } from "@/libs/axios";

export interface PageContent {
  id: number;
  type: "text" | "image" | "video" | "embed" | "html" | "component";
  content: string;
  orderIndex: number;
  metadata?: Record<string, any>;
}

export interface PageSEO {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  metaTags: Record<string, string>;
  openGraph?: {
    title: string;
    description: string;
    image: string;
    url: string;
    type: string;
  };
  twitter?: {
    card: string;
    title: string;
    description: string;
    image: string;
  };
}

export interface PageSettings {
  isPublished: boolean;
  publishedAt: string | null;
  showInNavigation: boolean;
  navigationOrder: number;
  allowComments: boolean;
  isPasswordProtected: boolean;
  password: string | null;
  template: string;
  customCss: string;
  customJs: string;
  accessLevel: "public" | "private" | "restricted";
}

export interface PageUser {
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

export interface Page {
  id: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  slug: string;
  description: string | null;
  content: PageContent[];
  excerpt: string | null;
  featuredImage: string | null;
  parentId: number | null;
  pageType: "page" | "post" | "landing" | "template";
  seo: PageSEO;
  settings: PageSettings;
  authorId: number;
  isActive: boolean;
  author: PageUser;
  parent?: Page | null;
  children?: Page[];
  tags: string[];
  categories: string[];
  viewCount: number;
  likeCount: number;
  shareCount: number;
}

export type PagesResponse = {
  records: Page[];
  total_records: number;
  current_page: number;
  per_page: number;
  total_pages: number;
};

export interface CreatePageData {
  title: string;
  slug: string;
  description?: string | null;
  content?: PageContent[];
  excerpt?: string | null;
  featuredImage?: string | null;
  parentId?: number | null;
  pageType?: "page" | "post" | "landing" | "template";
  seo?: Partial<PageSEO>;
  settings?: Partial<PageSettings>;
  authorId: number;
  isActive?: boolean;
  tags?: string[];
  categories?: string[];
}

export interface UpdatePageData {
  title?: string;
  slug?: string;
  description?: string | null;
  content?: PageContent[];
  excerpt?: string | null;
  featuredImage?: string | null;
  parentId?: number | null;
  pageType?: "page" | "post" | "landing" | "template";
  seo?: Partial<PageSEO>;
  settings?: Partial<PageSettings>;
  isActive?: boolean;
  tags?: string[];
  categories?: string[];
}

export interface PageStats {
  totalPages: number;
  publishedPages: number;
  draftPages: number;
  totalPosts: number;
  totalLandingPages: number;
  totalTemplates: number;
  averageViews: number;
  totalViews: number;
  totalLikes: number;
  totalShares: number;
}

export interface PageFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  pageType?: "page" | "post" | "landing" | "template";
  isActive?: boolean;
  isPublished?: boolean;
  authorId?: number;
  parentId?: number | null;
  tags?: string[];
  categories?: string[];
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  showInNavigation?: boolean;
  startDate?: string;
  endDate?: string;
}

// GET - Fetch all pages with pagination and filtering
export async function getPages(
  params: PageFilterParams = {},
  signal?: AbortSignal
): Promise<PagesResponse> {
  try {
    // Convert params to query string

    const url = `/cms/pages`;

    const response = await api.get(url, { signal });

    // Handle different response structures
    const responseData = response.data.data || response.data;

    return {
      records:
        responseData.records || responseData.data || responseData.pages || [],
      total_records:
        responseData.total_records ||
        responseData.totalCount ||
        responseData.total ||
        0,
      current_page:
        responseData.current_page ||
        responseData.currentPage ||
        params.page ||
        1,
      per_page:
        responseData.per_page || responseData.perPage || params.limit || 10,
      total_pages:
        responseData.total_pages ||
        responseData.totalPages ||
        Math.ceil((responseData.total_records || 0) / (params.limit || 10)),
    };
  } catch (error) {
    console.error("Error fetching pages:", error);
    throw error;
  }
}

// GET - Fetch single page by ID
export async function getPageById(
  id: number,
  signal?: AbortSignal
): Promise<Page> {
  try {
    const response = await api.get(`/cms/pages/${id}`, {
      signal,
    });

 
    return response.data.data || response.data.record || response.data;
  } catch (error) {
    console.error(`Error fetching page ${id}:`, error);
    throw error;
  }
}

// GET - Fetch single page by slug
export async function getPageBySlug(
  slug: string,
  signal?: AbortSignal
): Promise<Page> {
  try {
    const response = await api.get(`/cms/pages/${slug}`, {
      signal,
    });

    return response.data.data || response.data.record || response.data;
  } catch (error) {
    console.error(`Error fetching page with slug ${slug}:`, error);
    throw error;
  }
}

// POST - Create new page
export async function createPage(
  data: CreatePageData,
  signal?: AbortSignal
): Promise<Page> {
  try {
    const response = await api.post("/cms/pages", data, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error creating page:", error);
    throw error;
  }
}

// PATCH - Update page
export async function updatePage(
  id: number,
  data: UpdatePageData,
  signal?: AbortSignal
): Promise<Page> {
  try {
    const response = await api.patch(`/cms/pages/${id}`, data, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error updating page ${id}:`, error);
    throw error;
  }
}

// DELETE - Delete page
export async function deletePage(
  id: number,
  signal?: AbortSignal
): Promise<void> {
  try {
    await api.delete(`/cms/pages/${id}`, {
      signal,
    });
  } catch (error) {
    console.error(`Error deleting page ${id}:`, error);
    throw error;
  }
}

// PATCH - Toggle page active status
export async function togglePageStatus(
  id: number,
  isActive: boolean,
  signal?: AbortSignal
): Promise<Page> {
  try {
    const response = await api.patch(
      `/cms/pages/${id}/status`,
      { isActive },
      { signal }
    );

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error toggling page ${id} status:`, error);
    throw error;
  }
}

// PATCH - Publish/unpublish page
export async function togglePagePublish(
  id: number,
  isPublished: boolean,
  signal?: AbortSignal
): Promise<Page> {
  try {
    const response = await api.patch(
      `/cms/pages/${id}/publish`,
      {
        isPublished,
        publishedAt: isPublished ? new Date().toISOString() : null,
      },
      { signal }
    );

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error toggling page ${id} publish status:`, error);
    throw error;
  }
}

// GET - Get page statistics
export async function getPageStats(
  id: number,
  signal?: AbortSignal
): Promise<{
  views: number;
  likes: number;
  shares: number;
  comments: number;
  lastViewed: string | null;
}> {
  try {
    const response = await api.get(`/cms/pages/${id}/stats`, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error fetching stats for page ${id}:`, error);
    throw error;
  }
}

// GET - Get overall pages statistics
export async function getOverallPageStats(
  params?: {
    startDate?: string;
    endDate?: string;
    authorId?: number;
    pageType?: string;
  },
  signal?: AbortSignal
): Promise<PageStats> {
  try {
    const response = await api.get("/cms/pages/stats/overall", {
      params,
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching overall page stats:", error);
    throw error;
  }
}

// GET - Get pages by author
export async function getPagesByAuthor(
  authorId: number,
  params?: {
    page?: number;
    limit?: number;
    pageType?: string;
    isActive?: boolean;
    isPublished?: boolean;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
  },
  signal?: AbortSignal
): Promise<PagesResponse> {
  try {
    const response = await api.get(`/cms/pages/author/${authorId}`, {
      params,
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error fetching pages for author ${authorId}:`, error);
    throw error;
  }
}

// GET - Get pages by type
export async function getPagesByType(
  pageType: string,
  params?: {
    page?: number;
    limit?: number;
    isActive?: boolean;
    isPublished?: boolean;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
  },
  signal?: AbortSignal
): Promise<PagesResponse> {
  try {
    const response = await api.get(`/cms/pages/type/${pageType}`, {
      params,
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error fetching pages for type ${pageType}:`, error);
    throw error;
  }
}

// GET - Get navigation pages
export async function getNavigationPages(
  params?: {
    pageType?: string;
    isActive?: boolean;
  },
  signal?: AbortSignal
): Promise<Page[]> {
  try {
    const response = await api.get("/cms/pages/navigation", {
      params: {
        showInNavigation: true,
        isPublished: true,
        ...params,
      },
      signal,
    });

    const responseData = response.data.data || response.data;
    return (
      responseData.records || responseData.data || responseData.pages || []
    );
  } catch (error) {
    console.error("Error fetching navigation pages:", error);
    throw error;
  }
}

// GET - Get featured pages
export async function getFeaturedPages(
  params?: {
    page?: number;
    limit?: number;
    pageType?: string;
  },
  signal?: AbortSignal
): Promise<PagesResponse> {
  try {
    const response = await api.get("/cms/pages/featured", {
      params,
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching featured pages:", error);
    throw error;
  }
}

// GET - Search pages
export async function searchPages(
  query: string,
  params?: {
    page?: number;
    limit?: number;
    pageType?: string;
    isActive?: boolean;
    isPublished?: boolean;
  },
  signal?: AbortSignal
): Promise<PagesResponse> {
  try {
    const response = await api.get("/cms/pages/search", {
      params: {
        search: query,
        ...params,
      },
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error searching pages:", error);
    throw error;
  }
}

// POST - Duplicate page
export async function duplicatePage(
  id: number,
  newTitle?: string,
  newSlug?: string,
  signal?: AbortSignal
): Promise<Page> {
  try {
    const response = await api.post(
      `/cms/pages/${id}/duplicate`,
      { newTitle, newSlug },
      { signal }
    );

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error duplicating page ${id}:`, error);
    throw error;
  }
}

// POST - Increment page views
export async function incrementPageViews(
  id: number,
  signal?: AbortSignal
): Promise<void> {
  try {
    await api.post(`/cms/pages/${id}/views`, {}, { signal });
  } catch (error) {
    console.error(`Error incrementing views for page ${id}:`, error);
    throw error;
  }
}

// POST - Like page
export async function likePage(
  id: number,
  signal?: AbortSignal
): Promise<{ likes: number }> {
  try {
    const response = await api.post(`/cms/pages/${id}/like`, {}, { signal });
    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error liking page ${id}:`, error);
    throw error;
  }
}

// POST - Unlike page
export async function unlikePage(
  id: number,
  signal?: AbortSignal
): Promise<{ likes: number }> {
  try {
    const response = await api.post(`/cms/pages/${id}/unlike`, {}, { signal });
    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error unliking page ${id}:`, error);
    throw error;
  }
}

// GET - Get page count by filters
export async function getPageCount(
  filters?: {
    pageType?: string;
    isActive?: boolean;
    isPublished?: boolean;
    authorId?: number;
  },
  signal?: AbortSignal
): Promise<{ count: number }> {
  try {
    const response = await api.get("/cms/pages/count", {
      params: filters,
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching page count:", error);
    throw error;
  }
}

// GET - Get pages by tags
export async function getPagesByTags(
  tags: string[],
  params?: {
    page?: number;
    limit?: number;
    pageType?: string;
    isActive?: boolean;
    isPublished?: boolean;
  },
  signal?: AbortSignal
): Promise<PagesResponse> {
  try {
    const response = await api.get("/cms/pages/tags", {
      params: {
        tags: tags.join(","),
        ...params,
      },
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching pages by tags:", error);
    throw error;
  }
}

// GET - Get pages by categories
export async function getPagesByCategories(
  categories: string[],
  params?: {
    page?: number;
    limit?: number;
    pageType?: string;
    isActive?: boolean;
    isPublished?: boolean;
  },
  signal?: AbortSignal
): Promise<PagesResponse> {
  try {
    const response = await api.get("/cms/pages/categories", {
      params: {
        categories: categories.join(","),
        ...params,
      },
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching pages by categories:", error);
    throw error;
  }
}

// GET - Get all available tags
export async function getAllTags(signal?: AbortSignal): Promise<string[]> {
  try {
    const response = await api.get("/cms/pages/tags/all", {
      signal,
    });

    return response.data.data || response.data || [];
  } catch (error) {
    console.error("Error fetching all tags:", error);
    throw error;
  }
}

// GET - Get all available categories
export async function getAllCategories(
  signal?: AbortSignal
): Promise<string[]> {
  try {
    const response = await api.get("/cms/pages/categories/all", {
      signal,
    });

    return response.data.data || response.data || [];
  } catch (error) {
    console.error("Error fetching all categories:", error);
    throw error;
  }
}
