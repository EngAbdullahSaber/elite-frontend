"use client";

import React, { useState } from "react";
import TextInput from "@/components/shared/Forms/TextInput";
import TextareaInput from "@/components/shared/Forms/TextareaInput";
import SelectInput from "@/components/shared/Forms/SelectInput";
import PrimaryButton from "@/components/shared/Button";
import { createAppointment } from "@/services/appointments/appointments";
import toast from "react-hot-toast";

// Define types based on your API
interface CreateAppointmentData {
  propertyId: string;
  fullName: string;
  email: string;
  phone: string;
  message?: string;
  timeSlot: string;
}

interface Appointment {
  id: number;
  // Add other appointment fields as needed
}

const availableTimes = [
  { value: "", label: "اختر موعد الزيارة" },
  { value: "07:00-09:00", label: "٠٧:٠٠ م - ٠٩:٠٠ م" },
  { value: "09:00-11:00", label: "٠٩:٠٠ م - ١١:٠٠ م" },
  { value: "06:30-08:30", label: "٠٦:٣٠ م - ٠٨:٣٠ م" },
];

export default function ProjectBookingForm({ id }: { id: string }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
    timeSlot: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "الاسم الكامل مطلوب";
    }

    if (!formData.email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "البريد الإلكتروني غير صالح";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "رقم الهاتف مطلوب";
    } else if (!/^(05|5)([0-9]{8})$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "رقم الهاتف يجب أن يبدأ بـ 05 ويتكون من 10 أرقام";
    }

    if (!formData.timeSlot) {
      newErrors.timeSlot = "موعد الزيارة مطلوب";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("يرجى تصحيح الأخطاء في النموذج", {
        duration: 4000,
        position: "top-center",
        icon: "❌",
      });
      return;
    }

    setLoading(true);
    try {
      const appointmentData: CreateAppointmentData = {
        propertyId: id,
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim() || undefined,
        timeSlot: formData.timeSlot,
      };

      console.log("Submitting appointment data:", appointmentData);

      const result = await createAppointment(appointmentData);

      console.log("Appointment created successfully:", result);

      // Reset form on success
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        message: "",
        timeSlot: "",
      });

      toast.success("تم حجز الموعد بنجاح! سنتواصل معك قريباً", {
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
    } catch (error: any) {
      console.error("Error creating appointment:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "فشل في حجز الموعد. يرجى المحاولة مرة أخرى.";

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

      // Handle specific error cases
      if (error.response?.status === 400) {
        setErrors((prev) => ({
          ...prev,
          server: "بيانات النموذج غير صحيحة",
        }));
      } else if (error.response?.status === 409) {
        setErrors((prev) => ({
          ...prev,
          server: "لديك حجز مسبق في هذا الوقت",
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="sticky top-24 bg-white rounded-xl shadow-md p-6 w-full">
      <h2 className="text-2xl font-bold mb-4">احجز موعد لزيارة المشروع</h2>

      {/* Server Error Display */}
      {errors.server && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {errors.server}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextInput
          id="fullName"
          label="الاسم بالكامل"
          name="fullName"
          placeholder="أدخل اسمك"
          value={formData.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
          error={errors.fullName}
          required
        />

        <TextInput
          id="email"
          label="البريد الإلكتروني"
          name="email"
          placeholder="example@mail.com"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          error={errors.email}
          required
        />

        <TextInput
          id="phone"
          label="رقم الهاتف"
          name="phone"
          placeholder="05xxxxxxxx"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          error={errors.phone}
          required
        />

        <SelectInput
          label="اختر موعد الزيارة"
          name="timeSlot"
          options={availableTimes}
          value={formData.timeSlot}
          onChange={(val) => handleChange("timeSlot", val)}
          error={errors.timeSlot}
          required
        />

        <TextareaInput
          id="message"
          label="رسالة (اختياري)"
          name="message"
          placeholder="اكتب أي ملاحظات أو استفسارات هنا"
          value={formData.message}
          onChange={(e) => handleChange("message", e.target.value)}
        />

        <PrimaryButton
          type="submit"
          className="mt-4 !w-full"
          loading={loading}
          disabled={loading}
        >
          {loading ? "جاري الحجز..." : "احجز الزيارة"}
        </PrimaryButton>
      </form>

      {/* Success message would be handled by toast */}
    </section>
  );
}
