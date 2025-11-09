// app/dashboard/admin/influencers/[influencerId]/InfluencerStatusControl.tsx
"use client";

import { updateInfluencerActivation } from "@/services/Influencer/Influencer";
import { InfluencerRow, InfluencerStatus } from "@/types/dashboard/Influencer";
import { useState } from "react";

type Props = {
  currentStatus: InfluencerStatus;
  influencer: InfluencerRow;
  onStatusChange?: () => void;
};

export default function InfluencerStatusControl({
  currentStatus,
  influencer,
  onStatusChange,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (newStatus: InfluencerStatus) => {
    try {
      setIsLoading(true);

      await updateInfluencerActivation(
        parseInt(influencer.id),
        newStatus === "active"
      );

      if (onStatusChange) {
        onStatusChange();
      }
    } catch (error) {
      console.error("Error updating influencer status:", error);
      alert("فشل في تحديث حالة المروج");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <h4 className="text-lg font-semibold mb-3">التحكم في الحالة</h4>

      <div className="flex flex-col gap-3">
        <button
          onClick={() => handleStatusChange("active")}
          disabled={isLoading || currentStatus === "active"}
          className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${
            currentStatus === "active"
              ? "bg-green-600 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isLoading ? "جاري التحديث..." : "تفعيل المروج"}
        </button>

        <button
          onClick={() => handleStatusChange("inactive")}
          disabled={isLoading || currentStatus === "inactive"}
          className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${
            currentStatus === "inactive"
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-gray-600 hover:bg-gray-700"
          } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isLoading ? "جاري التحديث..." : "إيقاف المروج"}
        </button>
      </div>

      <div className="mt-3 text-sm text-gray-600">
        <p>
          الحالة الحالية:{" "}
          <span className="font-medium">
            {currentStatus === "active" ? "نشط" : "غير نشط"}
          </span>
        </p>
      </div>
    </div>
  );
}
