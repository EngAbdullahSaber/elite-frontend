'use client';

import React from 'react';

interface ResetFiltersButtonProps {
    onClick: () => void;
}

export default function ResetFiltersButton({ onClick }: ResetFiltersButtonProps) {
    return (
        <button
            onClick={onClick}
            className="btn-outline flex justify-center items-center gap-2 text-primary font-semibold w-full text-center rounded-full hover:bg-primary-light"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.023 9.348h4.992M2.985 19.644v-4.992h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M20.015 4.874v4.99" />
            </svg>
            إعادة تعيين الفلاتر
        </button>
    );
}
