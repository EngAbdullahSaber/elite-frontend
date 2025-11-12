"use client";

import { BsBell } from "react-icons/bs";
import Menu from "../Menu";
import UserMenu from "./UserMenu";
import NotificationsMenu from "./NotificationsMenu";
import { usePathname } from "next/navigation";
import PrimaryButton from "../Button";
import FallbackImage from "../FallbackImage";
import { useEffect, useState } from "react";
import LogoutButton from "../LogoutButton";
import { ImageBaseUrl } from "@/libs/app.config";

export default function HeaderActions() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  // Check authentication status
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const accessToken = localStorage.getItem("EilateGate");
        const userData = localStorage.getItem("user");

        setIsLoggedIn(!!accessToken);

        if (userData) {
          setUserInfo(JSON.parse(userData));
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        setIsLoggedIn(false);
        setUserInfo(null);
      }
    };

    // Check on component mount
    checkAuthStatus();

    // Listen for storage changes
    const handleStorageChange = () => {
      checkAuthStatus();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("authChange", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authChange", handleStorageChange);
    };
  }, []);

  // Handle logout
  const handleLogout = () => {
    try {
      // Remove all auth-related items from localStorage
      localStorage.removeItem("EilateGate");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      // Update state
      setIsLoggedIn(false);
      setUserInfo(null);

      // Dispatch custom event for other components to listen to
      window.dispatchEvent(new Event("authChange"));

      // Redirect to home page
      window.location.href = "/";
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Login/Logout button component
  const AuthButton = () => {
    if (isLoggedIn) {
      return (
        <div>
          <LogoutButton className="focus:outline-none focus:ring-2 focus:ring-primary/30 bg-red-600 hover:bg-red-700" />
        </div>
      );
    }

    return (
      <PrimaryButton
        href="/sign-in"
        className="focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        Login
      </PrimaryButton>
    );
  };

  return (
    <div className={`lg:order-2 flex gap-2 items-center`}>
      {/* Login/Logout Button - Only show outside dashboard */}
      {!isDashboard && <AuthButton />}

      {/* Notification Icon - Only show when user is logged in */}
      {isLoggedIn && (
        <div className="relative inline-block text-left">
          <Menu
            width={250}
            align="left"
            trigger={(toggle) => (
              <div className="relative inline-flex">
                {/* Notification Dot */}
                <span className="absolute top-[-8px] right-0 flex size-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                  <span className="absolute inline-flex size-3 rounded-full bg-sky-500"></span>
                </span>

                {/* Bell Button */}
                <button
                  type="button"
                  onClick={toggle}
                  aria-label="فتح الإشعارات"
                  className="inline-flex justify-center rounded-3xl bg-btn-bg p-3 text-sm text-gray-800 hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <BsBell className="w-5 h-5" />
                </button>
              </div>
            )}
          >
            <NotificationsMenu />
          </Menu>
        </div>
      )}

      {/* Profile - Only show when user is logged in */}
      {isLoggedIn && (
        <div className="relative inline-block">
          <Menu
            width={200}
            align="left"
            trigger={(toggle) => (
              <button
                onClick={toggle}
                className="flex justify-center items-center rounded-full focus:outline-none focus:ring-2 focus:ring-primary/30"
                aria-label="فتح قائمة المستخدم"
              >
                <FallbackImage
                  alt="profile"
                  src={
                    userInfo?.profilePhotoUrl
                      ? ImageBaseUrl + userInfo?.profilePhotoUrl
                      : "/users/default-user.png"
                  }
                  width={44}
                  height={44}
                  className="rounded-full"
                  fallback={
                    <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
                      {userInfo?.fullName?.charAt(0) ||
                        userInfo?.email?.charAt(0) ||
                        "U"}
                    </div>
                  }
                />
              </button>
            )}
          >
            <UserMenu
              user={{
                name: userInfo?.fullName || "User",
                email: userInfo?.email || "",
                location: userInfo?.location || "",
                avatarUrl: userInfo?.profilePhotoUrl
                  ? ImageBaseUrl + userInfo?.profilePhotoUrl
                  : "/users/default-user.png",
                userType: userInfo?.userType || "customer",
              }}
              onLogout={handleLogout}
            />
          </Menu>
        </div>
      )}
    </div>
  );
}
