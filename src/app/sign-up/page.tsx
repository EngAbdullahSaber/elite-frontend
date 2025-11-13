"use client";

import PrimaryButton from "@/components/shared/Button";
import LogoLink from "@/components/shared/LogoLink";
import TextInput from "@/components/shared/Forms/TextInput";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Register, VerifyOtp } from "@/services/Auth/auth";
import toast from "react-hot-toast";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { CreateCoversions } from "@/services/trackingService/trackingService";

type FormData = {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
};

type OtpData = {
  email: string;
  otp: string;
};

export default function SignUpPage() {
  const [step, setStep] = useState<"register" | "verify">("register");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.fullName.trim()) {
      setError("الاسم الكامل مطلوب");
      return false;
    }

    if (!formData.email.trim()) {
      setError("البريد الإلكتروني مطلوب");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("البريد الإلكتروني غير صالح");
      return false;
    }

    if (!formData.phoneNumber.trim()) {
      setError("رقم الهاتف مطلوب");
      return false;
    }

    if (!formData.password) {
      setError("كلمة المرور مطلوبة");
      return false;
    }

    if (formData.password.length < 6) {
      setError("كلمة المرور يجب أن تكون على الأقل 6 أحرف");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("كلمات المرور غير متطابقة");
      return false;
    }

    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const registerData = {
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        userType: "customer",
        phoneNumber: formData.phoneNumber,
      };

      const response = await Register(registerData);

      setRegisteredEmail(formData.email);
      setStep("verify");

      toast.success("تم إرسال رمز التحقق إلى بريدك الإلكتروني", {
        duration: 5000,
        position: "top-center",
        icon: "✅",
        style: {
          background: "#10B981",
          color: "#fff",
          borderRadius: "8px",
          fontSize: "14px",
        },
      });
    } catch (err: any) {
      console.error("Registration error:", err);

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0] ||
        "حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.";

      setError(errorMessage);

      toast.error(errorMessage, {
        duration: 5000,
        position: "top-center",
        icon: "❌",
        style: {
          background: "#EF4444",
          color: "#fff",
          borderRadius: "8px",
          fontSize: "14px",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp.trim()) {
      setError("يرجى إدخال رمز التحقق");
      return;
    }

    if (otp.length !== 6) {
      setError("رمز التحقق يجب أن يكون 6 أرقام");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const otpData = {
        email: registeredEmail,
        otp: otp,
      };

      const response = await VerifyOtp(otpData);

      toast.success("تم تفعيل الحساب بنجاح!", {
        duration: 5000,
        position: "top-center",
        icon: "✅",
        style: {
          background: "#10B981",
          color: "#fff",
          borderRadius: "8px",
          fontSize: "14px",
        },
      });
      await CreateCoversions({
        type: "registration",
        visitorId: sessionStorage.getItem("visitor_Id"),
      });
      setTimeout(() => {
        window.location.href = "/sign-in";
      }, 2000);
    } catch (err: any) {
      console.error("OTP verification error:", err);

      const errorMessage =
        err.response?.data?.message ||
        "رمز التحقق غير صحيح. يرجى المحاولة مرة أخرى.";

      setError(errorMessage);

      toast.error(errorMessage, {
        duration: 5000,
        position: "top-center",
        icon: "❌",
        style: {
          background: "#EF4444",
          color: "#fff",
          borderRadius: "8px",
          fontSize: "14px",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError(null);

    try {
      const registerData = {
        email: registeredEmail,
        password: formData.password,
        fullName: formData.fullName,
        userType: "customer",
        phoneNumber: formData.phoneNumber,
      };

      await Register(registerData);

      toast.success("تم إعادة إرسال رمز التحقق", {
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
    } catch (err: any) {
      console.error("Resend OTP error:", err);

      const errorMessage =
        err.response?.data?.message ||
        "حدث خطأ أثناء إعادة إرسال الرمز. يرجى المحاولة مرة أخرى.";

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToRegister = () => {
    setStep("register");
    setError(null);
    setOtp("");
  };

  return (
    <section className="py-20 bg-[var(--bg-1)]">
      <div className="container max-w-[1200px] mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-stretch justify-between rounded-tr-2xl rounded-br-2xl custom-shadow">
          {/* Form Section */}
          <div className="w-full lg:w-[50%] bg-white rounded-tr-2xl rounded-br-2xl p-8">
            <LogoLink />

            {step === "register" ? (
              <>
                <h3 className="text-3xl font-bold mb-4 text-[var(--primary-dark)] text-center">
                  لنبدأ الآن!
                </h3>
                <p className="text-[var(--neutral-600)] mb-8 text-center">
                  يرجى إدخال بياناتك للانضمام إلينا
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

                <form onSubmit={handleRegister}>
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12">
                      <TextInput
                        id="fullName"
                        name="fullName"
                        label="الاسم الكامل"
                        placeholder="أدخل الاسم الكامل"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="col-span-12">
                      <TextInput
                        id="email"
                        name="email"
                        label="البريد الإلكتروني"
                        placeholder="أدخل بريدك الإلكتروني"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="col-span-12">
                      <TextInput
                        id="phoneNumber"
                        name="phoneNumber"
                        label="رقم الهاتف"
                        placeholder="أدخل رقم الهاتف"
                        type="text"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="col-span-12">
                      <TextInput
                        id="password"
                        name="password"
                        label="كلمة المرور"
                        placeholder="أدخل كلمة المرور"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        minLength={6}
                      />
                    </div>

                    <div className="col-span-12">
                      <TextInput
                        id="confirmPassword"
                        name="confirmPassword"
                        label="تأكيد كلمة المرور"
                        placeholder="أعد إدخال كلمة المرور"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        minLength={6}
                      />
                    </div>

                    <div className="col-span-12">
                      <PrimaryButton
                        type="submit"
                        className="w-full py-3 px-6 rounded-full bg-primary text-white hover:bg-primary/90 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                        loading={loading}
                        disabled={loading}
                      >
                        {loading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
                      </PrimaryButton>

                      <div className="text-center text-sm text-[var(--neutral-600)] mt-4">
                        لديك حساب بالفعل؟{" "}
                        <Link
                          href="/sign-in"
                          className="text-primary font-semibold underline"
                        >
                          تسجيل الدخول
                        </Link>
                      </div>
                    </div>
                  </div>
                </form>
              </>
            ) : (
              // OTP Verification Step
              <>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <FaCheckCircle className="text-blue-500 text-xl" />
                    <div>
                      <p className="font-medium text-blue-800">
                        تم إرسال رمز التحقق
                      </p>
                      <p className="text-sm text-blue-600 mt-1">
                        تم إرسال رمز التحقق إلى:{" "}
                        <span className="font-semibold">{registeredEmail}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <h3 className="text-3xl font-bold mb-4 text-[var(--primary-dark)] text-center">
                  تأكيد الحساب
                </h3>
                <p className="text-[var(--neutral-600)] mb-8 text-center">
                  أدخل رمز التحقق المكون من 6 أرقام
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

                <form onSubmit={handleVerifyOtp}>
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12">
                      <TextInput
                        id="otp"
                        name="otp"
                        label="رمز التحقق"
                        placeholder="أدخل الرمز المكون من 6 أرقام"
                        type="text"
                        value={otp}
                        onChange={(e) => {
                          // Allow only numbers and limit to 6 digits
                          const value = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 6);
                          setOtp(value);
                          if (error) setError(null);
                        }}
                        required
                        maxLength={6}
                      />
                    </div>

                    <div className="col-span-12">
                      <PrimaryButton
                        type="submit"
                        className="w-full py-3 px-6 rounded-full bg-primary text-white hover:bg-primary/90 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                        loading={loading}
                        disabled={loading || otp.length !== 6}
                      >
                        {loading ? "جاري التحقق..." : "تفعيل الحساب"}
                      </PrimaryButton>
                    </div>
                  </div>
                </form>

                <div className="mt-6 flex justify-between items-center">
                  <button
                    onClick={handleBackToRegister}
                    className="text-primary hover:text-primary/80 font-medium text-sm"
                  >
                    ← العودة لتعديل البيانات
                  </button>

                  <button
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="text-gray-600 hover:text-gray-800 font-medium text-sm disabled:opacity-50"
                  >
                    إعادة إرسال الرمز
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Image Section */}
          <div className="w-full lg:w-[50%] bg-primary-light flex items-center justify-center rounded-tl-2xl rounded-bl-2xl">
            <Image
              src="/main/admin-signin.png"
              alt="تسجيل الدخول"
              width={667}
              height={639}
              className="max-w-full lg:max-w-[500px] xl:max-w-[550px] rounded-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
