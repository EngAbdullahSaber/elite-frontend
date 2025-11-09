'use client';

import React from 'react';

interface TimeOnlyInputProps {
    id: string;
    name: string;
    label: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    error?: string;
    className?: string;
}

export default function TimeOnlyInput({
    id,
    name,
    label,
    placeholder,
    value,
    onChange,
    required = false,
    error,
    className,
    ...props
}: TimeOnlyInputProps) {
    return (
        <div className="w-full">
            <label htmlFor={id} className="text-base font-medium block mb-2 text-[var(--dark)]">
                {label}
            </label>
            <input
                id={id}
                name={name}
                type="time"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                {...props}
                className={`w-full bg-gray-50 border text-gray-900 leading-none px-3 py-2 rounded-lg ${className} `}
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
    );
}
