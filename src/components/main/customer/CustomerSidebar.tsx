"use client";

import { useState, useEffect } from "react";
import {
  FaUserCircle,
  FaShieldAlt,
  FaBell,
  FaShoppingCart,
} from "react-icons/fa";
import Image from "next/image";
import SidebarSection from "@/components/shared/SidebarSection";
import SidebarLink from "@/components/shared/SidebarLink";
import FavoritesLink from "./FavoritesLink";
import LogoutButton from "@/components/shared/LogoutButton";
import { GetProfile } from "@/services/Auth/auth";
import FallbackImage from "@/components/shared/FallbackImage";
import { ImageBaseUrl } from "@/libs/app.config";

// Define the UserProfile interface based on your API response
interface UserProfile {
  id: number;
  phoneNumber: string;
  email: string;
  fullName: string;
  userType: string;
  profilePhotoUrl: string | null;
  nationalIdUrl: string | null;
  residencyIdUrl: string | null;
  verificationStatus: string;
  verifiedAt: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function CustomerSidebar() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await GetProfile();
         setProfile(response);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("فشل في تحميل بيانات المستخدم");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Show loading skeleton
  if (loading) {
    return (
      <div className="sticky top-24 p-4 lg:p-6 rounded-2xl bg-white shadow-lg flex flex-col">
        {/* Profile Skeleton */}
        <div className="w-32 h-32 border border-gray-200 rounded-full bg-gray-100 p-4 grid place-content-center relative mx-auto mb-8">
          <div className="w-24 h-24 bg-gray-200 rounded-full animate-pulse"></div>
        </div>

        <div className="text-center mb-8">
          <div className="h-6 bg-gray-200 rounded w-32 mx-auto mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-40 mx-auto animate-pulse"></div>
        </div>

        {/* Sections Skeleton */}
        <div className="space-y-6">
          <div>
            <div className="h-5 bg-gray-200 rounded w-20 mb-3 animate-pulse"></div>
            <div className="space-y-2">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-10 bg-gray-100 rounded animate-pulse"
                ></div>
              ))}
            </div>
          </div>

          <div>
            <div className="h-5 bg-gray-200 rounded w-16 mb-3 animate-pulse"></div>
            <div className="space-y-2">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="h-10 bg-gray-100 rounded animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Logout Button Skeleton */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="h-10 bg-gray-100 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  // Show error state (still show sidebar but with error message)
  if (error && !profile) {
    return (
      <div className="sticky top-24 p-4 lg:p-6 rounded-2xl bg-white shadow-lg flex flex-col">
        {/* Error Profile */}
        <div className="w-32 h-32 border border-red-200 rounded-full bg-red-50 p-4 grid place-content-center relative mx-auto mb-8">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-red-500 text-2xl">!</span>
          </div>
        </div>

        <div className="text-center mb-8">
          <h4 className="text-xl font-semibold text-red-600">خطأ في التحميل</h4>
          <p className="text-sm text-red-500 mt-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>

        {/* Sections (still functional) */}
        <SidebarSection title="الحساب">
          <SidebarLink href="/personal-info" icon={<FaUserCircle />}>
            المعلومات الشخصية
          </SidebarLink>
          <SidebarLink href="/user-security" icon={<FaShieldAlt />}>
            الأمان
          </SidebarLink>
          <SidebarLink href="/user-notification" icon={<FaBell />} badge="4">
            الإشعارات
          </SidebarLink>
        </SidebarSection>

        {/* <SidebarSection title="التسوق">
          <SidebarLink href="/user-booking" icon={<FaShoppingCart />}>
            حجوزاتي
          </SidebarLink>
          <FavoritesLink />
        </SidebarSection> */}

        <LogoutButton />
      </div>
    );
  }

  // Use profile data or fallback
  const userData = profile || {
    fullName: "مستخدم",
    email: "example@email.com",
    profilePhotoUrl: null,
  };

  return (
    <div className="sticky top-24 p-4 lg:p-6 rounded-2xl bg-white shadow-lg flex flex-col">
      {/* Profile */}
      <div className="w-32 h-32 border border-primary rounded-full bg-white p-4 grid place-content-center relative mx-auto mb-8">
        <FallbackImage
          src={
            userData.profilePhotoUrl
              ? ImageBaseUrl + userData.profilePhotoUrl
              : "/users/user-default.jpg"
          }
          alt={userData.fullName}
          width={96}
          height={96}
          className="rounded-full object-cover"
          fallbackSrc="/users/user-default.jpg"
        />
      </div>

      <div className="text-center mb-8">
        <h4 className="text-2xl font-semibold text-gray-800">
          {userData.fullName}
        </h4>
        <p className="text-sm text-gray-500 mt-1">{userData.email}</p>
        {userData.verificationStatus && (
          <div className="mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 border border-green-200">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
            {userData.verificationStatus === "verified" ? "موثق" : "غير موثق"}
          </div>
        )}
      </div>

      {/* Sections */}
      <SidebarSection title="الحساب">
        <SidebarLink href="/personal-info" icon={<FaUserCircle />}>
          المعلومات الشخصية
        </SidebarLink>
        <SidebarLink href="/user-security" icon={<FaShieldAlt />}>
          الأمان
        </SidebarLink>
        <SidebarLink href="/user-notification" icon={<FaBell />}>
          الإشعارات
        </SidebarLink>
      </SidebarSection>

      <SidebarSection title="التسوق">
        {/* <SidebarLink href="/user-booking" icon={<FaShoppingCart />}>
          حجوزاتي
        </SidebarLink> */}
        <FavoritesLink />
      </SidebarSection>

      {/* Logout Button */}
      <LogoutButton />
    </div>
  );
}
