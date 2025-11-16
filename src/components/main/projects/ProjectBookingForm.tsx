"use client";

import React, { useState } from "react";
import TextInput from "@/components/shared/Forms/TextInput";
import PrimaryButton from "@/components/shared/Button";
import { createAppointment } from "@/services/appointments/appointments";
import toast from "react-hot-toast";
import { FaClock, FaArrowRight } from "react-icons/fa";
import { CreateCoversions } from "@/services/trackingService/trackingService";

// Define types based on your API
interface CreateAppointmentData {
  propertyId: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
}

// Predefined time slots in 30-minute intervals
const timeSlots = [
  "07:00",
  "07:30",
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
];

export default function ProjectBookingForm({ id }: { id: string }) {
  const [formData, setFormData] = useState({
    appointmentDate: "",
    startTime: "",
    endTime: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    const newFormData = { ...formData, [field]: value };

    // When start time changes, automatically set end time to 1 hour later
    if (field === "startTime" && value) {
      const startIndex = timeSlots.indexOf(value);
      if (startIndex !== -1 && startIndex + 2 < timeSlots.length) {
        // +2 for 1 hour later (2 slots of 30 minutes)
        newFormData.endTime = timeSlots[startIndex + 2];
      } else {
        // If no valid end time (near the end of the day), clear end time
        newFormData.endTime = "";
      }
    }

    setFormData(newFormData);

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.appointmentDate) {
      newErrors.appointmentDate = "تاريخ الزيارة مطلوب";
    } else {
      const selectedDate = new Date(formData.appointmentDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.appointmentDate = "لا يمكن اختيار تاريخ ماضي";
      }
    }

    if (!formData.startTime) {
      newErrors.startTime = "وقت البدء مطلوب";
    }

    if (!formData.endTime) {
      newErrors.endTime = "لا يمكن حجز موعد في هذا الوقت (نهاية اليوم)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatDateForAPI = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0] + "T00:00:00Z";
  };

  const formatTimeForDisplay = (time: string): string => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const period = hour >= 12 ? "م" : "ص";
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${period}`;
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
        propertyId: Number(id),
        appointmentDate: formatDateForAPI(formData.appointmentDate),
        startTime: formData.startTime,
        endTime: formData.endTime,
      };

      const result = await createAppointment(appointmentData);

      // Get user data from sessionStorage safely
      let userData = null;
      try {
        const userString = sessionStorage.getItem("user");
        if (userString) {
          userData = JSON.parse(userString);
        }
      } catch (parseError) {
        console.warn(
          "Failed to parse user data from sessionStorage:",
          parseError
        );
      }

      // Create conversion for customers
      if (userData && userData.userType === "customer" && userData.id) {
        try {
          const visitorId = sessionStorage.getItem("visitor_Id");
          await CreateCoversions({
            type: "appointment",
            visitorId: visitorId,
          });
        } catch (conversionError) {
          console.warn(
            "Failed to create conversion, but appointment was booked:",
            conversionError
          );
          // Don't throw error here - appointment was successful
        }
      }

      // Reset form on success
      setFormData({
        appointmentDate: "",
        startTime: "",
        endTime: "",
      });

      toast.success("تم حجز الموعد بنجاح!", {
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
          server: "هذا الموعد محجوز مسبقاً",
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Filter time slots to exclude the last 2 slots (no room for 1-hour appointment)
  const availableStartTimes = timeSlots.slice(0, -2);

  return (
    <section className="sticky top-24 bg-white rounded-xl shadow-lg border border-gray-100 p-6 w-full">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <FaClock className="text-primary text-xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">
          احجز موعد لزيارة المشروع
        </h2>
        <p className="text-gray-600 mt-2">
          اختر التاريخ والوقت المناسب لزيارتك (مدة الزيارة ساعة واحدة)
        </p>
      </div>

      {/* Server Error Display */}
      {errors.server && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {errors.server}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Date Selection */}
        <div className="bg-gray-50 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📅 تاريخ الزيارة
          </label>
          <TextInput
            id="appointmentDate"
            name="appointmentDate"
            type="date"
            value={formData.appointmentDate}
            onChange={(e) => handleChange("appointmentDate", e.target.value)}
            error={errors.appointmentDate}
            required
            min={getMinDate()}
            className="!bg-white"
          />
        </div>

        {/* Time Selection */}
        <div className="bg-gray-50 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            ⏰ وقت الزيارة
          </label>

          <div className="space-y-4">
            {/* Start Time */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-600">
                وقت البدء
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                {availableStartTimes.map((time) => (
                  <button
                    key={`start-${time}`}
                    type="button"
                    onClick={() => handleChange("startTime", time)}
                    className={`p-3 text-sm rounded-lg border transition-all ${
                      formData.startTime === time
                        ? "bg-primary border-primary text-white"
                        : "bg-white border-gray-300 text-gray-700 hover:border-primary hover:bg-primary/5"
                    }`}
                  >
                    {formatTimeForDisplay(time)}
                  </button>
                ))}
              </div>
              {errors.startTime && (
                <p className="text-red-500 text-xs mt-1">{errors.startTime}</p>
              )}
            </div>

            {/* Automatic End Time Display */}
            {formData.startTime && formData.endTime && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">مدة الزيارة:</span> ساعة واحدة
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                      {formatTimeForDisplay(formData.startTime)}
                    </span>
                    <FaArrowRight className="text-gray-400" />
                    <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full">
                      {formatTimeForDisplay(formData.endTime)}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-blue-600 mt-2 text-center">
                  وقت الانتهاء مضبوط تلقائياً بعد ساعة من وقت البدء
                </p>
              </div>
            )}

            {/* End Time Error */}
            {errors.endTime && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{errors.endTime}</p>
              </div>
            )}
          </div>
        </div>

        <PrimaryButton
          type="submit"
          className="mt-2 !w-full py-3 text-lg font-semibold"
          loading={loading}
          disabled={loading || !formData.endTime}
        >
          {loading ? "جاري الحجز..." : "تأكيد الحجز"}
        </PrimaryButton>
      </form>
    </section>
  );
}
