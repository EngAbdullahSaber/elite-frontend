"use client";

import { useState } from "react";

type Props = {
  cityId: number;
  cityName: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function DeleteCityConfirm({
  cityId,
  cityName,
  onConfirm,
  onCancel,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await fetch(`/api/cities/${cityId}`, {
        method: "DELETE",
      });
      onConfirm();
    } catch (error) {
      console.error("Failed to delete city:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg bg-white max-w-md mx-auto">
      <h3 className="text-lg font-bold text-gray-800 text-center">
        حذف المدينة
      </h3>
      <p className="text-sm text-gray-600 text-center mb-4">
        هل أنت متأكد أنك تريد حذف مدينة{" "}
        <span className="font-semibold">{cityName}</span>؟
      </p>

      <div className="flex justify-end gap-3 pt-6">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          إلغاء
        </button>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700"
        >
          {loading ? "جارٍ الحذف..." : "تأكيد الحذف"}
        </button>
      </div>
    </div>
  );
}
