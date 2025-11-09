'use client';

import React from 'react';

interface PropertyDescriptionSectionProps {
    description?: string;
}

export default function PropertyDescriptionSection({ description }: PropertyDescriptionSectionProps) {
    const hasDescription = description && description.trim().length > 0;

    return (
        <section className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">وصف العقار</h2>
            <p className="text-[var(--neutral-700)] leading-relaxed text-lg">
                {hasDescription ? description : 'لا يوجد وصف متاح لهذا العقار حالياً.'}
            </p>
        </section>
    );
}
