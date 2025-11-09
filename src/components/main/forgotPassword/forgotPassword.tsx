"use client";

import React, { useState } from "react";
import TextInput from "@/components/shared/Forms/TextInput";
import PrimaryButton from "@/components/shared/Button";
import { FaCheckCircle, FaExclamationTriangle, FaLock } from "react-icons/fa";
import { ForgotPassword, ResetPassword } from "@/services/Auth/auth"; // Adjust import path as needed

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState<"email" | "reset">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("يرجى إدخال البريد الإلكتروني");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("يرجى إدخال بريد إلكتروني صحيح");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await ForgotPassword({ email });
      setStep("reset");
    } catch (err: any) {
      console.error("Forgot password error:", err);

      // Handle different error scenarios
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors?.email) {
        setError(err.response.data.errors.email[0]);
      } else if (err.message?.includes("Network Error")) {
        setError("خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى.");
      } else {
        setError("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError("يرجى إدخال رمز التحقق");
      return;
    }

    if (!newPassword) {
      setError("يرجى إدخال كلمة المرور الجديدة");
      return;
    }

    if (newPassword.length < 6) {
      setError("كلمة المرور يجب أن تكون على الأقل 6 أحرف");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("كلمات المرور غير متطابقة");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await ResetPassword({ token, newPassword });
      setSuccess(true);
    } catch (err: any) {
      console.error("Reset password error:", err);

      // Handle different error scenarios
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        // Handle validation errors
        const errors = err.response.data.errors;
        if (errors.token) {
          setError(errors.token[0]);
        } else if (errors.newPassword) {
          setError(errors.newPassword[0]);
        } else {
          setError("بيانات غير صحيحة");
        }
      } else if (err.message?.includes("Network Error")) {
        setError("خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى.");
      } else {
        setError("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep("email");
    setError(null);
    setToken("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleResetForm = () => {
    setStep("email");
    setEmail("");
    setToken("");
    setNewPassword("");
    setConfirmPassword("");
    setError(null);
    setSuccess(false);
  };

  if (success) {
    return (
      <div className="bg-green-50 text-green-800 p-6 rounded-xl text-center border border-green-200 shadow-sm">
        <div className="flex flex-col items-center justify-center gap-4">
          <FaCheckCircle className="text-green-500 text-5xl" />
          <h4 className="text-2xl font-bold">تم تغيير كلمة المرور بنجاح</h4>
          <p className="text-lg max-w-xl leading-relaxed">
            تم تغيير كلمة المرور الخاصة بحسابك بنجاح. يمكنك الآن تسجيل الدخول
            باستخدام كلمة المرور الجديدة.
          </p>

          <div className="mt-6">
            <button
              onClick={() => (window.location.href = "/sign-in")}
              className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition font-medium"
            >
              تسجيل الدخول
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {step === "email" ? (
        <>
          <p className="text-[var(--neutral-600)] mb-8 text-center">
            أدخل بريدك الإلكتروني لإرسال رمز التحقق لإعادة تعيين كلمة المرور
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-start gap-3">
              <FaExclamationTriangle className="text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">خطأ</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          <form
            onSubmit={handleEmailSubmit}
            className="grid grid-cols-12 gap-4"
          >
            <div className="col-span-12">
              <TextInput
                id="email"
                name="email"
                label="البريد الإلكتروني"
                placeholder="أدخل بريدك الإلكتروني"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  // Clear error when user starts typing
                  if (error) setError(null);
                }}
                error={error ? true : false}
                disabled={loading}
                required
              />
            </div>

            <div className="col-span-12">
              <PrimaryButton
                type="submit"
                className="w-full py-3 px-6 rounded-full bg-primary text-white hover:bg-primary/90 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                loading={loading}
                disabled={loading || !email}
              >
                {loading ? "جاري الإرسال..." : "إرسال رمز التحقق"}
              </PrimaryButton>
            </div>
          </form>

          {/* Additional help text */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 text-sm">
            <p className="font-medium">ملاحظة:</p>
            <p className="mt-1">
              سوف نرسل رمز تحقق مكون من 6 أرقام إلى بريدك الإلكتروني. يرجى
              التحقق من صندوق الوارد والبريد العشوائي.
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <FaCheckCircle className="text-blue-500 text-xl" />
              <div>
                <p className="font-medium text-blue-800">تم إرسال رمز التحقق</p>
                <p className="text-sm text-blue-600 mt-1">
                  تم إرسال رمز التحقق إلى:{" "}
                  <span className="font-semibold">{email}</span>
                </p>
              </div>
            </div>
          </div>

          <p className="text-[var(--neutral-600)] mb-6 text-center">
            أدخل رمز التحقق وكلمة المرور الجديدة
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-start gap-3">
              <FaExclamationTriangle className="text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">خطأ</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          <form
            onSubmit={handleResetSubmit}
            className="grid grid-cols-12 gap-4"
          >
            <div className="col-span-12">
              <TextInput
                id="token"
                name="token"
                label="رمز التحقق"
                placeholder="أدخل الرمز المكون من 6 أرقام"
                type="text"
                value={token}
                onChange={(e) => {
                  // Allow only numbers and limit to 6 digits
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setToken(value);
                  if (error) setError(null);
                }}
                error={error ? true : false}
                disabled={loading}
                required
                maxLength={6}
              />
            </div>

            <div className="col-span-12">
              <TextInput
                id="newPassword"
                name="newPassword"
                label="كلمة المرور الجديدة"
                placeholder="أدخل كلمة المرور الجديدة"
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (error) setError(null);
                }}
                error={error ? true : false}
                disabled={loading}
                required
                minLength={6}
              />
            </div>

            <div className="col-span-12">
              <TextInput
                id="confirmPassword"
                name="confirmPassword"
                label="تأكيد كلمة المرور"
                placeholder="أعد إدخال كلمة المرور الجديدة"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (error) setError(null);
                }}
                error={error ? true : false}
                disabled={loading}
                required
                minLength={6}
              />
            </div>

            <div className="col-span-12">
              <PrimaryButton
                type="submit"
                className="w-full py-3 px-6 rounded-full bg-primary text-white hover:bg-primary/90 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                loading={loading}
                disabled={loading || !token || !newPassword || !confirmPassword}
              >
                {loading ? "جاري التغيير..." : "تغيير كلمة المرور"}
              </PrimaryButton>
            </div>
          </form>

          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={handleBackToEmail}
              className="text-primary hover:text-primary/80 font-medium text-sm"
            >
              ← العودة لتغيير البريد الإلكتروني
            </button>

            <button
              onClick={handleResetForm}
              className="text-gray-600 hover:text-gray-800 font-medium text-sm"
            >
              إعادة إرسال الرمز
            </button>
          </div>

          {/* Password requirements */}
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 text-sm">
            <p className="font-medium mb-2">متطلبات كلمة المرور:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>يجب أن تكون على الأقل 6 أحرف</li>
              <li>يجب أن تتطابق كلمتا المرور</li>
            </ul>
          </div>
        </>
      )}
    </>
  );
}
