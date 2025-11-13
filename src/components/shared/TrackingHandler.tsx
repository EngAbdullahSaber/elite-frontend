// components/shared/TrackingHandler.tsx
"use client";

import { useEffect, useState } from "react";
import {
  getTrackingParams,
  hasTrackingParams,
  storeVisitorId,
  getVisitorId,
} from "@/libs/urlParams";
import { trackTraffic } from "@/services/trackingService/trackingService";

export default function TrackingHandler() {
  const [isTracking, setIsTracking] = useState(false);
  const [visitorId, setVisitorId] = useState<number | null>(null);

  useEffect(() => {
    const handleTracking = async () => {
      // Check if we already have a visitor ID in this session
      const existingVisitorId = getVisitorId();
      if (existingVisitorId) {
        setVisitorId(existingVisitorId);
        console.log("Using existing visitor ID:", existingVisitorId);
        return;
      }

      // Check if we have tracking parameters in the URL
      const hasParams = hasTrackingParams();
      console.log("Has tracking params:", hasParams);

      if (hasParams) {
        setIsTracking(true);
        const params = getTrackingParams();
        console.log("Tracking params found:", params);

        try {
          // Prepare tracking data with all available parameters
          const trackingData = {
            visitedUrl: window.location.href,
            landingPage: window.location.pathname,
            referralCode: params.ref || params.utm_source, // Support both ref and utm_source
            campaignId: params.campaignId
              ? parseInt(params.campaignId, 10)
              : undefined,
            utmSource: params.utm_source,
            utmMedium: params.utm_medium,
            utmCampaign: params.utm_campaign,
            utmTerm: params.utm_term,
            utmContent: params.utm_content,
            // Add any other UTM parameters you want to track
          };

          // Send tracking request to backend
          const response = await trackTraffic(trackingData);

          // Store visitor ID for this session
          if (response.visitorId) {
            storeVisitorId(response.visitorId);
            setVisitorId(response.visitorId);
          }

          // Optional: Clean URL (remove tracking parameters) after successful tracking
          if (window.history.replaceState) {
            const url = new URL(window.location.href);

            // Remove tracking parameters
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
              url.searchParams.delete(param);
            });

            // Replace URL without tracking parameters
            window.history.replaceState({}, document.title, url.toString());
            console.log("URL cleaned, removed tracking parameters");
          }
        } catch (error) {
          console.error("Failed to track traffic:", error);
          // You might want to retry or show an error message to the user
        } finally {
          setIsTracking(false);
        }
      } else {
        console.log("No tracking parameters found in URL");
      }
    };

    // Add a small delay to ensure the page is fully loaded
    const timer = setTimeout(() => {
      handleTracking();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Debug information (remove in production)
  // if (process.env.NODE_ENV === "development") {
  //   return (
  //     <div className="fixed bottom-4 left-4 bg-black text-white p-3 rounded-lg text-xs z-50 max-w-xs">
  //       <div className="font-bold mb-1">Tracking Debug:</div>
  //       <div>Tracking: {isTracking ? "Yes" : "No"}</div>
  //       <div>Visitor ID: {visitorId || "Not set"}</div>
  //       <div>
  //         Current URL:{" "}
  //         {typeof window !== "undefined" ? window.location.href : ""}
  //       </div>
  //       <div>Has Params: {hasTrackingParams() ? "Yes" : "No"}</div>
  //     </div>
  //   );
  // }

  // You can use this component to show loading state or debug info
  if (isTracking) {
    return (
      <div className="sr-only" aria-live="polite">
        جاري تتبع زيارتك...
      </div>
    );
  }

  return null;
}
