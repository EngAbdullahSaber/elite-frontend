// services/highlights/highlights.ts

import { api } from "@/libs/axios";

export interface Highlight {
  id: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
}

export interface HighlightsResponse {
  total_records: number;
  current_page: number;
  per_page: number;
  records: Highlight[];
}

export async function getHighlights(
  params?: Record<string, string>,
  signal?: AbortSignal
) {
  try {
    const response = await api.get("/cms/about/highlights", {
      params,
      signal,
    });

    // Based on your API response structure
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching highlights:", error);
    throw error;
  }
}

export async function getHighlight(highlightId: number, signal?: AbortSignal) {
  try {
    const response = await api.get(`/cms/about/highlights/${highlightId}`, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching highlight:", error);
    throw error;
  }
}

export async function createHighlight(
  data: { title: string; description: string },
  signal?: AbortSignal
) {
  try {
    const response = await api.post("/cms/about/highlights", data, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error creating highlight:", error);
    throw error;
  }
}

export async function updateHighlight(
  highlightId: number,
  data: { title?: string; description?: string },
  signal?: AbortSignal
) {
  try {
    const response = await api.patch(
      `/cms/about/highlights/${highlightId}`,
      data,
      {
        signal,
      }
    );

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error updating highlight:", error);
    throw error;
  }
}

export async function deleteHighlight(
  highlightId: number,
  signal?: AbortSignal
) {
  try {
    const response = await api.delete(`/cms/about/highlights/${highlightId}`, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error deleting highlight:", error);
    throw error;
  }
}
