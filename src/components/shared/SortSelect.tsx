'use client';

import React from 'react';

type SortOption = {
    value: string;
    label: string;
};

interface SortSelectProps {
    value: string,
    onChange: (val: string) => void,
    options: SortOption[];
}

export default function SortSelect({ options, value, onChange }: SortSelectProps) {


    return (
        <select
            className="w-full bg-transparent px-5 py-2 focus:outline-none border-1 rounded-sm"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        >
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    );
}
