// utils/urlParams.ts
export interface TrackingParams {
  ref?: string;
  campaignId?: string;
  utm_source?: string;
  utm_campaign?: string;
  utm_medium?: string;
  utm_term?: string;
  utm_content?: string;
  [key: string]: string | undefined;
}

export interface TrackingResponse {
  visitorId: number;
}

export function getTrackingParams(): TrackingParams {
  if (typeof window === "undefined") return {};

  const urlParams = new URLSearchParams(window.location.search);
  const trackingParams: TrackingParams = {};

  // Common tracking parameters
  const trackingKeys = [
    "ref",
    "campaignId",
    "utm_source",
    "utm_campaign",
    "utm_medium",
    "utm_term",
    "utm_content",
  ];

  trackingKeys.forEach((key) => {
    const value = urlParams.get(key);
    if (value) {
      trackingParams[key] = value;
    }
  });

  return trackingParams;
}

export function hasTrackingParams(): boolean {
  const params = getTrackingParams();
  return Object.keys(params).length > 0;
}

export function storeVisitorId(visitorId: number): void {
  localStorage.setItem("visitor_id", visitorId.toString());
  sessionStorage.setItem("visitor_id", visitorId.toString());
}

export function getVisitorId(): number | null {
  if (typeof window === "undefined") return null;

  try {
    const stored =
      localStorage.getItem("visitor_id") ||
      sessionStorage.getItem("visitor_id");
    return stored ? parseInt(stored, 10) : null;
  } catch {
    return null;
  }
}
