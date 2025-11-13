"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import BecomeAgentForm from "@/components/main/becomeAgent/BecomeAgentForm";
import CenteredContainer from "@/components/shared/CenteredContainer";
import LightPageHeader from "@/components/shared/LightPageHeader";
import { headerConfigKeyName } from "@/libs/app.config";

export default function BecomeAgentPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      try {
        // Check for various authentication indicators
        const token = sessionStorage.getItem(headerConfigKeyName);

        const userData = sessionStorage.getItem("user");

        const isLoggedIn = !!(token || userData);

        if (!isLoggedIn) {
          // Redirect to login page with return URL
          const currentPath = window.location.pathname + window.location.search;
          const loginUrl = `/sign-in?returnUrl=${encodeURIComponent(
            currentPath
          )}`;
          router.replace(loginUrl);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        // If there's an error, redirect to login page
        const currentPath = window.location.pathname + window.location.search;
        const loginUrl = `/sign-in?returnUrl=${encodeURIComponent(
          currentPath
        )}`;
        router.replace(loginUrl);
      }
    };

    checkAuth();
  }, [router]);

  // Optional: Show loading state while checking authentication
  const isLoading = typeof window === "undefined"; // Or use a proper loading state

  if (isLoading) {
    return (
      <CenteredContainer>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <span className="mr-3">جاري التحقق...</span>
        </div>
      </CenteredContainer>
    );
  }

  return (
    <CenteredContainer>
      <LightPageHeader text="ابدأ رحلتك معنا كوسيط عقاري" />
      <BecomeAgentForm />
    </CenteredContainer>
  );
}
