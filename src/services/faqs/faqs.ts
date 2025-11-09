import { api } from "@/libs/axios";

export interface FAQItem {
  id: number;
  createdAt: string;
  updatedAt: string;
  question: string;
  answer: string;
  groupId?: number;
}

export interface FAQGroup {
  id: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  items: FAQItem[];
}

export interface FAQGroupsResponse {
  total_records: number;
  current_page: number;
  per_page: number;
  records: FAQGroup[];
}

export interface FAQItemsResponse {
  total_records: number;
  current_page: number;
  per_page: number;
  records: FAQItem[];
}

export interface CreateFAQGroupData {
  title: string;
}

export interface UpdateFAQGroupData {
  title?: string;
}

export interface CreateFAQItemData {
  question: string;
  answer: string;
  groupId: number;
}

export interface UpdateFAQItemData {
  question?: string;
  answer?: string;
  groupId?: number;
}

// GET - Get FAQ groups (alternative implementation)
export async function getGroups(signal?: AbortSignal): Promise<FAQGroup[]> {
  try {
    const response = await api.get("/cms/faq", {
      signal,
    });
    return (
      response.data.data?.records || response.data.records || response.data
    );
  } catch (error) {
    console.error("Error fetching FAQ groups:", error);
    throw error;
  }
}

// POST - Create FAQ group with specific data structure
export async function createGroup(
  data: { title: string },
  signal?: AbortSignal
): Promise<FAQGroup> {
  try {
    const response = await api.post("/cms/faq/groups", data, {
      signal,
    });
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error creating FAQ group:", error);
    throw error;
  }
}

// PATCH - Update FAQ group with specific data structure
export async function updateGroup(
  id: number,
  data: { title: string },
  signal?: AbortSignal
): Promise<FAQGroup> {
  try {
    const response = await api.patch(`/cms/faq/groups/${id}`, data, {
      signal,
    });
    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error updating FAQ group ${id}:`, error);
    throw error;
  }
}

// DELETE - Delete FAQ group
export async function deleteGroup(
  id: number,
  signal?: AbortSignal
): Promise<void> {
  try {
    await api.delete(`/cms/faq/groups/${id}`, {
      signal,
    });
  } catch (error) {
    console.error(`Error deleting FAQ group ${id}:`, error);
    throw error;
  }
}

// POST - Create FAQ item with specific data structure
export async function createItem(
  data: { groupId: number; question: string; answer: string },
  signal?: AbortSignal
): Promise<FAQItem> {
  try {
    const response = await api.post("/cms/faq/items", data, {
      signal,
    });
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error creating FAQ item:", error);
    throw error;
  }
}

// DELETE - Delete FAQ item
export async function deleteItem(
  id: number,
  signal?: AbortSignal
): Promise<void> {
  try {
    await api.delete(`/cms/faq/items/${id}`, {
      signal,
    });
  } catch (error) {
    console.error(`Error deleting FAQ item ${id}:`, error);
    throw error;
  }
}
