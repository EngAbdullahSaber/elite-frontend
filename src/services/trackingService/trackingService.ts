// services/trackingService.ts

import { TrackingResponse } from "@/libs/urlParams";

export async function trackTraffic(data: {
  visitedUrl: string;
  landingPage: string;
  referralCode?: string;
  campaignId?: number;
}): Promise<TrackingResponse> {
  try {
    const response = await fetch("/api/traffic/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: TrackingResponse = await response.json();
    return result;
  } catch (error) {
    console.error("Error tracking traffic:", error);
    throw error;
  }
}
