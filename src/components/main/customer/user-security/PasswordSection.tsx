"use client";

import React, { useState, useEffect } from "react";
import Card from "@/components/shared/Card";
import TextInput from "@/components/shared/Forms/TextInput";
import PrimaryButton from "@/components/shared/Button";
import SoftActionButton from "@/components/shared/SoftActionButton";
import { ChangePassword, GetProfile } from "@/services/Auth/auth";

// Define the types for the change password data
interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

interface UserProfile {
  id: number;
  email: string;
  fullName: string;
  phoneNumber: string;
  profilePhotoUrl: string | null;
  nationalIdUrl: string | null;
  residencyIdUrl: string | null;
  verificationStatus: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function PasswordSection() {
  const [form, setForm] = useState({
    current: "",
    new: "",
  });

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const [errors, setErrors] = useState({
    current: "",
    new: "",
    general: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setProfileLoading(true);
        const response = await GetProfile();
        setUserProfile(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setErrors((prev) => ({
          ...prev,
          general: "فشل في تحميل بيانات المستخدم",
        }));
      } finally {
        setProfileLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const validateForm = () => {
    const newErrors = {
      current: "",
      new: "",
      general: "",
    };

    let isValid = true;

    // Validate current password
    if (!form.current.trim()) {
      newErrors.current = "كلمة المرور الحالية مطلوبة";
      isValid = false;
    }

    // Validate new password
    if (!form.new.trim()) {
      newErrors.new = "كلمة المرور الجديدة مطلوبة";
      isValid = false;
    } else if (form.new.length < 8) {
      newErrors.new = "كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل";
      isValid = false;
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(form.new)
    ) {
      newErrors.new = "كلمة المرور لا تستوفي المتطلبات";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange =
    (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

      // Clear errors when user starts typing
      if (errors[key]) {
        setErrors((prev) => ({ ...prev, [key]: "" }));
      }
      if (errors.general) {
        setErrors((prev) => ({ ...prev, general: "" }));
      }

      // Clear success message when user makes changes
      if (success) {
        setSuccess(false);
      }
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors((prev) => ({ ...prev, general: "" }));

    try {
      const passwordData: ChangePasswordData = {
        currentPassword: form.current,
        newPassword: form.new,
      };

      await ChangePassword(passwordData);

      // Success
      setSuccess(true);
      setForm({ current: "", new: "" });

     } catch (error: any) {
      console.error("Error changing password:", error);

      // Handle specific error cases
      if (error.response?.status === 400) {
        setErrors((prev) => ({
          ...prev,
          current: "كلمة المرور الحالية غير صحيحة",
        }));
      } else if (error.response?.status === 401) {
        setErrors((prev) => ({
          ...prev,
          general: "غير مصرح لك بتنفيذ هذه العملية",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          general:
            error.response?.data?.message || "حدث خطأ أثناء تحديث كلمة المرور",
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({ current: "", new: "" });
    setErrors({ current: "", new: "", general: "" });
    setSuccess(false);
  };

  // Show loading state while fetching profile
  if (profileLoading) {
    return (
      <Card title="كلمة المرور" hasMinHeight={true}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded w-1/2"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card title="كلمة المرور" hasMinHeight={true}>
      {/* User Info Section */}
      {userProfile && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            معلومات المستخدم
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-medium text-gray-700">الاسم:</span>
              <span className="text-gray-900 mr-2">
                {" "}
                {userProfile.fullName}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">
                البريد الإلكتروني:
              </span>
              <span className="text-gray-900 mr-2"> {userProfile.email}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">رقم الهاتف:</span>
              <span className="text-gray-900 mr-2">
                {" "}
                {userProfile.phoneNumber}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">حالة الحساب:</span>
              <span
                className={`mr-2 ${
                  userProfile.isActive ? "text-green-600" : "text-red-600"
                }`}
              >
                {userProfile.isActive ? "نشط" : "غير نشط"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* النموذج */}
      <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
        {/* Current Password */}
        <div className="col-span-12">
          <TextInput
            id="current-password"
            name="current"
            type="password"
            label="كلمة المرور الحالية"
            placeholder="أدخل كلمة المرور الحالية"
            value={form.current}
            onChange={handleChange("current")}
            error={errors.current}
            required
            disabled={loading}
          />
        </div>

        {/* New Password */}
        <div className="col-span-12">
          <TextInput
            id="new-password"
            name="new"
            type="password"
            label="كلمة المرور الجديدة"
            placeholder="أدخل كلمة المرور الجديدة"
            value={form.new}
            onChange={handleChange("new")}
            error={errors.new}
            required
            disabled={loading}
          />
        </div>

        {/* Password Requirements Info */}
        <div className="col-span-12">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h5 className="font-medium mb-3 text-gray-700">
              متطلبات كلمة المرور:
            </h5>
            <ul className="list-disc mr-5 text-gray-600 space-y-2 text-sm">
              <li>يجب أن تحتوي على 8 أحرف على الأقل</li>
              <li>حرف صغير واحد على الأقل (a-z)</li>
              <li>حرف كبير واحد على الأقل (A-Z)</li>
              <li>رقم واحد على الأقل (0-9)</li>
              <li>رمز خاص واحد على الأقل (!@#$%^&*)</li>
            </ul>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="col-span-12">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 text-sm flex items-center gap-2">
                <span>✅</span>
                تم تحديث كلمة المرور بنجاح
              </p>
            </div>
          </div>
        )}

        {/* General Error Message */}
        {errors.general && (
          <div className="col-span-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm flex items-center gap-2">
                <span>❌</span>
                {errors.general}
              </p>
            </div>
          </div>
        )}

        {/* أزرار الإجراء */}
        <div className="col-span-12 flex items-center gap-4 flex-wrap">
          <PrimaryButton type="submit" loading={loading} disabled={loading}>
            {loading ? "جاري التحديث..." : "تحديث كلمة المرور"}
          </PrimaryButton>

          <SoftActionButton onClick={handleCancel} disabled={loading}>
            إلغاء
          </SoftActionButton>
        </div>
      </form>
    </Card>
  );
}
