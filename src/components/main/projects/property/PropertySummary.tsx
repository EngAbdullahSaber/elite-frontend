'use client';

import React from 'react';

interface PropertySummaryProps {
    title: string;
    price: string;
    location: string;
    rooms: string;
    baths: string;
    area: string;
}

export default function PropertySummary({
    title,
    price,
    location,
    rooms,
    baths,
    area,
}: PropertySummaryProps) {
    return (
        <section className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <h1 className="text-3xl font-bold mb-2 text-[var(--neutral-700)]">{title}</h1>
            <p className="text-xl font-semibold text-[var(--primary)] mb-4">السعر: {price} ريال</p>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-[var(--neutral-700)]">
                <li><strong>الموقع:</strong> {location}</li>
                <li><strong>عدد الغرف:</strong> {rooms}</li>
                <li><strong>عدد الحمامات:</strong> {baths}</li>
                <li><strong>المساحة:</strong> {area}</li>
            </ul>
        </section>
    );
}
