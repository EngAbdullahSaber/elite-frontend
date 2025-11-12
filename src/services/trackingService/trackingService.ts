// services/trackingService.ts

import { api } from "@/libs/axios";
import { TrackingResponse } from "@/libs/urlParams";

export async function trackTraffic(data: {
  visitedUrl: string;
  landingPage: string;
  referralCode?: string;
  campaignId?: number;
}): Promise<TrackingResponse> {
  try {
    const response = await api.post("/traffic/track", data);

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error creating partner:", error);
    throw error;
  }
}
export async function CreateCoversions(data: {
  userId: string;
  type?: string;
  visitorId?: number;
}): Promise<TrackingResponse> {
  try {
    const response = await api.post("/traffic/conversions", data);

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error creating partner:", error);
    throw error;
  }
}
