"use client";
import PrimaryButton from "@/components/shared/Button";
import TextareaInput from "@/components/shared/Forms/TextareaInput";
import TextInput from "@/components/shared/Forms/TextInput";
import { createContactMessage } from "@/services/contactUs/contactUs";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function ContactForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      toast.error("يرجى ملء جميع الحقول المطلوبة!", {
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
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("يرجى إدخال بريد إلكتروني صحيح!", {
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
      return;
    }

    setIsLoading(true);

    try {
      // Prepare data for API
      const contactData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
      };

      // Call the API
      await createContactMessage(contactData);

      // Show success toast
      toast.success("تم إرسال رسالتك بنجاح!", {
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

      // Reset form
      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending contact message:", error);

      toast.error("حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى!", {
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

  return (
    <div className="bg-white rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8">
      <form onSubmit={handleSubmit}>
        <h3 className="mb-0 h3">تواصل معنا الآن</h3>
        <div className="border border-dashed my-6"></div>
        <div className="grid grid-cols-12 gap-4">
          <TextInput
            id="first-name"
            label="الاسم"
            placeholder="أدخل الاسم"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            disabled={isLoading}
          />
          <TextInput
            id="enter-email"
            label="البريد الإلكتروني"
            placeholder="أدخل البريد الإلكتروني"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            disabled={isLoading}
          />
          <TextareaInput
            id="review-review"
            label="الرسالة"
            name="message"
            placeholder="اكتب رسالتك"
            value={formData.message}
            onChange={handleInputChange}
            required
            disabled={isLoading}
          />
          <div className="col-span-12">
            <PrimaryButton
              type="submit"
              className={`inline-flex items-center gap-2 py-3 px-6 rounded-full bg-primary text-white hover:text-white font-semibold ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              <span className="inline-block">
                {isLoading ? "جاري الإرسال..." : "إرسال الرسالة"}
              </span>
              {isLoading && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
            </PrimaryButton>
          </div>
        </div>
      </form>
    </div>
  );
}
