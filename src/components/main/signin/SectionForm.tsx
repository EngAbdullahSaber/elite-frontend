"use client";

import React, { useState } from "react";
import Link from "next/link";
import TextInput from "@/components/shared/Forms/TextInput";
import OtpForm from "./OtpForm";
import PasswordForm from "./PasswordForm";
import LogoLink from "@/components/shared/LogoLink";
import { Login, SendOtp, VerifyOtp } from "@/services/Auth/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { headerConfigKeyName } from "@/libs/app.config";
import toast from "react-hot-toast";

export default function SectionForm() {
  const [activeTab, setActiveTab] = useState<"password" | "otp">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(false);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";

  const handleSendOtp = async () => {
    if (!email) {
      setError("يرجى إدخال البريد الإلكتروني أولاً");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await SendOtp({ email: email });

      if (response) {
        setOtpSent(true);
        setOtpCooldown(true);
        setTimeout(() => setOtpCooldown(false), 60000);

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
      } else {
        const errorMsg = "فشل إرسال رمز التحقق. يرجى المحاولة مرة أخرى.";
        setError(errorMsg);
        toast.error(errorMsg, {
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
      }
    } catch (error) {
      console.error("Send OTP error:", error);
      const errorMsg = "حدث خطأ في إرسال رمز التحقق. يرجى المحاولة مرة أخرى.";
      setError(errorMsg);
      toast.error(errorMsg, {
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
      setIsLoading(false);
    }
  };

  const redirectUser = (userType: string) => {
    // Show success toast before redirecting
    const userTypeMap: { [key: string]: string } = {
      admin: "مسؤول",
      agent: "وسيط",
      customer: "عميل",
    };

    const userTypeName = userTypeMap[userType] || "مستخدم";

    toast.success(`مرحباً بعودتك! تم تسجيل الدخول كـ ${userTypeName}`, {
      duration: 3000,
      position: "top-center",
      icon: "👋",
      style: {
        background: "#10B981",
        color: "#fff",
        borderRadius: "8px",
        fontSize: "14px",
      },
    });

    // Check if there's a return URL from protected pages
    if (returnUrl && returnUrl !== "/") {
      // Redirect to the original page the user came from
      router.push(returnUrl);
    } else {
      // Default redirect based on user type
      switch (userType) {
        case "admin":
          router.push("/dashboard/admin");
          break;
        case "agent":
          router.push("/dashboard/agent");
          break;
        case "customer":
          router.push("/");
          break;
        default:
          router.push("/");
          break;
      }
    }
  };

  const loginWithPassword = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!email || !password) {
      const errorMsg = "يرجى إدخال البريد الإلكتروني وكلمة المرور";
      setError(errorMsg);
      toast.error(errorMsg, {
        duration: 4000,
        position: "top-center",
        icon: "⚠️",
        style: {
          background: "#F59E0B",
          color: "#fff",
          borderRadius: "8px",
          fontSize: "14px",
        },
      });
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await Login({
        email: email,
        password: password,
      });
      console.log(response);
      if (response) {
        // Store tokens in localStorage
        localStorage.setItem(headerConfigKeyName, response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);
        localStorage.setItem("user", JSON.stringify(response));

        // Redirect based on user type and return URL
        redirectUser(response.userType);
      } else {
        const errorMsg = "فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.";
        setError(errorMsg);
        toast.error(errorMsg, {
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
      }
    } catch (error: any) {
      console.error("Login error:", error);

      let errorMsg = "حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.";

      // Handle specific error cases
      if (error.response?.status === 401) {
        errorMsg = "البريد الإلكتروني أو كلمة المرور غير صحيحة";
      } else if (error.response?.status === 400) {
        errorMsg = "بيانات الدخول غير مكتملة";
      } else if (error.response?.status === 403) {
        errorMsg = "الحساب غير مفعل أو محظور";
      } else if (error.response?.status === 404) {
        errorMsg = "الحساب غير موجود";
      } else if (error.response?.status === 429) {
        errorMsg = "محاولات تسجيل دخول كثيرة، يرجى المحاولة لاحقاً";
      }

      setError(errorMsg);
      toast.error(errorMsg, {
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
      setIsLoading(false);
    }
  };

  const loginWithOtp = async () => {
    if (!email || !otp) {
      const errorMsg = "يرجى إدخال البريد الإلكتروني ورمز التحقق";
      setError(errorMsg);
      toast.error(errorMsg, {
        duration: 4000,
        position: "top-center",
        icon: "⚠️",
        style: {
          background: "#F59E0B",
          color: "#fff",
          borderRadius: "8px",
          fontSize: "14px",
        },
      });
      return;
    }

    if (otp.length !== 6) {
      const errorMsg = "يرجى إدخال رمز التحقق المكون من 6 أرقام";
      setError(errorMsg);
      toast.error(errorMsg, {
        duration: 4000,
        position: "top-center",
        icon: "⚠️",
        style: {
          background: "#F59E0B",
          color: "#fff",
          borderRadius: "8px",
          fontSize: "14px",
        },
      });
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await VerifyOtp({
        email: email,
        otp: otp,
      });
      console.log(response);
      if (response) {
        // Store tokens in localStorage
        localStorage.setItem(headerConfigKeyName, response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);
        localStorage.setItem("user", JSON.stringify(response));

        // Redirect based on user type and return URL
        redirectUser(response.userType);
      } else {
        const errorMsg = "رمز التحقق غير صحيح. يرجى المحاولة مرة أخرى.";
        setError(errorMsg);
        toast.error(errorMsg, {
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
      }
    } catch (error: any) {
      console.error("OTP login error:", error);

      let errorMsg = "حدث خطأ في التحقق. يرجى المحاولة مرة أخرى.";

      if (error.response?.status === 400) {
        errorMsg = "رمز التحقق غير صحيح أو منتهي الصلاحية";
      } else if (error.response?.status === 404) {
        errorMsg = "لم يتم العثور على رمز تحقق لهذا البريد الإلكتروني";
      }

      setError(errorMsg);
      toast.error(errorMsg, {
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
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === "password") {
      loginWithPassword();
    } else {
      if (otpSent) {
        loginWithOtp();
      } else {
        handleSendOtp();
      }
    }
  };

  // Reset OTP state when switching tabs
  const handleTabChange = (tab: "password" | "otp") => {
    setActiveTab(tab);
    if (tab === "password") {
      // Reset OTP state when switching to password tab
      setOtpSent(false);
      setOtp("");
      setOtpCooldown(false);
    }
    setError("");

    // Show toast when switching tabs
    if (tab === "password") {
      toast.success("تم التبديل إلى تسجيل الدخول بكلمة المرور", {
        duration: 2000,
        position: "top-center",
        icon: "🔑",
        style: {
          background: "#3B82F6",
          color: "#fff",
          borderRadius: "8px",
          fontSize: "14px",
        },
      });
    } else {
      toast.success("تم التبديل إلى تسجيل الدخول برمز التحقق", {
        duration: 2000,
        position: "top-center",
        icon: "📱",
        style: {
          background: "#3B82F6",
          color: "#fff",
          borderRadius: "8px",
          fontSize: "14px",
        },
      });
    }
  };

  return (
    <div className="w-full lg:w-[50%] bg-white p-8 flex flex-col">
      <LogoLink />
      <h3 className="text-3xl font-bold mb-4 text-[var(--primary-dark)] text-center">
        مرحبًا بعودتك!
      </h3>
      <p className="text-[var(--neutral-600)] mb-8 text-center">
        {activeTab === "password"
          ? "يرجى تسجيل الدخول باستخدام بياناتك"
          : otpSent
          ? "أدخل رمز التحقق المرسل إلى بريدك الإلكتروني"
          : "أدخل بريدك الإلكتروني لإرسال رمز التحقق"}
      </p>

      {/* Show return URL info if available */}
      {returnUrl && returnUrl !== "/" && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-600 text-sm text-center">
          سيتم إعادتك إلى الصفحة السابقة بعد تسجيل الدخول
        </div>
      )}

      <AuthTabs activeTab={activeTab} setActiveTab={handleTabChange} />

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <form className="grid grid-cols-12 gap-4 flex-1" onSubmit={handleSubmit}>
        {(!otpSent || activeTab === "password") && (
          <div className="col-span-12">
            <TextInput
              id="email"
              name="email"
              label="البريد الإلكتروني"
              placeholder="أدخل بريدك الإلكتروني"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required={true}
              disabled={isLoading}
            />
          </div>
        )}

        {activeTab === "password" && (
          <PasswordForm
            password={password}
            setPassword={setPassword}
            rememberMe={rememberMe}
            setRememberMe={setRememberMe}
            isLoading={isLoading}
            onSubmit={loginWithPassword}
          />
        )}

        {activeTab === "otp" && (
          <OtpForm
            otpSent={otpSent}
            otpCooldown={otpCooldown}
            otp={otp}
            setOtp={setOtp}
            email={email}
            handleSendOtp={handleSendOtp}
            isLoading={isLoading}
            onOtpSubmit={loginWithOtp}
          />
        )}

        <div className="col-span-12 text-center text-sm text-[var(--neutral-600)] mt-4">
          ليس لديك حساب؟{" "}
          <Link
            href="/sign-up"
            className="text-primary font-semibold underline hover:text-primary-dark transition"
          >
            إنشاء حساب
          </Link>
        </div>

        {/* Forgot Password Link */}
        <div className="col-span-12 text-center">
          <Link
            href="/forgot-password"
            className="text-primary text-sm hover:text-primary-dark transition"
          >
            نسيت كلمة المرور؟
          </Link>
        </div>
      </form>
    </div>
  );
}

function AuthTabs({ activeTab, setActiveTab }: any) {
  return (
    <div className="mb-6 flex gap-4">
      <button
        type="button"
        onClick={() => setActiveTab("password")}
        className={`px-4 py-2 rounded-full font-semibold transition ${
          activeTab === "password"
            ? "bg-primary text-white"
            : "bg-[var(--bg-1)] text-[var(--neutral-700)] hover:bg-gray-200"
        }`}
      >
        تسجيل بكلمة المرور
      </button>
      <button
        type="button"
        onClick={() => setActiveTab("otp")}
        className={`px-4 py-2 rounded-full font-semibold transition ${
          activeTab === "otp"
            ? "bg-primary text-white"
            : "bg-[var(--bg-1)] text-[var(--neutral-700)] hover:bg-gray-200"
        }`}
      >
        تسجيل برمز تحقق
      </button>
    </div>
  );
}
