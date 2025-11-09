'use client';

import React from 'react';

interface GuaranteesSectionProps {
    guarantees?: string[];
}

export default function GuaranteesSection({ guarantees }: GuaranteesSectionProps) {
    const hasGuarantees = guarantees && guarantees.length > 0;

    return (
        <section className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">الضمانات</h2>
            {hasGuarantees ? (
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-[var(--neutral-700)]">
                    {guarantees!.map((item, idx) => (
                        <li
                            key={idx}
                            className="bg-white border border-[var(--border)] p-4 rounded-xl shadow-sm"
                        >
                            <p className="font-semibold">{item}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-[var(--neutral-700)] text-lg">لا توجد ضمانات متاحة لهذا العقار حالياً.</p>
            )}
        </section>
    );
}
