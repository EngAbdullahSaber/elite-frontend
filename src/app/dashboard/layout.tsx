"use client";
import DashboardFooter from "@/components/dashboard/DashboardFooter";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

// Define role-based dashboard paths
const ROLE_DASHBOARDS = {
  admin: "/dashboard/admin",
  agent: "/dashboard/agent",
  marker: "/dashboard/marker",
} as const;

type UserRole = keyof typeof ROLE_DASHBOARDS;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  function toggleSidebar() {
    setSidebarOpen((p) => !p);
  }

  useEffect(() => {
    const checkUserAuthorization = () => {
      try {
        setIsLoading(true);

        // Get user data from sessionStorage
        const userData = sessionStorage.getItem("user");

        if (!userData) {
          // No user data found, redirect to login
          router.push("/sign-in");
          return;
        }

        const user = JSON.parse(userData);
        const userRole = user.userType as UserRole;

        // Check if user has a valid role
        if (!userRole || !ROLE_DASHBOARDS[userRole]) {
          console.error("Invalid user role:", userRole);
          router.push("/sign-in");
          return;
        }

        // Get the correct dashboard path for this user's role
        const userDashboard = ROLE_DASHBOARDS[userRole];

        // Check if current path matches the user's dashboard
        if (!pathname.startsWith(userDashboard)) {
          // User is trying to access wrong dashboard, redirect to their correct dashboard

          router.push(userDashboard);
          return;
        }

        // User is authorized and in the correct dashboard
        setIsAuthorized(true);
      } catch (error) {
        console.error("Error checking user authorization:", error);
        router.push("/sign-in");
      } finally {
        setIsLoading(false);
      }
    };

    checkUserAuthorization();
  }, [router, pathname]);

  // Show loading while checking authorization
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authorized (redirect will happen)
  if (!isAuthorized) {
    return null;
  }

  return (
    <section className="">
      <DashboardSidebar
        sidebarOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main
        className={`lg:mr-[312px] relative h-screen flex flex-col ${
          sidebarOpen &&
          "after:bg-black after:opacity-70 after:absolute after:inset-0 after:z-10 after:duration-300 overflow-y-hidden lg:after:content-none"
        }`}
      >
        <DashboardHeader toggleSidebar={toggleSidebar} />
        <div className="flex-1 px-3 lg:px-6 pb-4 lg:pb-6">{children}</div>
        <DashboardFooter />
      </main>
    </section>
  );
}
