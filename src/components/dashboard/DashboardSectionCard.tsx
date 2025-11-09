'use client';

import React from 'react';
type Props = {
    children: React.ReactNode;
    title?: string;
    className?: string;
};

export default function DashboardSectionCard({ children, className, title }: Props) {
    return (
        <section
            className={`
                ' p-3 md:py-6 lg:py-8 md:px-8 lg:px-10 border rounded-2xl bg-white relative z-[1]'
                ${className}
            `}
        >
            {title && <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6">{title}</h3>}
            {children}
        </section>
    );
}
