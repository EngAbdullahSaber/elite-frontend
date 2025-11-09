// services/cms/features.ts

import { api } from "@/libs/axios";

export interface Feature {
  id: number;
  createdAt: string;
  updatedAt: string;
  featureText: string;
}

export interface FeaturesResponse {
  records: Feature[];
  total_records: number;
  current_page: number;
  per_page: number;
  total_pages: number;
}

export interface CreateFeatureData {
  featureText: string;
}

export interface UpdateFeatureData {
  featureText?: string;
}

export interface FeaturesFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "createdAt" | "updatedAt" | "featureText";
  sortOrder?: "ASC" | "DESC";
}

export interface Step {
  id: number;
  createdAt: string;
  updatedAt: string;
  stepNumber: number;
  title: string;
  description: string;
}

export interface StepsResponse {
  records: Step[];
  total_records: number;
  current_page: number;
  per_page: number;
  total_pages: number;
}

export interface CreateStepData {
  stepNumber: number;
  title: string;
  description: string;
}

export interface UpdateStepData {
  stepNumber?: number;
  title?: string;
  description?: string;
}

export interface StepsFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "createdAt" | "updatedAt" | "stepNumber" | "title";
  sortOrder?: "ASC" | "DESC";
}

export interface Stat {
  id: number;
  createdAt: string;
  updatedAt: string;
  label: string;
  value: string;
}

export interface StatsResponse {
  records: Stat[];
  total_records: number;
  current_page: number;
  per_page: number;
  total_pages: number;
}

export interface CreateStatData {
  label: string;
  value: string;
}

export interface UpdateStatData {
  label?: string;
  value?: string;
}

export interface StatsFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "createdAt" | "updatedAt" | "label" | "value";
  sortOrder?: "ASC" | "DESC";
}

export interface Section {
  id: number;
  createdAt: string;
  updatedAt: string;
  sectionKey: string;
  title: string;
  description: string;
  page: {
    id: number;
    createdAt: string;
    updatedAt: string;
    slug: string;
    title: string;
    description: string;
  };
}

export interface SectionsResponse {
  total_records: number;
  current_page: number;
  per_page: number;
  records: Section[];
}

export interface CreateSectionData {
  sectionKey: string;
  title: string;
  description: string;
  pageId?: number;
}

export interface UpdateSectionData {
  sectionKey?: string;
  title?: string;
  description?: string;
}

export interface SectionsFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "createdAt" | "updatedAt" | "sectionKey" | "title";
  sortOrder?: "ASC" | "DESC";
  pageId?: number;
  pageSlug?: string;
} // Add these interfaces to your existing features.ts file

export interface Page {
  id: number;
  createdAt: string;
  updatedAt: string;
  slug: string | null;
  title: string;
  description: string;
  sections: Section[];
}

export interface PagesResponse {
  total_records: number;
  current_page: number;
  per_page: number;
  records: Page[];
}

export interface CreatePageData {
  slug?: string;
  title: string;
  description: string;
  sections?: CreateSectionData[];
}

export interface UpdatePageData {
  slug?: string;
  title?: string;
  description?: string;
}

export interface PagesFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "createdAt" | "updatedAt" | "title" | "slug";
  sortOrder?: "ASC" | "DESC";
  slug?: string;
}

export interface TeamMember {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  position: string;
  imageUrl: string;
}

export interface TeamMembersResponse {
  records: TeamMember[];
  total_records: number;
  current_page: number;
  per_page: number;
  total_pages: number;
}

export interface CreateTeamMemberData {
  name: string;
  position: string;
  imageUrl: string;
}

export interface UpdateTeamMemberData {
  name?: string;
  position?: string;
  imageUrl?: string;
}

export interface TeamMembersFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "createdAt" | "updatedAt" | "name" | "position";
  sortOrder?: "ASC" | "DESC";
}

// GET - Fetch all features with pagination and filtering
export async function getFeatures(
  params: FeaturesFilterParams = {},
  signal?: AbortSignal
): Promise<FeaturesResponse> {
  try {
    const queryParams = new URLSearchParams();

    // Pagination
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());

    // Filters
    if (params.search) queryParams.append("search", params.search);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const queryString = queryParams.toString();
    const url = `/cms/about/features${queryString ? `?${queryString}` : ""}`;

    const response = await api.get(url, { signal });

    return response.data;
  } catch (error) {
    console.error("Error fetching features:", error);
    throw error;
  }
}

// POST - Create new feature
export async function createFeature(
  data: CreateFeatureData,
  signal?: AbortSignal
): Promise<Feature> {
  try {
    const response = await api.post("/cms/about/features", data, {
      signal,
    });

    return response.data;
  } catch (error) {
    console.error("Error creating feature:", error);
    throw error;
  }
}

// DELETE - Delete feature
export async function deleteFeature(
  id: number,
  signal?: AbortSignal
): Promise<void> {
  try {
    await api.delete(`/cms/about/features/${id}`, {
      signal,
    });
  } catch (error) {
    console.error(`Error deleting feature ${id}:`, error);
    throw error;
  }
}

// GET - Fetch all steps with pagination and filtering
export async function getSteps(
  params: StepsFilterParams = {},
  signal?: AbortSignal
): Promise<StepsResponse> {
  try {
    const queryParams = new URLSearchParams();

    // Pagination
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());

    // Filters
    if (params.search) queryParams.append("search", params.search);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const queryString = queryParams.toString();
    const url = `/cms/about/steps${queryString ? `?${queryString}` : ""}`;

    const response = await api.get(url, { signal });

    return response.data;
  } catch (error) {
    console.error("Error fetching steps:", error);
    throw error;
  }
}

// POST - Create new step
export async function createStep(
  data: CreateStepData,
  signal?: AbortSignal
): Promise<Step> {
  try {
    const response = await api.post("/cms/about/steps", data, {
      signal,
    });

    return response.data;
  } catch (error) {
    console.error("Error creating step:", error);
    throw error;
  }
}

// DELETE - Delete step
export async function deleteStep(
  id: number,
  signal?: AbortSignal
): Promise<void> {
  try {
    await api.delete(`/cms/about/steps/${id}`, {
      signal,
    });
  } catch (error) {
    console.error(`Error deleting step ${id}:`, error);
    throw error;
  }
}
// Utility function to sort steps by stepNumber
export function sortStepsByNumber(steps: Step[]): Step[] {
  return steps.sort((a, b) => a.stepNumber - b.stepNumber);
}

// Utility function to get next available step number
export function getNextStepNumber(steps: Step[]): number {
  if (steps.length === 0) return 1;

  const maxStepNumber = Math.max(...steps.map((step) => step.stepNumber));
  return maxStepNumber + 1;
}
// GET - Fetch all stats with pagination and filtering
export async function getStats(
  params: StatsFilterParams = {},
  signal?: AbortSignal
): Promise<StatsResponse> {
  try {
    const queryParams = new URLSearchParams();

    // Pagination
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());

    // Filters
    if (params.search) queryParams.append("search", params.search);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const queryString = queryParams.toString();
    const url = `/cms/about/stats${queryString ? `?${queryString}` : ""}`;

    const response = await api.get(url, { signal });

    return response.data;
  } catch (error) {
    console.error("Error fetching stats:", error);
    throw error;
  }
}

// POST - Create new stat
export async function createStat(
  data: CreateStatData,
  signal?: AbortSignal
): Promise<Stat> {
  try {
    const response = await api.post("/cms/about/stats", data, {
      signal,
    });

    return response.data;
  } catch (error) {
    console.error("Error creating stat:", error);
    throw error;
  }
}

// DELETE - Delete stat
export async function deleteStat(
  id: number,
  signal?: AbortSignal
): Promise<void> {
  try {
    await api.delete(`/cms/about/stats/${id}`, {
      signal,
    });
  } catch (error) {
    console.error(`Error deleting stat ${id}:`, error);
    throw error;
  }
}
// GET - Fetch all sections for a specific page with pagination and filtering
export async function getPageSections(
  pageId: number,
  params: SectionsFilterParams = {},
  signal?: AbortSignal
): Promise<SectionsResponse> {
  try {
    const queryParams = new URLSearchParams();

    // Pagination
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());

    // Filters
    if (params.search) queryParams.append("search", params.search);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
    if (params.pageSlug) queryParams.append("pageSlug", params.pageSlug);

    const queryString = queryParams.toString();
    const url = `/cms/pages/${pageId}/sections${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await api.get(url, { signal });

    return response.data;
  } catch (error) {
    console.error(`Error fetching sections for page ${pageId}:`, error);
    throw error;
  }
}
// PATCH - Update section
export async function updateSection(
  id: number,
  data: UpdateSectionData,
  signal?: AbortSignal
): Promise<Section> {
  try {
    const response = await api.patch(`/cms/sections/${id}`, data, {
      signal,
    });

    return response.data;
  } catch (error) {
    console.error(`Error updating section ${id}:`, error);
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

    return response.data;
  } catch (error) {
    console.error(`Error fetching page ${id}:`, error);
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

    return response.data;
  } catch (error) {
    console.error(`Error updating page ${id}:`, error);
    throw error;
  }
}

// GET - Fetch all team members with pagination and filtering
export async function getTeamMembers(
  params: TeamMembersFilterParams = {},
  signal?: AbortSignal
): Promise<TeamMembersResponse> {
  try {
    const queryParams = new URLSearchParams();

    // Pagination
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());

    // Filters
    if (params.search) queryParams.append("search", params.search);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const queryString = queryParams.toString();
    const url = `/team${queryString ? `?${queryString}` : ""}`;

    const response = await api.get(url, { signal });

    return response.data;
  } catch (error) {
    console.error("Error fetching team members:", error);
    throw error;
  }
}

// GET - Fetch single team member by ID
export async function getTeamMemberById(
  id: number,
  signal?: AbortSignal
): Promise<TeamMember> {
  try {
    const response = await api.get(`/cms/team/${id}`, {
      signal,
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching team member ${id}:`, error);
    throw error;
  }
}

// POST - Create new team member
export async function createTeamMember(
  data: CreateTeamMemberData,
  signal?: AbortSignal
): Promise<TeamMember> {
  try {
    const response = await api.post("/team", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating team member:", error);
    throw error;
  }
}

// PATCH - Update team member
export async function updateTeamMember(
  id: number,
  data: UpdateTeamMemberData,
  signal?: AbortSignal
): Promise<TeamMember> {
  try {
    const response = await api.put(`/team/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error updating team member ${id}:`, error);
    throw error;
  }
}

// DELETE - Delete team member
export async function deleteTeamMember(
  id: number,
  signal?: AbortSignal
): Promise<void> {
  try {
    await api.delete(`/team/${id}`, {
      signal,
    });
  } catch (error) {
    console.error(`Error deleting team member ${id}:`, error);
    throw error;
  }
}
