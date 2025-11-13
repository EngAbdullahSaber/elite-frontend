"use client";

import React from "react";

interface DetailItem {
  name: string;
  value: string | string[];
}

interface PropertyInfoSectionProps {
  details?: Record<string, DetailItem>;
}

export default function PropertyInfoSection({
  details,
}: PropertyInfoSectionProps) {
  const hasDetails = details && Object.keys(details).length > 0;
  return (
    <section className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-2xl font-bold mb-4">معلومات العقار</h2>
      {hasDetails ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-[var(--neutral-700)]">
          {Object.entries(details!).map(([key, { name, value }]) => (
            <li
              key={key}
              className="bg-white border border-[var(--border)] p-4 rounded-xl shadow-sm"
            >
              <p className="font-semibold mb-1">{name}</p>
              <p>{Array.isArray(value) ? value.join(", ") : value}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[var(--neutral-700)] text-lg">
          لا توجد معلومات متاحة لهذا العقار حالياً.
        </p>
      )}
    </section>
  );
}
