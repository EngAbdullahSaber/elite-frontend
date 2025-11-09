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
      // Check if we already have a visitor ID
      const existingVisitorId = getVisitorId();
      if (existingVisitorId) {
        setVisitorId(existingVisitorId);
        return;
      }

      // Check if we have tracking parameters in the URL
      if (hasTrackingParams()) {
        setIsTracking(true);
        const params = getTrackingParams();

        try {
          // Prepare tracking data
          const trackingData = {
            visitedUrl: window.location.href,
            landingPage: window.location.pathname,
            referralCode: params.ref,
            campaignId: params.campaignId
              ? parseInt(params.campaignId, 10)
              : undefined,
          };

          // Send tracking request to backend
          const response = await trackTraffic(trackingData);

          // Store visitor ID
          storeVisitorId(response.visitorId);
          setVisitorId(response.visitorId);

          console.log("Tracking successful. Visitor ID:", response.visitorId);

          // Optional: Clean URL (remove parameters) after tracking
          if (window.history.replaceState) {
            const cleanUrl = window.location.origin + window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
          }
        } catch (error) {
          console.error("Failed to track traffic:", error);
        } finally {
          setIsTracking(false);
        }
      }
    };

    handleTracking();
  }, []);

  // You can use this component to show loading state or debug info
  if (isTracking) {
    return (
      <div className="sr-only" aria-live="polite">
        Tracking your visit...
      </div>
    );
  }

  return null;
}
