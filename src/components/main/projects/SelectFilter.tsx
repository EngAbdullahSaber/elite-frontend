'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import React from 'react';

type Option = { value: string; label: string };

interface Props {
    label: string;
    name: string;
    options: Option[];
}

export default function SelectFilter({ label, name, options }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(name, e.target.value);
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="rounded-full border bg-[var(--bg-1)] pr-4">
            <select
                className="w-full bg-transparent px-5 py-3 focus:outline-none"
                aria-label={label}
                defaultValue={searchParams.get(name) || ''}
                onChange={handleChange}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
