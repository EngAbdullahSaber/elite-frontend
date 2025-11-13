// libs/urlParams.ts
export function hasTrackingParams(): boolean {
  if (typeof window === "undefined") return false;

  const urlParams = new URLSearchParams(window.location.search);

  // Check for any tracking parameters
  const trackingParams = [
    "ref",
    "campaignId",
    "visitorId",
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
  ];

  return trackingParams.some((param) => urlParams.has(param));
}

export function getTrackingParams(): Record<string, string> {
  if (typeof window === "undefined") return {};

  const urlParams = new URLSearchParams(window.location.search);
  const params: Record<string, string> = {};

  // Get all tracking parameters
  const trackingParams = [
    "ref",
    "campaignId",
    "visitorId",
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
  ];

  trackingParams.forEach((param) => {
    const value = urlParams.get(param);
    if (value) {
      params[param] = value;
    }
  });

  return params;
}

export function storeVisitorId(visitorId: number): void {
  if (typeof window === "undefined") return;

  try {
    // Store in sessionStorage for this browser session
    sessionStorage.setItem("visitor_id", visitorId.toString());

    // Set a cookie as fallback
  } catch (error) {
    console.error("Failed to store visitor ID:", error);
  }
}

export function getVisitorId(): number | null {
  if (typeof window === "undefined") return null;

  try {
    // Try sessionStorage first
    const sessionId = sessionStorage.getItem("visitor_Id");
    if (sessionId) return parseInt(sessionId, 10);

    return null;
  } catch (error) {
    console.error("Failed to get visitor ID:", error);
    return null;
  }
}

// Helper function to generate tracking URL
export function generateTrackingUrl(
  baseUrl: string,
  params: {
    ref?: string;
    campaignId?: number;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
  }
): string {
  const url = new URL(baseUrl);

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value.toString());
    }
  });

  return url.toString();
}
