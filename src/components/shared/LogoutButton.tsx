"use client";

import React, { useState } from "react";
import { Logout } from "@/services/Auth/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { headerConfigKeyName } from "@/libs/app.config";

export default function LogoutButton({
  className = "",
}: {
  className?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      setLoading(true);

      // Call the logout API
      await Logout();

      // Clear local storage
      localStorage.removeItem(headerConfigKeyName);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      sessionStorage.clear();

      // Show success toast
      toast.success("تم تسجيل الخروج بنجاح", {
        duration: 4000,
        position: "top-center",
        icon: "✅",
        style: {
          background: "#10B981",
          color: "#fff",
          borderRadius: "8px",
          fontSize: "14px",
        },
      });

      // Redirect to login page after a short delay to show the toast
      setTimeout(() => {
        router.push("/sign-in");
        router.refresh();
      }, 1000);
    } catch (error: any) {
      console.error("Logout failed:", error);

      // Show error toast
      toast.error(
        error.response?.data?.message || "حدث خطأ أثناء تسجيل الخروج",
        {
          duration: 4000,
          position: "top-center",
          icon: "❌",
          style: {
            background: "#EF4444",
            color: "#fff",
            borderRadius: "8px",
            fontSize: "14px",
          },
        }
      );

      // Even if API call fails, clear local storage and redirect
      localStorage.removeItem("access_token");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      sessionStorage.clear();

      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1000);
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  const openConfirmDialog = () => {
    setShowConfirm(true);
  };

  const closeConfirmDialog = () => {
    setShowConfirm(false);
  };

  // Handle button click - show dialog if no className, direct logout if className exists
  const handleButtonClick = () => {
    if (className) {
      // If className has value, perform direct logout
      handleLogout();
    } else {
      // If no className, show confirmation dialog
      openConfirmDialog();
    }
  };

  return (
    <>
      <div className={`${className ? "" : "mt-[60px]"} flex justify-center`}>
        <button
          type="button"
          onClick={handleButtonClick}
          disabled={loading}
          className={`px-6 py-2 text-white rounded-lg bg-[#243756] hover:bg-red-600 transition disabled:opacity-50 ${className}`}
        >
          {loading ? "جاري الخروج..." : "تسجيل خروج"}
        </button>
      </div>

      {/* Confirmation Dialog - Only show when no className provided */}
      {showConfirm && !className && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full mx-auto"
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-yellow-600"
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

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                تأكيد تسجيل الخروج
              </h3>

              <p className="text-gray-600 mb-6">
                هل أنت متأكد أنك تريد تسجيل الخروج؟
              </p>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={closeConfirmDialog}
                  disabled={loading}
                  className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
                >
                  إلغاء
                </button>

                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className="px-6 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                >
                  {loading ? "جاري الخروج..." : "نعم، سجل خروج"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
