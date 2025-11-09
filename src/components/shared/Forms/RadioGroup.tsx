'use client';

import React from 'react';

type RadioOption = {
    value: string;
    label: string;
};

type RadioGroupProps = {
    name: string;
    value: string;
    onChange: (val: string) => void;
    options: RadioOption[];
    label?: string;
};

export function RadioGroup({ name, value, onChange, options, label }: RadioGroupProps) {
    return (
        <div>
            {label && <p className="mb-4 text-xl font-medium">{label}</p>}
            <ul className="flex gap-6 flex-wrap">
                {options.map((opt) => (
                    <li key={opt.value}>
                        <div className="flex items-center gap-2">
                            <input
                                className="accent-[var(--primary)] scale-125"
                                id={`${name}-${opt.value}`}
                                type="radio"
                                name={name}
                                value={opt.value}
                                checked={value === opt.value}
                                onChange={() => onChange(opt.value)}
                            />
                            <label
                                className="inline-block text-lg font-medium cursor-pointer"
                                htmlFor={`${name}-${opt.value}`}
                            >
                                {opt.label}
                            </label>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
