'use client';

import React from 'react';

type OptionType = {
    value: string;
    label: string;
};

type SelectInputProps = {
    label: string;
    name: string;
    options: OptionType[];
    value?: string;
    className?: string;
    small?: boolean;
    onChange?: (val: string) => void;
    error?: string; // 👈 Add error prop
};

export default function SelectInput({
    label,
    name,
    options,
    value,
    className,
    small,
    onChange,
    error,
    ...props
}: SelectInputProps) {
    return (
        <div className={`col-span-12 ${className}`}>
            <label className="text-xl font-medium block mb-3">{label}</label>
            <div
                className={`border text-left bg-[var(--bg-1)] rounded-full ${small ? 'px-3' : 'px-4'
                    } ${error ? 'border-red-500' : 'border-gray-300'}`}
            >
                <select
                    name={name}
                    value={value}
                    className={`w-full bg-transparent ${small ? 'py-2' : 'py-3'} focus:outline-none`}
                    onChange={(e) => onChange?.(e.target.value)}
                    {...props}
                >
                    {options.map((opt, i) => (
                        <option key={i} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>
            {error && (
                <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>
            )}
        </div>
    );
}
