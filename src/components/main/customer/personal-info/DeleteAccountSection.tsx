"use client";

import Card from "@/components/shared/Card";
import React, { useState } from "react";

export default function DeleteAccountSection() {
  const [confirmed, setConfirmed] = useState(false);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmed(e.target.checked);
  };

  const handleDelete = () => {
    if (confirmed) {
      // منطق الحذف هنا
    }
  };

  return (
    <Card>
      <div className="relative">
        <button className="w-full text-start">
          <div className="rounded-2xl flex justify-between items-center">
            <h3 className="text-xl font-bold text-red-600">حذف الحساب</h3>
          </div>
        </button>

        <div className="pt-6">
          <p className="text-gray-600 mb-4 leading-relaxed">
            عند حذف حسابك، ستفقد الوصول إلى خدمات منصة بليس وايز، وسيتم حذف
            بياناتك الشخصية بشكل دائم. يمكنك التراجع عن الحذف خلال 14 يومًا.
          </p>

          <div className="mb-6">
            <div className="flex items-center gap-3">
              <input
                id="confirm-delete"
                type="checkbox"
                checked={confirmed}
                onChange={handleCheckboxChange}
                className="accent-red-600 scale-125"
              />
              <label
                htmlFor="confirm-delete"
                className="text-sm text-gray-700 cursor-pointer"
              >
                أؤكد أنني أرغب في حذف حسابي.
              </label>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDelete}
            disabled={!confirmed}
            className={`w-full py-3 px-6 rounded-full font-semibold transition ${
              confirmed
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-red-200 text-white cursor-not-allowed"
            }`}
          >
            حذف الحساب
          </button>
        </div>
      </div>
    </Card>
  );
}
