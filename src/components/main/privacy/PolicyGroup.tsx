import React from 'react';
import PolicyCard from './PolicyCard';

interface PolicyGroupProps {
  policies: {
    title: string;
    items: string[];
  }[];
}

export default function PolicyGroup({ policies }: PolicyGroupProps) {
  if (!policies?.length) {
    // graceful empty-state; remove if you never need it
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-center text-neutral-600">
        لا توجد سياسات متاحة حالياً.
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-4 md:p-6 lg:p-8 shadow-lg border border-neutral-200">
      <div
        className="grid grid-cols-12 gap-6  "
        role="list"
        aria-label="مجموعة السياسات"
      >
        {policies.map((policy, idx) => (
          <PolicyCard key={idx} title={policy.title} items={policy.items} />
        ))}
      </div>
    </div>
  );
}
