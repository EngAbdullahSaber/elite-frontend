"use client";

import { useState, useEffect } from "react";
import BasicInfoForm from "@/components/main/customer/personal-info/BasicInfoForm";
import DeleteAccountSection from "@/components/main/customer/personal-info/DeleteAccountSection";
import { GetProfile } from "@/services/Auth/auth";
import { ClientRow } from "@/types/dashboard/client";
import { ImageBaseUrl } from "@/libs/app.config";

// Define the UserProfile interface based on your API response
interface UserProfile {
  id: number;
  phoneNumber: string;
  email: string;
  fullName: string;
  userType: any;
  profilePhotoUrl: string | null;
  nationalIdUrl: string | null;
  residencyIdUrl: string | null;
  verificationStatus: string;
  verifiedAt: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function PersonalInfo() {
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await GetProfile();
        console.log("Profile API Response:", response); // Debug log
        setProfile(response);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("فشل في تحميل البيانات الشخصية");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Map API response to ClientRow format
  const mapProfileToClient = (
    profileData: UserProfile
  ): Omit<ClientRow, "joinedAt"> => {
    return {
      id: profileData.id.toString(),
      name: profileData.fullName || "غير معروف",
      email: profileData.email,
      phone: profileData.phoneNumber || "غير معروف",
      image:
        (profileData.profilePhotoUrl &&
          ImageBaseUrl + profileData.profilePhotoUrl) ||
        "/users/user-default.jpg",
      status: profileData.isActive ? "active" : "inactive",
      // Add additional fields that might be needed by BasicInfoForm
      verificationStatus: profileData.verificationStatus,
      userType: profileData.userType,
      createdAt: profileData.createdAt,
      updatedAt: profileData.updatedAt,
    };
  };

  const currentClient = profile ? mapProfileToClient(profile) : null;

  // Fallback data in case API fails but we want to show the form anyway
  const fallbackClient: Omit<ClientRow, "joinedAt"> = {
    id: "0",
    name: "مستخدم",
    email: "example@email.com",
    phone: "+966 500 000 000",
    image: "/users/user-default.jpg",
    status: "active",
    verificationStatus: "pending",
    userType: "customer",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-4 lg:space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !currentClient) {
    return (
      <div className="space-y-4 lg:space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            خطأ في تحميل البيانات
          </h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <BasicInfoForm
        client={currentClient || fallbackClient}
        isCurentUser={true}
        isLoading={loading}
      />
      <DeleteAccountSection />
    </div>
  );
}
